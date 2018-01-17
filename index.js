const debug = process.env.NODE_ENV !== 'production';
const test = process.env.NODE_ENV === 'test';

try {
  if (debug) {
    if (test === false) {
      // eslint-disable-next-line import/no-extraneous-dependencies, global-require
      const webpack = require('webpack');
      // eslint-disable-next-line import/no-extraneous-dependencies, global-require
      const koaWebpack = require('koa-webpack');
      // eslint-disable-next-line import/no-unresolved, global-require
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
        host: 'localhost',
        port: 3000,
      };
  
      const koaWebpackMiddleware = koaWebpack({
        compiler,
        dev,
        hot,
      });
  
      global.webpack = koaWebpackMiddleware;
    }
  }

  // eslint-disable-next-line global-require
  const app = require('./dist/app');

  app.listen(process.env.PORT || 3000);
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') console.log('please run "npm run build" before you begin.\n');
  else throw e;
}
