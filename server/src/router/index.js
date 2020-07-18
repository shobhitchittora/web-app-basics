const {
  middleware,
  responseHeaders,
  sendFile,
  controllers
} = require('../../lib/loadModules')(
  { path: './lib//middleware', as: 'middleware' },
  { path: './lib/responseHeaders', as: 'responseHeaders' },
  { path: './lib/middleware/static', as: 'sendFile' },
  { path: './src/controllers', as: 'controllers' }
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
    '/': { controller: '' }
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

function render({ static: filename, controller }) {
  return function (req, res) {
    if (filename) {
      responseHeaders(req, res);
      sendFile(res, filename);
    }

    if (controller) {
      const result = JSON.stringify(controller());
      responseHeaders(req, res);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', result.length);
      res.writeHead(200);
      res.end(result);
    }
  }
}


module.exports = router;