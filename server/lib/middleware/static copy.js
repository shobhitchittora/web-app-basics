const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const promisify = require('util').promisify;
const { Duplex } = require('stream');

const readFile = promisify(fs.readFile);

const STATIC_SERVER_PATH = path.join(process.cwd(), 'public');


const contentTypeMap = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript ',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

function bufferToStream(buffer){
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);

  return stream;
}

function sendFile(res, filepath) {

  // default encoding for readFile is null
  const resolvedPath = path.join(STATIC_SERVER_PATH, filepath);

  readFile(resolvedPath)
    .then((contentBuffer) => {

      res.setHeader('Content-Type', contentTypeMap[path.extname(resolvedPath)]);
      res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
      res.setHeader('Content-Encoding', 'br');


      let contentStream = new Duplex();
      contentStream.push(contentBuffer);
      contentStream.push(null);

      // compress contentStream
      contentStream = contentStream.pipe(zlib.createBrotliCompress());

      // get stream length

      streamToBuffer(contentStream)
        .then((buffer) => {
          res.setHeader('Content-Length', Buffer.byteLength(buffer));
          res.writeHead(200);
          contentStream = bufferToStream(buffer);
          contentStream.pipe(res);

          contentStream.on('end', () => res.end());
        })
        .catch(console.error);

    })
    .catch(console.error);

}

module.exports = sendFile;