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

const port = process.env.PORT || (process.env.PORT = 3000);
const host = process.env.ROOT_URL || (process.env.ROOT_URL = 'localhost');
const url = `${host}${port && port !== 80 ? `:${port}` : ''}`;
const cwd = process.cwd();

// TODO:
// - capture arguments to modify debug/run configuration.
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
    if (global.webpack)
      global.webpack.client.wss.broadcast(
        JSON.stringify({ type: 'server::update' }),
      );
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

    if (run.watcher) await setupWatcher();

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
        console.log('\t\x1b[36m%s\x1b[0m', `change in path: ${path}`);

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
  const publicPath = (webpackConfig[0].output.publicPath = `${url}/`);
  const compiler = webpack(webpackConfig);

  const noinfo = false;
  const quiet = false;
  const stats = {
    colors: true,
    moduleTrace: true,
    warnings: true,
  };

  const dev = {
    noinfo,
    quiet,
    stats,
    publicPath,
    lazy: false,
    serverSideRender: false,
    watchOptions: {
      aggregateTimeout: 500,
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

  let initialized = false;

  return new Promise(resolve => {
    koaWebpackMiddleware.dev.waitUntilValid(() => {
      if (initialized === false) {
        resolve(koaWebpackMiddleware);
        initialized = true;
      }
    });
  });
}
