const debug = process.env.NODE_ENV !== 'production';
const test = process.env.NODE_ENV === 'test';

const port = process.env.PORT || 3000;

try {
  if (debug === false) {
    // eslint-disable-next-line global-require
    const app = require('./dist/app');

    app.listen(port);
  } else if (test === false) {
    let app = (req, res) => res.end();

    // eslint-disable-next-line global-require
    const server = require('http').createServer((req, res) => app(req, res));

    server.listen(port, error => {
      if (error) throw error;

      const serve = () => {
        // eslint-disable-next-line global-require
        app = require('./dist/app').callback();
      };

      // eslint-disable-next-line import/no-extraneous-dependencies, global-require
      const webpack = require('webpack');
      // eslint-disable-next-line import/no-extraneous-dependencies, global-require
      const koaWebpack = require('koa-webpack');
      // eslint-disable-next-line global-require
      const webpackConfig = require('./webpack.config');

      const compiler = webpack(webpackConfig);

      const dev = {
        hot: true,
        lazy: false,
        serverSideRender: true,
        publicPath: `${webpackConfig[0].publicPath}/`,
        watchOptions: {
          aggregateTimeout: 800,
        },
        noinfo: false,
        quiet: false,
        stats: {
          colors: true,
        },
      };

      const hot = {
        server,
      };

      const koaWebpackMiddleware = koaWebpack({
        compiler,
        dev,
        hot,
      });

      global.webpack = koaWebpackMiddleware;

      serve();
    });
  }
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND')
    console.log('please run "npm run build" before you begin.\n');
  else throw e;
}
