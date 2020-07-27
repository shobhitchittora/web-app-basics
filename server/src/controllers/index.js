const http = require('http');
const { streamToBuffer } = require('../../lib/utils/stream-utils');

const API_SERVER_PROTOCOL = 'http://';
const API_SERVER_HOST = '127.0.0.1';
const API_SERVER_PORT = '4000';

const API_SERVER_URL = `${API_SERVER_PROTOCOL}${API_SERVER_HOST}:${API_SERVER_PORT}`;

const mockNotes = {
  'notes': [

    {
      id: 1,
      content: 'Content 1.......',
      timestamp: 'time1'
    },
    {
      id: 2,
      content: 'Content 2.......',
      timestamp: 'time2'
    },
    {
      id: 3,
      content: 'Content 3.......',
      timestamp: 'time3'
    },
    {
      id: 4,
      content: 'Content 4.......',
      timestamp: 'time4'
    },
  ]
};


async function getNotes() {
  return new Promise((resolve, reject) => {
    const request = http.get(API_SERVER_URL + '/notes', function handleNotesController(responseStream) {

      if (responseStream && responseStream.statusCode !== 200) {
        reject('No response from API');
      }

      streamToBuffer(responseStream).then(buffer => {
        const result = buffer.toString();
        resolve(
          {
            'notes': JSON.parse(result)
          }
        );
      }).catch(reject);
    });

    request.on('error', reject);
  });
}


async function addNote(req, res) {
  return new Promise(async (resolve, reject) => {

    const postData = await streamToBuffer(req);

    const options = {
      hostname: API_SERVER_HOST,
      port: API_SERVER_PORT,
      path: '/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    
    // Api server request
    const request = http.request(options, function handleNotesController(responseStream) {

      if (responseStream && responseStream.statusCode !== 200) {
        reject('No response from API');
      }

      streamToBuffer(responseStream).then(buffer => {
        const result = buffer.toString();
        resolve(
          {
            'notes': JSON.parse(result)
          }
        );
      }).catch(reject);
    });

    request.write(postData);
    request.on('error', reject);
  });
}

module.exports = {
  getNotes,
  addNote
}