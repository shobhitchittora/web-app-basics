const http = require('http');
const { streamToBuffer } = require('../../lib/utils/stream-utils');

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
    const request = http.get('http://127.0.0.1:4000/notes', function handleNotesController(responseStream) {

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

module.exports = {
  getNotes
}