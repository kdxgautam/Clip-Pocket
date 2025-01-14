import { useState } from "react";
import axios from "axios";
import { LuDownload } from "react-icons/lu";


function App() {
  const [inputValue, setInputValue] = useState("");
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [urlClass, setUrlClass] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

  const getEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  // const fetchFormats = async (url) => {
  //   try {
  //     const response = await axios.post("http://localhost:3000/formats", {
  //       videoUrl: url,
  //     });
  //     console.log(response.data);
  //     if (response.data.classUrl == "Other") {
  //       setUrlClass(response.data.classUrl);
  //     } else {
  //       setFormats(response.data.formats);
  //       setVideoUrl(response.data.videoUrl);
  //       console.log(formats)
  //       setUrlClass(response.data.classUrl);
  //     }
  //     console.log(formats);
  //   } catch (error) {
  //     console.error("Error fetching formats:", error);
  //     setErrorMessage("Failed to fetch formats. Please try again.");
  //   }

  // };

  const fetchFormats = async (url) => {
    try {
      setErrorMessage("");
      const response = await axios.post("http://localhost:3000/formats", {
        videoUrl: url,
      });

      if (response.data.classUrl === "YTPL") {
        setUrlClass(response.data.classUrl);
        setPlaylist(response.data.playlist);
      } else if (response.data.classUrl === "YTV") {
        setFormats(response.data.formats);
        setVideoUrl(response.data.videoUrl);
        setUrlClass(response.data.classUrl);
      } else {
        setUrlClass("Other");
        setThumbnail(response.data.thumbnailUrl);
      }
    } catch (error) {
      console.error("Error fetching formats:", error);
      setErrorMessage("Failed to fetch formats. Please try again.");
    }
  };

  // const handleDownload = async (quality) => {
  //   if (!inputValue.trim() || !quality) {
  //     setErrorMessage("Please enter a valid URL and select a quality.");
  //     return;
  //   }

  //   setLoading(true);
  //   setErrorMessage("");

  //   try {
  //     const response = await axios.post("http://localhost:3000/download", {
  //       videoUrl: inputValue,
  //       quality,
  //       classUrl: urlClass,
  //     });

  //     const link = document.createElement("a");
  //     link.href = response.data.downloadUrl;
  //     link.setAttribute("download", `video.mp4`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Error during download:", error);
  //     setErrorMessage("Failed to download video. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDownload = async (quality, videoUrl = inputValue) => {
    if (!videoUrl.trim() || !quality) {
      setErrorMessage("Please enter a valid URL and select a quality.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:3000/download", {
        videoUrl,
        quality,
        classUrl: urlClass,
      });

      const link = document.createElement("a");
      link.href = response.data.downloadUrl;
      link.setAttribute("download", `video.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(thumbnail);
    } catch (error) {
      console.error("Error during download:", error);
      setErrorMessage("Failed to download video. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-custom-bg">
      <div className="navbar bg-base-100">
        <a className="btn btn-ghost text-xl text-white">ClipPocket</a>
      </div>
      <div
        className={`min-h-screen flex flex-col px-4  items-center justify-center   text-black`}
      >
        {/* Input Field */}
        <div className="space-y-4 self-center  ">
          <input
            type="text"
            placeholder="Enter video URL"
            value={inputValue}
            onChange={(e) => {
              const url = e.target.value;
              setInputValue(url);
              if (url.trim()) fetchFormats(url);
            }}
            className="p-2 mb-8 xs:w-[300px] sm:w-[400px] md:w-[50vw] lg:[40vw]  rounded border-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="flex h-3/4 flex-col space-y-4  md:w-[50vw]  items-center justify-center mb-10">
          {/* Display Formats */}

          {inputValue && urlClass == "YTV" && (
            <div className="mt-4   flex flex-col lg:flex-row items-center space-y-4 gap-8">
              <iframe
                src={getEmbedUrl(videoUrl)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="w-[200px] xxs:w-[250px] xs:w-[300px] h-[200px] rounded-lg shadow-md object-cover"
              ></iframe>
              <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 gap-3">
                {formats.map((format) => (
                  
                  <button
                    key={format.resolution}
                    disabled={loading}
                    onClick={() => handleDownload(format.resolution)}
                    className="overflow-hidden px-2 xs:px-4 flex flex-row justify-center items-center gap-2 py-2 rounded bg-blue-700 text-white text-center lg:px-1.5 hover:bg-blue-900 font-bold"
                  >
                    <LuDownload /> {format.resolution + "p"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {inputValue && urlClass === "YTPL" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 md:gap-10 md:justify-evenly   lg:grid-cols-3 lg:gap-10 gap-4 justify-items-center">
            {playlist.map((video, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-lg w-full max-w-sm"
              >
                <iframe
                  src={getEmbedUrl(video.url)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full h-[22vh] rounded-sm"
                ></iframe>
                <h3 className="mt-2 text-center font-semibold">
                  {video.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {video.formats.map((format) => (
                    <button
                      key={format.formatId}
                      disabled={loading}
                      onClick={() =>
                        handleDownload(format.resolution, video.url)
                      }
                      className="px-3 flex flex-row items-center justify-center gap-2 py-1 rounded bg-blue-700 text-white hover:bg-blue-900 font-medium"
                    >
                      <LuDownload /> {format.resolution + "p"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {inputValue && urlClass == "Other" && (
          <div className="mt-4 flex flex-col items-center space-y-4">
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Video Thumbnail"
                className="w-[180px] h-[130px] xs:w-[300px] xs:h-[200px] sm:w-[330px] sm:h-[250px] rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-blue-500 transition-all duration-300"
              />
            )}
            <button
              disabled={loading}
              onClick={() => handleDownload("best")}
              className="px-4 py-2 flex flex-row items-center gap-2 rounded bg-blue-700 text-white hover:bg-blue-900 font-bold "
            >
              <LuDownload /> {"Download"}
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white"></div>
        )}
      </div>
    </main>
  );
}

export default App;
