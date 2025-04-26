import React, { useState, useCallback } from "react";
import { Download, Loader, AlertCircle } from "lucide-react";
import PlaceholderBox from "../components/PlaceholderBox";

// const PORT:number = 4000;

interface Format {
  resolution: string;
  formatId?: string;
}

interface PlaylistVideo {
  title: string;
  url: string;
  formats: Format[];
}

interface ApiResponse {
  classUrl: "YTPL" | "YTV" | "Other";
  formats?: Format[];
  videoUrl?: string;
  playlist?: PlaylistVideo[];
  thumbnailUrl?: string;
  downloadUrl?: string;
}

const Hero = () => {
  const [inputValue, setInputValue] = useState("");
  const [formats, setFormats] = useState<Format[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [urlClass, setUrlClass] = useState<"YTPL" | "YTV" | "Other" | "">("");
  const [videoUrl, setVideoUrl] = useState("");
  const [playlist, setPlaylist] = useState<PlaylistVideo[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [activeVideo, setActiveVideo] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

  const resetState = useCallback(() => {
    setFormats([]);
    setVideoUrl("");
    setPlaylist([]);
    setThumbnail("");
    setUrlClass("");
    setActiveVideo(0);
    setErrorMessage("");
    setLoading(false);
  }, []);

  // Function to extract video ID from URL and return the embed URL
  const getEmbedUrl = useCallback((url: string): string => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  }, []);

  // Function to handle input change
  // and reset state if the URL changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setInputValue(url);

    if (url !== inputValue) {
      resetState();
    }
  };

  const fetchFormats = useCallback(
    async (url: string) => {
      try {
        setErrorMessage("");
        setLoading(true);

        

        const response = await fetch(`${API_URL}/formats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoUrl: url }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: ApiResponse = await response.json();
        console.log("API Response:", data);

        switch (data.classUrl) {
          case "YTPL":
            setUrlClass("YTPL");
            setPlaylist(data.playlist || []);
            break;
          case "YTV":
            setFormats(data.formats || []);
            setVideoUrl(data.videoUrl || "");
            setUrlClass("YTV");
            break;
          case "Other":
            setUrlClass("Other");
            setThumbnail(data.thumbnailUrl || "");
            break;
          default:
            throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching formats:", error);
        setErrorMessage(
          "Failed to fetch video information. Please check the URL and try again."
        );
        resetState();
      } finally {
        setLoading(false);
      }
    },
    [resetState, API_URL]
  );

  const handleDownload = async (
    quality: string,
    videoUrl: string = inputValue
  ) => {
    if (!videoUrl.trim()) {
      setErrorMessage("Please enter a URL.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      if (!urlClass) {
        await fetchFormats(videoUrl);
        setLoading(false);
        return;
      }

     

      const response = await fetch(`${API_URL}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl,
          quality,
          classUrl: urlClass,
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const data: ApiResponse = await response.json();

      if (data.downloadUrl) {
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.setAttribute("download", "video.mp4");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("Download URL not found");
      }
    } catch (error) {
      console.error("Error during download:", error);
      setErrorMessage("Failed to download video. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-start justify-center pt-40 sm:pt-44">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 gap-8 lg:items-start">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Download Videos <span className="text-red-500">Instantly</span>
              </h1>
              <p className="text-xl text-gray-300">
                Fast, free, and easy-to-use Online video downloader. Download
                single videos or entire playlists in HD quality.
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Paste YouTube URL here..."
                  className="flex-1 px-4 py-4 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition duration-200 text-white"
                />
                <button
                  onClick={() => handleDownload("")}
                  disabled={loading || !inputValue}
                  className="px-4 sm:px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  <span className="hidden sm:inline">Fetch Formats</span>
                </button>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-4 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
            </div>

            {/* Show placeholder on mobile when no urlClass */}
            {!urlClass && (
              <div className="lg:hidden">
                <PlaceholderBox />
              </div>
            )}

            {/* Content Area - Conditional rendering based on URL type */}
            {urlClass && (
              <div className="space-y-6">
                {/* Video Preview - For mobile and tablet */}
                <div className="lg:hidden">
                  <div className="bg-neutral-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-xl border border-neutral-700">
                    <div className="aspect-video w-full">
                      {(urlClass === "YTV" || urlClass === "YTPL") && (
                        <iframe
                          src={
                            urlClass === "YTPL"
                              ? getEmbedUrl(playlist[activeVideo]?.url)
                              : getEmbedUrl(videoUrl)
                          }
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          className="w-full h-full rounded-lg shadow-md"
                        />
                      )}
                      {urlClass === "Other" && thumbnail && (
                        <img
                          src={thumbnail}
                          alt="Video Thumbnail"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      )}
                    </div>

                    {urlClass === "YTPL" && playlist[activeVideo] && (
                      <div className="mt-3 text-white">
                        <h3 className="text-sm sm:text-base font-medium line-clamp-2">
                          {playlist[activeVideo].title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                          Video {activeVideo + 1} of {playlist.length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Format Buttons for Single Video */}
                {urlClass === "YTV" && formats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {formats.map((format) => (
                      <button
                        key={format.resolution}
                        disabled={loading}
                        onClick={() => handleDownload(format.resolution)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4" />
                        <span>{format.resolution}p</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Download Button for Other Videos */}
                {urlClass === "Other" && thumbnail && (
                  <button
                    onClick={() => handleDownload("best")}
                    disabled={loading}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader className="animate-spin h-5 w-5" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                    <span>Download Video</span>
                  </button>
                )}

                {/* Playlist Videos Grid/List */}
                {urlClass === "YTPL" && playlist.length > 0 && (
                  <div
                    className={`
                    grid
                    gap-2
                    sm:gap-3
                    grid-cols-1
                    sm:grid-cols-2
                    max-h-[40vh]
                    sm:max-h-[50vh]
                    md:max-h-[60vh]
                    overflow-y-auto
                    scrollbar-thin
                    scrollbar-thumb-red-500
                    scrollbar-track-neutral-800
                    pr-2
                  `}
                  >
                    {playlist.map((video, index) => (
                      <div
                        key={index}
                        className={`
                          p-3
                          sm:p-4 
                          rounded-lg 
                          transition-all 
                          duration-200 
                          cursor-pointer
                          border
                          ${
                            activeVideo === index
                              ? "bg-neutral-800 border-red-500"
                              : "bg-neutral-800/50 hover:bg-neutral-800 border-transparent"
                          }
                        `}
                        onClick={() => setActiveVideo(index)}
                      >
                        <div className="flex flex-col space-y-2 sm:space-y-3">
                          <h3 className="text-sm sm:text-base text-white font-medium line-clamp-2">
                            {video.title}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {video.formats.map((format) => (
                              <button
                                key={format.formatId}
                                disabled={loading}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(format.resolution, video.url);
                                }}
                                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded transition duration-200 disabled:opacity-50"
                              >
                                <Download className="h-3 w-3" />
                                <span>{format.resolution}p</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column Preview - Desktop only */}
          <div className="hidden lg:block">
            {urlClass ? (
              <div className="sticky top-32 bg-neutral-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-xl border border-neutral-700">
                <div className="aspect-video w-full">
                  {(urlClass === "YTV" || urlClass === "YTPL") && (
                    <iframe
                      src={
                        urlClass === "YTPL"
                          ? getEmbedUrl(playlist[activeVideo]?.url)
                          : getEmbedUrl(videoUrl)
                      }
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      className="w-full h-full rounded-lg shadow-md"
                    />
                  )}
                  {urlClass === "Other" && thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Video Thumbnail"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  )}
                </div>

                {urlClass === "YTPL" && playlist[activeVideo] && (
                  <div className="mt-4 text-white">
                    <h3 className="font-medium line-clamp-2">
                      {playlist[activeVideo].title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Video {activeVideo + 1} of {playlist.length}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <PlaceholderBox />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
