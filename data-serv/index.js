const http = require('http');
const promisify = require('util').promisify;

const loadDB = require('./lib/loadDB');
const { getAllNotes } = require('./api');

const pool = loadDB();
runHttpServer();

async function router(req, res) {
  try {
    switch (req.url) {
      case '/notes': {

        const { rows } = await getAllNotes(pool.query.bind(pool));
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


