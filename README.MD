# YouTube Video Downloader

This project is a full-stack application that allows users to download online videos and playlists in various formats and qualities. It is built using **React**, **TypeScript**, **TailwindCSS** on the frontend, and **Node.js** with **Express** on the backend.

## Features

### Frontend
- **Responsive Design**: Built with TailwindCSS for a modern and responsive UI.
- **React Components**: Modular and reusable components for better maintainability.
- **Video Preview**: Displays video thumbnails or embedded YouTube players.
- **Playlist Support**: Allows downloading individual videos from playlists.
- **Format Selection**: Users can choose from multiple video resolutions and formats.

### Backend
- **YouTube Video Processing**: Uses `youtube-dl-exec` to fetch video information and download videos.
- **Rate Limiting**: Prevents abuse with IP-based request limits.
- **Security**: Implements `helmet` for secure HTTP headers and `cors` for controlled cross-origin requests.
- **File Management**: Automatically deletes downloaded files after a set time to save disk space.

## Project Structure

```
.
├── backend/
│   ├── helpers/          # Utility functions for video processing
│   ├── index.js          # Main backend server
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── public/           # Static assets
│   ├── src/              # React source code
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
└── README.md             # Project documentation
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **FFmpeg** (required for video processing)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/youtube-video-downloader.git
   cd youtube-video-downloader
   ```

2. Install dependencies for both frontend and backend:
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Ensure FFmpeg is installed and available in your system's PATH.

## Usage

### Backend
1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```

2. Start the backend server:
   ```sh
   npm start
   ```

3. The backend will run on `http://localhost:4000`.

### Frontend
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```

2. Start the development server:
   ```sh
   npm run dev
   ```

3. Open your browser and visit `http://localhost:5173`.

## API Endpoints

### `/formats` (POST)
- **Description**: Fetches available formats for a given video URL.
- **Request Body**:
  ```json
  {
    "videoUrl": "https://www.youtube.com/watch?v=example"
  }
  ```
- **Response**:
  ```json
  {
    "videoUrl": "https://www.youtube.com/watch?v=example",
    "formats": [
      { "resolution": "1080", "ext": "mp4" },
      { "resolution": "720", "ext": "mp4" }
    ]
  }
  ```

### `/download` (POST)
- **Description**: Downloads a video in the specified format.
- **Request Body**:
  ```json
  {
    "videoUrl": "https://www.youtube.com/watch?v=example",
    "quality": "1080",
    "classUrl": "YTV"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Download complete.",
    "downloadUrl": "http://localhost:4000/output/output-123456.mp4"
  }
  ```

## Environment Variables

Create a `.env` file in the `backend` directory to configure the following variables:
```env
PORT=4000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

## Technologies Used

### Frontend
- **React**: UI library for building user interfaces.
- **TypeScript**: Type-safe JavaScript.
- **TailwindCSS**: Utility-first CSS framework.
- **Vite**: Fast development server and build tool.

### Backend
- **Node.js**: JavaScript runtime.
- **Express**: Web framework for Node.js.
- **youtube-dl-exec**: Command-line tool for downloading videos.
- **FFmpeg**: Multimedia framework for video processing.
- **Helmet**: Security middleware.
- **Rate Limiter**: Prevents abuse by limiting requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [youtube-dl](https://github.com/ytdl-org/youtube-dl) for video downloading.
- [React](https://reactjs.org/) for the frontend framework.
- [TailwindCSS](https://tailwindcss.com/) for styling.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.