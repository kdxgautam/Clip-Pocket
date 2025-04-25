import youtubedl from "youtube-dl-exec";


// Function to download a video
export async function downloadVideo(videoUrl, outputPath, quality) {
    try {
      if (quality === "best") {
        await youtubedl(videoUrl, {
          output: outputPath,
          format: `best`,
          mergeOutputFormat: "mp4",
        });
      } else {
        await youtubedl(videoUrl, {
          output: outputPath,
          format: `bestvideo[height<=${quality}]+bestaudio/best`,
          mergeOutputFormat: "mp4",
        });
      }
      console.log("Download complete!");
    } catch (error) {
      console.error("Error during video download:", error);
      throw error;
    }
  }
  