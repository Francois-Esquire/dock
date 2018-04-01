/*
  eslint
    import/no-extraneous-dependencies: 0,
    no-use-before-define: 0,
    no-multi-assign: 0
*/

const { spawn } = require('child_process');
const http = require('http');
const chokidar = require('chokidar');
const webpack = require('webpack');
const koaWebpack = require('koa-webpack');
const webpackConfig = require('./webpack.config');

const cwd = process.cwd();

const port = process.env.PORT || (process.env.PORT = 3000);
const domain = `localhost:${port}`;
const host = `http://${domain}`;

// TODO:
// - capture arguments to configure debug/run
// - set up redis for session / cache (rendered html, assets)

const debug = {
  redis: !true,
  rollup: !true,
  koa: true,
};

const run = {
  watcher: true,
  webpack: true,
  rollup: true,
  redis: !true,
};

let app = null;
let callback = (req, res) => res.end('Initializing. Please wait.');

async function serve() {
  try {
    // eslint-disable-next-line global-require
    app = require('./dist/app');

    callback = app.callback();
  } catch (e) {
    console.log(e);
  }
}

(function startup() {
  let redis;
  let rollup;

  if (run.redis) {
    redis = spawn('redis-server', {
      stdio: debug.redis ? 'inherit' : null,
    });
  }

  if (run.rollup) {
    rollup = spawn('rollup', ['-c', '-w'], {
      cwd,
      env: process.env,
      stdio: [null, null, debug.rollup ? process.stdin : null],
    });
  }

  process.on('close', () => {
    if (redis) redis.kill();
    if (rollup) rollup.kill();
  });

  const server = http.createServer((req, res) => callback(req, res));

  server.listen(port, async error => {
    if (error) throw error;

    if (run.watcher) await setupWatcher({ debug: true });

    if (run.webpack) await setupWebpackMiddleware(server);

    if (debug.koa) process.env.DEBUG = 'koa*';

    serve();
  });
})();

async function setupWatcher() {
  const watcher = chokidar.watch(['dist/*.js'], {
    cwd,
  });

  await new Promise(resolve => {
    watcher.on('ready', () => {
      watcher.on('change', path => {
        console.log('change in path', path);

        if (path !== 'dist/app.js') delete require.cache[`${cwd}/dist/app.js`];

        delete require.cache[`${cwd}/${path}`];

        process.nextTick(serve);
      });

      resolve();
    });
  });

  return watcher;
}

async function setupWebpackMiddleware(_server) {
  const publicPath = (webpackConfig[0].output.publicPath = `${host}/`);
  const compiler = webpack(webpackConfig);

  const dev = {
    publicPath,
    lazy: false,
    serverSideRender: true,
    noinfo: false,
    quiet: false,
    watchOptions: {
      aggregateTimeout: 500,
    },
    stats: {
      colors: true,
    },
  };

  const hot = {};

  if (_server) hot.server = _server;
  else hot.port = process.env.PORT;

  const koaWebpackMiddleware = koaWebpack({
    compiler,
    dev,
    hot,
  });

  if (global.webpack === undefined) global.webpack = koaWebpackMiddleware;

  return koaWebpackMiddleware;
}
