const { https, path, fs, env } = require('./lib/loadModules')(
  'https',
  'path',
  'fs',
  { path: './lib/env', as: 'env' }
)

const PORT = process.env.PORT || 8080;

const CERT_ROOT_PATH = 'config/cert';
const CERT_PATH = path.join(CERT_ROOT_PATH, env.isProd() ? 'prod' : 'dev');

try {
  const HTTPS_OPTIONS = {
    key: fs.readFileSync(path.join(CERT_PATH, 'key.pem')),
    cert: fs.readFileSync(path.join(CERT_PATH, 'cert.pem'))
  }

  https.createServer(HTTPS_OPTIONS, function handleHttpsServer(req, res) {
    res.writeHead(200);
    res.end('Hello world\n');
  }).listen(PORT, function listening() {
    console.log(`https server Running on ${PORT}`);
  });
  
} catch (e) {
  console.error(e);
}
