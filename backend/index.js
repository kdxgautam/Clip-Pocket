import express from "express";
import youtubedl from "youtube-dl-exec";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your React app's origin
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
    if (fs.existsSync(filePath)) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${path.basename(filePath)}`
      );
    }
    next();
  },
  express.static(outputDir)
);

// Route to get available formats
app.post("/formats", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: "videoUrl is required" });
  }
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

        res.status(200).json({ title: title, classUrl: classUrl });
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
  const { videoUrl, quality, classUrl } = req.body;
  console.log(quality);

  if (!videoUrl || !quality || !classUrl) {
    return res.status(400).json({ error: "please select quality" });
  }


  const timestamp = Date.now();
  const filePath = path.join(outputDir, `output-${timestamp}.mp4`);
  if (classUrl === "YTV") {
    try {
      const newUrl = normalizeYouTubeUrl(videoUrl);
    const videoInfo = await getVideoInfo(newUrl);

    await downloadVideo(newUrl, filePath, quality);

    const downloadUrl = `${req.protocol}://${req.get("host")}/output/output-${timestamp}.mp4`;

    res.status(200).json({
      message: "Download complete.",
      downloadUrl,
      title: videoInfo.title,
      videoUrl,
    });
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
    } catch (error) {
      console.error("Error during download:", error);
      res.status(500).json({
        error: "Failed to download video.",
        details: error.message,
      });
    }
  }
});




// Function to download a video
async function downloadVideo(videoUrl, outputPath, quality) {
  try {
    if(quality === 'best'){
      await youtubedl(videoUrl, {
        output: outputPath,
        format: `best`,
        mergeOutputFormat: "mp4",
      });
    }else{

    await youtubedl(videoUrl, {
      output: outputPath,
      format: `bestvideo[height<=${quality}]+bestaudio/best`,
      mergeOutputFormat: "mp4",
    });}
    console.log("Download complete!");
  } catch (error) {
    console.error("Error during video download:", error);
    throw error;
  }
}

async function availformats(videoUrl) {
  const videoInfo = await youtubedl(videoUrl, {
    dumpSingleJson: true,
    noWarnings: true,
  });

  const formats = videoInfo.formats
    .filter((format) => format.height || format.resolution) // Ensure it's a video format
    .map((format) => ({
      formatId: format.format_id,
      resolution: format.height || 0, // Default to 0 for non-video formats
      ext: format.ext,
      filesize: format.filesize || null,
    }));

  // Filter for major qualities and avoid duplicates
  const majorQualities = [144, 360, 480, 1080];
  const seenResolutions = new Set();

  const uniqueFormats = formats.filter((format) => {
    const resolution = format.resolution;
    if (
      (majorQualities.includes(resolution) || resolution > 1080) &&
      !seenResolutions.has(resolution)
    ) {
      seenResolutions.add(resolution);
      return true;
    }
    return false;
  });

  return uniqueFormats;
}

function classifyUrl(url) {
  if (!url || typeof url !== "string") {
    return "Invalid URL";
  }

  const patterns = {
    youtubePlaylist:
      /^(https?:\/\/)?(www\.)?(youtube\.com\/playlist\?list=|youtu\.be\/\?list=)/,
    youtubeVideo:
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/,
    // instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/,
    // reddit: /^(https?:\/\/)?(www\.)?reddit\.com\/.+/,
    facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.+/, // Matches any Facebook URL
    other: /^https?:\/\/.+/, // Matches any other URL starting with "http" or "https"
  };

  if (patterns.youtubePlaylist.test(url)) {
    return "YTPL";
  } else if (patterns.youtubeVideo.test(url)) {
    return "YTV";
  } else if (patterns.facebook.test(url)) {
    return "Fb";
  } else if (patterns.other.test(url)) {
    return "Other";
  } else {
    return "Inv";
  }
}

// Function to normalize YouTube URLs
function normalizeYouTubeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const videoId = parsedUrl.searchParams.get("v");

    // If it's a playlist, return the video link with `v` parameter
    if (parsedUrl.searchParams.get("list") && videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    // For short links (like youtu.be), extract video ID and construct the full URL
    if (parsedUrl.hostname === "youtu.be" && parsedUrl.pathname.slice(1)) {
      return `https://www.youtube.com/watch?v=${parsedUrl.pathname.slice(1)}`;
    }

    // Return the original URL if it's not a playlist or short link
    return url;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

// Function to get video info
const getVideoInfo = async (url) => {
  try {
    const info = await youtubedl(url, { dumpSingleJson: true });
    return info;
  } catch (error) {
    console.error("Error fetching video info:", error);
    throw new Error("Failed to fetch video information.");
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
