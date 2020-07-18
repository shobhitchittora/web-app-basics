const {
  https,
  path,
  fs,
  env,
  logger,
  smile,
  router,
} = require('./lib/loadModules')(
  'https',
  'path',
  'fs',
  { path: './lib/env', as: 'env' },
  { path: './lib/middleware/logger', as: 'logger' },
  { path: './lib/middleware/smile', as: 'smile' },
  { path: './src/router', as: 'router' },
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

    router(req, res, [logger, smile]);

  }).listen(PORT, function listening() {
    console.log(`https server Running on ${PORT}`);
  });

} catch (e) {
  console.error(e);
}
