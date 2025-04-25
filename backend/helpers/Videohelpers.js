

import youtubedl from "youtube-dl-exec";


export async function availformats(videoUrl) {
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



// Function to get video info
export const getVideoInfo = async (url) => {
  try {
    const info = await youtubedl(url, { dumpSingleJson: true });
    return info;
  } catch (error) {
    console.error("Error fetching video info:", error);
    throw new Error("Failed to fetch video information.");
  }
};
