/* 
  eslint
    import/no-extraneous-dependencies: 0
*/

const webpack = require('webpack');
const koaWebpack = require('koa-webpack');
const webpackConfig = require('../webpack.config');

module.exports = function development(server, cb) {
  function serve() {
    // eslint-disable-next-line global-require
    const app = require('../dist/app');

    if (cb && typeof cb === 'function') cb(app.callback());

    return app;
  }

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
};
