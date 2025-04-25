
import youtubedl from "youtube-dl-exec";


// Function to normalize YouTube URLs
export function normalizeYouTubeUrl(url) {
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



export function classifyUrl(url) {
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
