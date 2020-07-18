const fs = require('fs');
const path = require('path');
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

function sendFile(res, filepath) {

  // default encoding for readFile is null
  const resolvedPath = path.join(STATIC_SERVER_PATH, filepath);

  readFile(resolvedPath)
    .then((contentBuffer) => {
      res.setHeader('Content-Type', contentTypeMap[path.extname(resolvedPath)]);
      res.setHeader('Content-Length', Buffer.byteLength(contentBuffer));
      res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');

      let stream = new Duplex();
      stream.push(contentBuffer);
      stream.push(null);

      res.writeHead(200);
      stream.pipe(res);
      
      stream.on('end', () => res.end());
    })
    .catch(console.error);

}

module.exports = sendFile;