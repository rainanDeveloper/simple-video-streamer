const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use('/', express.static(path.join(__dirname, 'interface')))

app.get('/video', (request, response) => {
  const { range } = request.headers;

  if(!range) {
    return response.status(400).json({
      message: 'Requires a range header',
    });
  }

  const videoPath = path.join(__dirname, 'files', 'BigBuckBunny.mp4');
  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  // Example: 'bytes=15451-'
  const CHUNK_SIZE = 2 ** 20; // 1MB
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-type': 'video/mp4',
  };

  response.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(response);
})

app.listen(8080, () => {
  console.log('App running on port 8080');
})