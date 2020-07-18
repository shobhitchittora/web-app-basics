

function frameguard() {
  return { 'X-Frame-Options': 'SAMEORIGIN' }; // https://helmetjs.github.io/docs/frameguard/, https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
}

function xpoweredby() {
  return { 'X-Powered-By': 'PHP 7.4.7' };  // Just to mess with people
}

function hsts() {
  // 1yr expiry;        https for subdomains;      preload from browser HSTS list
  return { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' } //HSTS policy , https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
}

function ieNoOpen() {
  return { 'X-Download-Options': 'noopen' }; // https://docs.microsoft.com/en-us/archive/blogs/ie/ie8-security-part-v-comprehensive-protection
}

function noMimeTypeSniff() {
  return { 'X-Content-Type-Options': 'nosniff' }; // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
}

function referrerPolicy() {
  return { 'Referrer-Policy': 'same-origin' }; // Stops browsers from sending referrer header if navigate out of the site
}

function reflectedXSS() {
  return { 'X-XSS-Protection': '1; mode=block' }; // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
}

function dnsPrefetch() {
  return { 'X-DNS-Prefetch-Control': 'off' }; // disallow prefetching DNS for links on the page, it can be a page level config too ( as meta in individual html pages )
}

function cspStrict() {
  // For site which uses only their own content 
  // no 3rd party scrips or resources
  return { 'Content-Security-Policy': "default-src 'self'" };
}

const responseHeader = {
  ...frameguard(),
  ...xpoweredby(),
  ...hsts(),
  ...ieNoOpen(),
  ...noMimeTypeSniff(),
  ...referrerPolicy(),
  ...reflectedXSS(),
  ...dnsPrefetch(),
  ...cspStrict()
}

function responseHeaders(req, res) {

  for (let [key, value] of Object.entries(responseHeader)) {
    res.setHeader(key, value);
  }

}

module.exports = responseHeaders;