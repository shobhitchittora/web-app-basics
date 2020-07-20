
const { Duplex, Readable } = require('stream');

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);

  return stream;
}

function stringToStream(string) {
  let stream = new Readable();
  stream.push(string);
  stream.push(null);

  return stream;
}
module.exports = {
  streamToBuffer,
  bufferToStream,
  stringToStream
}