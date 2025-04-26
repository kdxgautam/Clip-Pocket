import express from "express";

import youtubedl from "youtube-dl-exec";
import fs from "fs";
import path from "path";
import cors from "cors";
import axios from "axios";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";



import { classifyUrl, normalizeYouTubeUrl } from "./helpers/Urlhelpers.js";
import { availformats,getVideoInfo } from "./helpers/Videohelpers.js";
import { downloadVideo } from "./helpers/downloader.js";


const app = express();
const PORT = process.env.PORT || 4000;
dotenv.config();

// Middleware to limit the number of requests from a single IP
// This helps prevent abuse and DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});


// Middleware configuration
// Set security HTTP headers
app.use(limiter);
// Set security HTTP headers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 
       process.env.ALLOWED_ORIGIN.split(",")

    , // Allow only your React app's origin
    methods: ["GET", "POST"], // Allow specific HTTP methods
  })
);

// Ensure the output directory exists
const outputDir = path.resolve("./output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Serve the output folder statically
app.use(
  "/output",
  (req, res, next) => {
    const filePath = path.join(outputDir, req.url);
    if (!filePath.startsWith(outputDir)) {
      return res.status(403).send("Access denied");
    }

    if (fs.existsSync(filePath)) {
      // Set headers to prompt download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${path.basename(filePath)}`
      );

      // Schedule file deletion after 5 minutes
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete file ${filePath}:`, err);
            else console.log(`Deleted file: ${filePath}`);
          });
        }
      }, 5 * 60 * 1000); // 5 minutes
    }

    next();
  },
  express.static(outputDir)
);


const thumbnailsDir = path.resolve("./thumbnails");
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}
app.use("/thumbnails",express.static(thumbnailsDir));

// Route to get available formats
app.post("/formats", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: "videoUrl is required" });
  }


  // Check if the URL is valid
  const classUrl = classifyUrl(videoUrl);
  try {
    if (classUrl === "YTV") {
      const newUrl = normalizeYouTubeUrl(videoUrl);
      try {
        const videoInfo = await youtubedl(newUrl, {
          dumpSingleJson: true,
          noWarnings: true,
        });

        const availformat = await availformats(newUrl);

        res.status(200).json({
          videoUrl: newUrl,
          title: videoInfo.title,
          formats: availformat,
          classUrl: classUrl,
        });
      } catch (error) {
        console.error("Error fetching formats:", error);
        res
          .status(500)
          .json({ error: "Failed to fetch youtube Video formats" });
      }
    } else if (classUrl === "YTPL") {
      try {
        // Fetch playlist videos
        const playlistInfo = await youtubedl(videoUrl, {
          dumpSingleJson: true,
          flatPlaylist: true,
        });

        const videos = playlistInfo.entries.map((entry) => ({
          id: entry.id,
          url: `https://www.youtube.com/watch?v=${entry.id}`,
          title: entry.title,
        }));

        const downloadUrls = [];
        console.log(downloadUrls)

        // Download each video in the playlist
        for (const video of videos) {
          // console.log(video.url);

          // await downloadVideo(video.url, outputPath, quality);
          const availformat = await availformats(video.url);
          console.log(availformat);

          downloadUrls.push({
            title: video.title,
            url: video.url,
            formats: availformat,
          });
        }

        res.status(200).json({
          playlist: downloadUrls,
          classUrl: classUrl,
        });
      } catch (error) {
        res.status(500).json({
          error: "Failed to get playlist info",
          details: error.message,
        });
      }
    } else if (classUrl === "Fb") {
      res.status(200).json({
        message: "Facebook video download not available for now",
        classUrl: classUrl,
      });
    } else if (classUrl === "Other") {
      try {
        const videoInfo = await youtubedl(videoUrl, {
          dumpSingleJson: true,
          noWarnings: true,
        });
        const title = videoInfo.title;
        const thumbnailUrl = videoInfo.thumbnail;

        // Download the thumbnail
        const response = await axios.get(thumbnailUrl, {
          responseType: "stream",
        });

        const timestamp = Date.now();
        const fileName = `thumbnail-${timestamp}.jpg`;
        const filePath = path.join(thumbnailsDir, fileName);

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);
        writer.on("finish", () => {
          const thumbnailPath = `${req.protocol}://${req.get(
            "host"
          )}/thumbnails/${fileName}`;
          console.log(thumbnailPath);

          res.status(200).json({
            title: title,
            classUrl: classUrl,
            thumbnailUrl: thumbnailPath,
          });
        });
        setTimeout(() => {
          if (fs.existsSync(thumbnailPath)) {
            fs.unlink(thumbnailPath, (err) => {
              if (err) console.error(`Failed to delete file ${thumbnailPath}:`, err);
              else console.log(`Deleted file: ${thumbnailPath}`);
            });
          }
        }, 1 * 60 * 100); // 10 minutes
      } catch (error) {
        console.error("Error fetching formats:", error);
        res.status(500).json({ error: "Failed to fetch formats" });
      }
    } else {
      res.status(400).json({ error: "Invalid URL" });
    }
    console.log(classUrl);
    const newUrl = normalizeYouTubeUrl(videoUrl);
    console.log(newUrl);
  } catch (error) {
    console.error("Error fetching formats:", error);
    res.status(500).json({ error: "Failed to fetch formats" });
  }
});

// Route to download a video
app.post("/download", async (req, res) => {
  const { videoUrl, quality = "best", classUrl } = req.body;
  console.log(quality);

  if (!videoUrl || !quality || !classUrl) {
    return res.status(400).json({ error: "please select quality" });
  }

  const timestamp = Date.now();
  const filePath = path.join(outputDir, `output-${timestamp}.mp4`);
  if (classUrl === "YTV" || classUrl === "YTPL") {
    try {
      const newUrl = normalizeYouTubeUrl(videoUrl);
      const videoInfo = await getVideoInfo(newUrl);

      await downloadVideo(newUrl, filePath, quality);

      const downloadUrl = `${req.protocol}://${req.get(
        "host"
      )}/output/output-${timestamp}.mp4`;

      res.status(200).json({
        message: "Download complete.",
        downloadUrl,
        title: videoInfo.title,
        videoUrl,
      });
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete file ${filePath}:`, err);
            else console.log(`Deleted file: ${filePath}`);
          });
        }
      }, 1 * 60 * 100); // 10 minutes
    } catch (error) {
      console.error("Error during download:", error);
      res.status(500).json({
        error: "Failed to download video.",
        details: error.message,
      });
    }
  } else if (classUrl === "Other") {
    try {
      const videoInfo = await getVideoInfo(videoUrl);

      await downloadVideo(videoUrl, filePath, quality);

      const downloadUrl = `${req.protocol}://${req.get(
        "host"
      )}/output/output-${timestamp}.mp4`;

      res.status(200).json({
        message: "Download complete.",
        downloadUrl,
        title: videoInfo.title,
        videoUrl,
      });
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete file ${filePath}:`, err);
            else console.log(`Deleted file: ${filePath}`);
          });
        }
      }, 10 * 60 * 1000); // 10 minutes
    } catch (error) {
      console.error("Error during download:", error);
      res.status(500).json({
        error: "Failed to download video.",
        details: error.message,
      });
    }
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
