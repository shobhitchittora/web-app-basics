const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const promisify = require('util').promisify;
const { Readable } = require('stream');
const { streamToBuffer, bufferToStream } = require('../utils/stream-utils');
const streamUtils = require('../utils/stream-utils');

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

function sendFile(res, filepath) {

  // default encoding for readFile is null
  const resolvedPath = path.join(STATIC_SERVER_PATH, filepath);

  readFile(resolvedPath)
    .then((contentBuffer) => {

      res.setHeader('Content-Type', contentTypeMap[path.extname(resolvedPath)]);
      res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
      res.setHeader('Content-Encoding', 'br');


      let contentStream = streamUtils.bufferToStream(contentBuffer);


      let ORIGINAL_SIZE = Buffer.byteLength(contentBuffer);

      // compress contentStream
      contentStream = contentStream.pipe(
        zlib.createBrotliCompress(
          {
            chunkSize: 32 * 1024,
            params: {
              [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
              [zlib.constants.BROTLI_PARAM_QUALITY]: 10,
              [zlib.constants.BROTLI_PARAM_SIZE_HINT]: ORIGINAL_SIZE
            }
          }
        )
      );

      // get stream length by converting to buffer
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