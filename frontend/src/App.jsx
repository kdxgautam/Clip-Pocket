import { useState } from "react";
import axios from "axios";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formats, setFormats] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
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
      setTitle(response.data.title);
    } catch (error) {
      console.error("Error fetching formats:", error);
      setFormats([360, 480, 720, 1080]);
      setErrorMessage("Failed to fetch formats");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!inputValue.trim() || !selectedQuality) {
      setErrorMessage("Please enter a video URL and select a quality.");
      setLoading(false);
      return;
    }

    const requestData = {
      videoUrl: inputValue,
      quality: selectedQuality,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/download",
        requestData
      );

      setDownloadUrl(response.data.downloadUrl);
    } catch (error) {
      console.error("Error during download:", error);
      setErrorMessage("Failed to download video. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-500 text-black"
      }`}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="p-2 bg-white text-blue-500 font-bold rounded absolute top-0 right-0 m-4"
      >
        Toggle Dark Mode
      </button>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 p-6"
      >
        <div className="flex flex-row items-center space-x-4">
          <input
            type="text"
            placeholder="Enter video URL"
            value={inputValue}
            onChange={(e) => {
              const url = e.target.value;
              setInputValue(url);
              if (url.trim()) fetchFormats(url); // Fetch formats when URL changes
            }}
            className="p-2 rounded border-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 w-20 sm:w-[50vw]"
          />
          <div>
            {
              // formats.length > 0 && (
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="p-2 rounded border-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 w-min"
              >
                <option value="">Select a quality</option>
                {formats.map((format) => (
                  <option key={format.resolution} value={format.resolution}>
                    {format.resolution + "p"}
                  </option>
                ))}
              </select>
              // )
            }
          </div>
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim() || !selectedQuality}
          className={`px-4 py-2 rounded text-white font-bold ${
            inputValue.trim() && selectedQuality
              ? "bg-blue-700 cursor-pointer border-2 border-white hover:bg-blue-900"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </form>

      {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}

      {inputValue && (
        <iframe
          width="560"
          height="315"
          src={getEmbedUrl(inputValue)}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="mt-4"
        ></iframe>
      )}

      {downloadUrl && (
        <div className="mt-4">
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.setAttribute("download", `video.mp4`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="p-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
          >
            Download Video
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white"></div>
      )}
    </div>
  );
}

export default App;
