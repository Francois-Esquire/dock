/*
  eslint
    import/no-extraneous-dependencies: 0,
    no-use-before-define: 0,
    no-multi-assign: 0,
    global-require: 0,
*/

const { spawn } = require('child_process');
const http = require('http');

const { PORT: port = 3000 } = process.env;

const cwd = process.cwd();

// TODO:
// - capture arguments to modify debug/run configuration.
// - set up redis for session / cache (rendered html, assets)

const debug = {
  mongod: !true,
  redis: !true,
  rollup: !true,
  koa: true,
};

const run = {
  watcher: true,
  webpack: true,
  rollup: true,
  redis: !true,
  mongod: !true,
};

let wp = null;
let app = null;
let callback = (req, res) => res.end('Initializing. Please wait.');

let initialized = false;

async function serve() {
  try {
    app = require('./dist/app');

    if (wp) {
      wp.client.wss.broadcast(JSON.stringify({ type: 'server::update' }));

      // insert before static middleware
      app.middleware.splice(-3, 0, wp);
    }

    callback = app.callback();
  } catch (e) {
    console.log(e);
  }
}

(function startup() {
  let mongod;
  let redis;
  let rollup;

  process.on('close', () => {
    // extra precaution
    if (mongod) mongod.kill();
    if (redis) redis.kill();
    if (rollup) rollup.kill();
  });

  const server = http.createServer((req, res) => callback(req, res));

  server.listen(port, async error => {
    if (error) throw error;

    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/dock-graphql';
    process.env.REDIS_URL = 'redis://127.0.0.1:6379';

    if (debug.koa) process.env.DEBUG = 'koa*';

    if (run.mongod) {
      mongod = spawn('mongod', {
        stdio: debug.mongod ? 'inherit' : null,
      });
    }

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

    if (run.watcher) await setupWatcher();

    if (run.webpack) wp = await setupWebpackMiddleware(server);

    serve();

    initialized = true;
  });
})();

async function setupWatcher() {
  const chokidar = require('chokidar');

  const watcher = chokidar.watch(['dist/*.js'], {
    cwd,
  });

  await new Promise(resolve => {
    watcher.on('ready', () => {
      const mongoose = require('mongoose');

      watcher.on('change', path => {
        if (initialized) {
          console.log('\t\x1b[36m%s\x1b[0m', `change in path: ${path}`);

          if (path !== 'dist/app.js')
            delete require.cache[`${cwd}/dist/app.js`];

          if (path === 'dist/models.js') {
            delete require.cache[`${cwd}/dist/schema.js`];

            // avoiding "Topology Was Destroyed" - error;
            Object.keys(mongoose.models).forEach(
              name => delete mongoose.models[name],
            );
            Object.keys(mongoose.modelSchemas).forEach(
              name => delete mongoose.modelSchemas[name],
            );
          }

          /* clean out deps */

          if (path === 'dist/schema.js') {
            // when schema needs reloading for ssr.
            delete require.cache[`${cwd}/dist/www.js`];
          }

          delete require.cache[`${cwd}/${path}`];

          process.nextTick(serve);
        }
      });

      resolve();
    });
  });

  return watcher;
}

async function setupWebpackMiddleware(server) {
  const webpack = require('webpack');
  const koaWebpack = require('koa-webpack');
  const webpackConfig = require('./webpack.config');

  // const publicPath = (webpackConfig[0].output.publicPath = `${url}/`);
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
    publicPath: '/',
    lazy: false,
    serverSideRender: false,
    watchOptions: {
      aggregateTimeout: 500,
    },
  };

  const hot = {};

  if (server) hot.server = server;
  else hot.port = port;

  const koaWebpackMiddleware = koaWebpack({
    compiler,
    dev,
    hot,
  });

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
