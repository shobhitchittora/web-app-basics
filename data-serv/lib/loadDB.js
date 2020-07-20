const Pool = require('pg').Pool;
const loadEnv = require('../../.env');

function loadDB() {
  loadEnv();

  const {
    PG_USER,
    PG_PASSWORD,
    PG_HOST,
    PG_DB,
    PG_PORT
  } = process.env;

  if (!PG_USER || !PG_PASSWORD || !PG_HOST || !PG_DB || !PG_PORT) {
    throw Error('No environment variable found for initializing PG');
  }

  return new Pool({
    user: PG_USER,
    password: PG_PASSWORD,
    host: PG_HOST,
    database: PG_DB,
    port: PG_PORT
  });
}

module.exports = loadDB;