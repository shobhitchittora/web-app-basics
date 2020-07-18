const responseHeaders = require('../responseHeaders');
const sendFile = require('./static');

function render(req, res, next) {

  responseHeaders(req, res); 

  sendFile(res, 'index.html');
  // res.end('Hello')

  next();
}

module.exports = render;
