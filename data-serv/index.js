const http = require('http');
const promisify = require('util').promisify;

const loadDB = require('./lib/loadDB');
const { getAllNotes, addNote } = require('./api');
const { streamToBuffer } = require('../server/lib/utils/stream-utils');

const pool = loadDB();
runHttpServer();

async function router(req, res) {
  const query = pool.query.bind(pool);

  console.log('-------------');
  console.log(req.url);
  console.log('\n\n');

  try {
    switch (req.url) {
      case '/notes': {

        const { rows } = await getAllNotes(query);
        res.writeHead(200);
        res.end(JSON.stringify(rows));

        break;
      }
      case '/add': {

        const dataBuffer = await streamToBuffer(req);

        const { rows } = await addNote(query, dataBuffer);
        res.writeHead(200);
        res.end(JSON.stringify(rows));

        break;
      }
      default: {
        res.writeHead(404);
        res.end();
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function runHttpServer() {
  const API_SERV_PORT = process.env.PORT || 4000;
  http.createServer(function apiServerListener(req, res) {
    router(req, res);
  }).listen(API_SERV_PORT);

  console.log(`API serv running on ${API_SERV_PORT}`);
}


