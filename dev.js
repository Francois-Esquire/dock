/*
  eslint
    import/no-extraneous-dependencies: 0,
    no-use-before-define: 0
*/

process.env.DEBUG = 'koa';

const { spawn } = require('child_process');
const http = require('http');
const chokidar = require('chokidar');
const webpack = require('webpack');
const koaWebpack = require('koa-webpack');
const webpackConfig = require('./webpack.config');

const cwd = process.cwd();

let app = (req, res) => res.end('Initializing. Please wait.');

const server = http.createServer((req, res) => app(req, res));

server.listen(process.env.PORT, error => {
  if (error) throw error;

  setupWebpackMiddleware(server);

  setupWatcher();
});

function serve() {
  console.log(
    'before',
    Object.keys(require.cache).filter(path => !/node_modules/g.test(path)),
  );
  // eslint-disable-next-line global-require
  app = require('./dist/app').callback();

  console.log(
    'after',
    Object.keys(require.cache).filter(path => !/node_modules/g.test(path)),
  );
}

function setupWebpackMiddleware(_server) {
  const compiler = webpack(webpackConfig);

  const dev = {
    hot: true,
    lazy: false,
    serverSideRender: true,
    publicPath: `${webpackConfig[0].output.publicPath}`,
    watchOptions: {
      aggregateTimeout: 500,
    },
    noinfo: false,
    quiet: false,
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

function setupWatcher() {
  const watcher = chokidar.watch(['dist/*.js'], {
    cwd,
  });

  watcher.on('ready', () => {
    const rollup = spawn('rollup', ['-c', '-w'], {
      cwd,
    });

    process.on('close', () => {
      rollup.kill();
    });

    watcher.on('change', path => {
      console.log('change in path', path);

      if (path !== 'dist/app.js') delete require.cache[`${cwd}/dist/app.js`];

      delete require.cache[`${cwd}/${path}`];

      process.nextTick(serve);
    });

    serve();
  });

  return watcher;
}
