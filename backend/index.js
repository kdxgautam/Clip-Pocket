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
      res.setHeader("Content-Disposition", `attachment; filename=${path.basename(filePath)}`);
    }
    next();
  },
  express.static(outputDir)
);

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

// Route to get available formats
app.post("/formats", async (req, res) => {
  const { videoUrl } = req.body;
  const newUrl = normalizeYouTubeUrl(videoUrl);

  if (!videoUrl) {
    return res.status(400).json({ error: "videoUrl is required" });
  }

  try {
    const videoInfo = await youtubedl(newUrl, {
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


    res.status(200).json({
      title: videoInfo.title,
      formats: uniqueFormats,
    });
  } catch (error) {
    console.error("Error fetching formats:", error);
    res.status(500).json({ error: "Failed to fetch formats" });
  }
});

// Route to download a video
app.post("/download", async (req, res) => {
  const { videoUrl, quality } = req.body;
  console.log(quality)

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required." });
  }

  if (isNaN(quality) || quality < 144 || quality > 2160) {
    return res.status(400).json({ error: "Invalid quality value. Must be between 144 and 2160." });
  }

  const timestamp = Date.now();
  const filePath = path.join(outputDir, `output-${timestamp}.mp4`);

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
});

// Function to download a video
async function downloadVideo(videoUrl, outputPath, quality) {
  try {
    await youtubedl(videoUrl, {
      output: outputPath,
      format: `bestvideo[height<=${quality}]+bestaudio/best`,
      mergeOutputFormat: "mp4",
    });
    console.log("Download complete!");
  } catch (error) {
    console.error("Error during video download:", error);
    throw error;
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
