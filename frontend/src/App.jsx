import { useState } from "react";
import axios from "axios";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const fetchFormats = async (url) => {
    try {
      const response = await axios.post("http://localhost:3000/formats", {
        videoUrl: url,
      });
      setFormats(response.data.formats);
    } catch (error) {
      console.error("Error fetching formats:", error);
      setErrorMessage("Failed to fetch formats. Please try again.");
    }
  };

  const handleDownload = async (quality) => {
    if (!inputValue.trim() || !quality) {
      setErrorMessage("Please enter a valid URL and select a quality.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:3000/download", {
        videoUrl: inputValue,
        quality,
      });

      const link = document.createElement("a");
      link.href = response.data.downloadUrl;
      link.setAttribute("download", `video.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during download:", error);
      setErrorMessage("Failed to download video. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center  bg-blue-500 text-black`}
    >
      {/* Toggle Dark Mode */}
     

      {/* Input Field */}
      <div className="flex flex-col space-y-4 items-center">
        <input
          type="text"
          placeholder="Enter video URL"
          value={inputValue}
          onChange={(e) => {
            const url = e.target.value;
            setInputValue(url);
            if (url.trim()) fetchFormats(url);
          }}
          className="p-2 w-30vw rounded border-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 sm:w-[50vw]"
        />
      </div>

      {/* Display Formats */}
      {inputValue && formats.length > 0 && (
        <div className="mt-4 flex flex-col items-center space-y-4">
          <iframe
            src={getEmbedUrl(inputValue)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="w-52 xxs:w-[17rem] xs:w-[60vw] md:w-[32rem] h-52 xxs:h-[9rem] xs:h-[30vw] md:h-[21rem]"
          ></iframe>

          <div className="flex flex-wrap gap-4 mt-4">
            {formats.map((format) => (
              <button
              disabled={loading}
                key={format.resolution}
                onClick={() => handleDownload(format.resolution)}
                className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-900 font-bold"
              >
                {format.resolution + "p"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white"></div>
      )}
    </div>
  );
}

export default App;
