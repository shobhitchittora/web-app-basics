const zlib = require('zlib');

const {
  middleware,
  responseHeaders,
  sendFile,
  controllers,
  streamUtils
} = require('../../lib/loadModules')(
  { path: './lib//middleware', as: 'middleware' },
  { path: './lib/responseHeaders', as: 'responseHeaders' },
  { path: './lib/middleware/static', as: 'sendFile' },
  { path: './src/controllers', as: 'controllers' },
  { path: './lib/utils/stream-utils', as: 'streamUtils' }
);


const rules = {
  'GET': {
    '/': { static: 'index.html' },
    '/index': { static: 'index.html' },
    '/index.html': { static: 'index.html' },
    '/404': { static: '404.html' },
    '/css/main.css': { static: '/css/main.css' },
    '/js/main.js': { static: '/js/main.js' },
    '/css/fonts/Cairo-Regular.ttf': { static: '/css/fonts/Cairo-Regular.ttf' },
    '/img/icon.svg': { static: '/img/icon.svg' },
    '/notes': { controller: controllers.getNotes }
  },
  'POST': {
    '/': { controller: '' },
    '/add': { controller: controllers.addNote }
  },
  'HEAD': {},
  'PUT': {}
};

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Array[Function]} middlewareChain
 */
function router(req, res, middlewareChain = []) {
  const path = req.url;
  const method = req.method.toUpperCase();

  if (rules[method]) {
    let match = false;

    for (let path in rules[method]) {
      // Exit as soon as we hit a match
      if (req.url === path) {
        let handling = rules[method][path];
        middlewareChain.push(render(handling));
        middleware(req, res).chain(...middlewareChain);

        match = true;
        break;
      }
    }

    if (!match) {
      middlewareChain.push(render(rules[method]['/404']));
      middleware(req, res).chain(...middlewareChain);
    }

  } else {
    throw new Error(`Router handling not defined for - ${path}`);
  }


}

function compressAndSend(req, res, result) {
  const ORIGINAL_SIZE = result.length;
  responseHeaders(req, res);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Encoding', 'br');


  let contentStream = streamUtils.stringToStream(result);

  contentStream = contentStream.pipe(
    zlib.createBrotliCompress(
      {
        chunkSize: 32 * 1024,
        params: {
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          [zlib.constants.BROTLI_PARAM_QUALITY]: 10,
          [zlib.constants.BROTLI_PARAM_SIZE_HINT]: ORIGINAL_SIZE
        }
      }
    )
  );


  streamUtils.streamToBuffer(contentStream)
    .then((buffer) => {

      res.setHeader('Content-Length', Buffer.byteLength(buffer));
      res.writeHead(200);
      contentStream = streamUtils.bufferToStream(buffer);
      contentStream.pipe(res);

      contentStream.on('end', () => res.end());
    })
    .catch(console.error);

}

function render({ static: filename, controller }) {
  return async function (req, res) {
    if (filename) {
      responseHeaders(req, res);
      sendFile(res, filename);
    }

    try {
      if (controller) {
        const result = await controller(req, res);
        if (result && typeof result === 'string') {
          compressAndSend(req, res, result);
        } else {
          compressAndSend(req, res, JSON.stringify(result));
        }
      }
    } catch (e) {
      console.error(e);
      res.writeHead(500);
      res.end();
    }

  }
}


module.exports = router;