const requestHeaders = require('../requestHeaders');

function log(req, res) {

  const { host, userAgent, etag } = requestHeaders(req);
  console.log(`
  ----- REQUEST------
  
  Path = ${req.url}
  Method = ${req.method}
  Version = ${(req.connection.alpnProtocol || 'Undefined').toUpperCase()}
  Protocol = ${req.connection.getProtocol()}
  
  Host = ${host}
  UserAgent = ${userAgent}
  etag = ${etag}

  -------------------
  `);
}

function logger(req, res, next) {
  log(req, res);
  next();
}

module.exports = logger;