function requestHeaders(req) {
  let {
    host,
    'user-agent': userAgent,
    etag
  } = req.headers;

  return {
    host,
    userAgent,
    etag
  }
}

module.exports = requestHeaders;
