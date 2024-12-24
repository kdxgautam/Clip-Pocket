

// const youtubedl = require('youtube-dl-exec');
// const fs = require('fs');

// // Get video info from the provided URL
// const getInfo = (url, flags) =>
//   youtubedl(url, { dumpSingleJson: true, ...flags });

// // Load video info from a JSON file and pass it to youtube-dl for further actions
// const fromInfo = (infoFile, flags) =>
//   youtubedl.exec('', { loadInfoJson: infoFile, ...flags });

// async function main(url) {
//   // Fetch video information
//   const info = await getInfo(url);

//   // Save the video information into a JSON file
//   fs.writeFileSync('videoInfo.json', JSON.stringify(info));

//   // Log video description
//   console.log(info.description);

//   // Log available thumbnails
//   console.log((await fromInfo('videoInfo.json', { listThumbnails: true })).stdout);

//   // Download video with both audio and video merged
//   await fromInfo('videoInfo.json', {
//     output: 'output.mp4',     // Output file name
//     format: 'bestvideo', // Merge best video and best audio
//   // Ensure the output format is mp4
//   });
// }

// // Run the script with a YouTube URL
// main("https://www.youtube.com/watch?v=LDU_Txk06tM");






// // import youtubedl from 'youtube-dl-exec';


// // // Function to download video with audio
// // async function downloadVideo(videoUrl) {
// //   try {
// //     // Download the best available format with both audio and video
// //     const output = await youtubedl(videoUrl, {
// //       output: 'downloaded-video.%(ext)s', // Output file name
// //       format: 'bestvideo+bestaudio/best', // Download the best video and audio, then merge them
// //     });
    
// //     console.log('Video downloaded successfully!', output);
// //   } catch (error) {
// //     console.error('Error downloading:', error);
// //   }
// // }

// // // Replace with the actual YouTube video URL
// // const videoUrl = 'https://www.youtube.com/watch?v=VIDEO_ID'; // Replace with the actual video ID
// // downloadVideo(videoUrl);





// import youtubedl from 'youtube-dl-exec';
// import ffmpeg from 'fluent-ffmpeg';
// import { join } from 'path';

// import { fileURLToPath } from 'url';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // YouTube video URL
// const videoUrl = 'https://www.youtube.com/watch?v=LDU_Txk06tM';

// // Paths to save the video, audio, and final merged output
// const videoPath = join(__dirname, 'video.mp4');
// const audioPath = join(__dirname, 'audio.mp3');
// const outputPath = join(__dirname, 'merged_output.mp4');

// // Function to download video and audio separately
// async function downloadVideoAndAudio() {
//   console.log('Starting download of video and audio separately...');
//   try {
//     // Download video stream only
//     await youtubedl(videoUrl, {
//       output: videoPath,
//       format: 'bestvideo', // Only video, no audio
//     });
//     console.log('Video download complete.');

//     // Download audio stream only
//     await youtubedl(videoUrl, {
//       output: audioPath,
//       format: 'bestaudio', // Only audio, no video
//     });
//     console.log('Audio download complete.');

//     // Merge audio and video
//     await mergeAudioVideo(videoPath, audioPath, outputPath);
//     console.log('Merge successful! File saved as:', outputPath);
//   } catch (error) {
//     console.error('Error during download or merge:', error);
//   }
// }

// // Function to merge audio and video using ffmpeg
// function mergeAudioVideo(videoFile, audioFile, outputFile) {
//   return new Promise((resolve, reject) => {
//     ffmpeg()
//       .input(videoFile)
//       .input(audioFile)
//       .output(outputFile)
//       .on('end', () => {
//         console.log('Merging complete!');
//         resolve();
//       })
//       .on('error', (err) => {
//         console.error('Error during merging:', err);
//         reject(err);
//       })
//       .run();
//   });
// }

// // Run the download and merge process
// downloadVideoAndAudio();



// import youtubedl from 'youtube-dl-exec';


// const videoUrl = 'https://www.youtube.com/watch?v=LDU_Txk06tM';


// async function downloadVideo() {
//   try {
//     await youtubedl(videoUrl, {
//       output: "./output/output.mp4",
//       format: 'bestvideo+bestaudio/best', // Downloads the best quality and merges if needed
//       mergeOutputFormat: 'mp4',           // Ensures output is an MP4 file
//     });
//     console.log('Download complete!');
//   } catch (error) {
//     console.error('Error during download:', error);
//   }
// }

// downloadVideo();








// import youtubedl from 'youtube-dl-exec';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { exec } from 'child_process';

// // Define __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const videoUrl = 'https://www.youtube.com/watch?v=LDU_Txk06tM';
// const outputDir = path.join(__dirname, 'output');

// async function downloadVideo() {
//   try {
//     // Ensure output directory exists
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir);
//     }

//     const videoPath = path.join(outputDir, 'output.mp4');

//     // Download the video with specific quality
//     console.log('Downloading video...');
//     await youtubedl(videoUrl, {
//       output: videoPath,
//       format: 'bestvideo[height<=480]+bestaudio/best', // Set quality to 720p
//       mergeOutputFormat: 'mp4',
//     });

//     console.log('Download complete!');

//     // Extract frames
//     console.log('Extracting frames...');
//     extractFrames(videoPath, path.join(outputDir, 'frames'));
//   } catch (error) {
//     console.error('Error during download or frame extraction:', error);
//   }
// }

// function extractFrames(videoPath, framesDir) {
//   // Ensure frames directory exists
//   if (!fs.existsSync(framesDir)) {
//     fs.mkdirSync(framesDir);
//   }

//   // FFmpeg command to extract frames
//   const ffmpegCommand = `ffmpeg -i ${videoPath} -vf "fps=0.1" ${framesDir}/frame_%04d.png`;

//   exec(ffmpegCommand, (error, stdout, stderr) => {
//     if (error) {
//       console.error('Error extracting frames:', error);
//       return;
//     }
//     console.log('Frames extracted successfully!');
//   });
// }

// downloadVideo();
