const webpack = require('webpack');

const cwd = process.cwd();
const debug = process.env.NODE_ENV !== 'production';

const paths = {};

const resolve = {
  modules: ['node_modules'],
  descriptionFiles: ['package.json'],
  mainFields: ['module', 'browser', 'main'],
  extensions: ['*', '.js', '.jsx'],
  alias: paths,
};

const resolveLoader = {
  modules: ['node_modules'],
  moduleExtensions: ['-loader'],
};

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(
      debug ? 'development' : 'production',
    ),
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest'],
  }),
];

if (debug) {
  [new webpack.NamedModulesPlugin()].forEach(plug => plugins.push(plug));
} else {
  [new webpack.optimize.UglifyJsPlugin()].forEach(plug => plugins.push(plug));
}

const www = {
  plugins,
  resolve,
  resolveLoader,
  name: 'www',
  target: 'web',
  context: cwd,
  devtool: debug ? 'cheap-module-eval-source-map' : 'source-map',
  entry: {
    main: (debug ? ['react-hot-loader/patch'] : []).concat([
      `${cwd}/src/www/main.jsx`,
    ]),
    vendor: ['prop-types', 'react', 'react-dom', 'react-router-dom'],
  },
  output: {
    pathinfo: debug,
    path: `${cwd}/public`,
    filename: 'js/[name].js',
    sourceMapFilename: 'maps/[filebase].map',
    publicPath: 'http://localhost:3000/',
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /node_modules/,
        use: 'babel',
      },
    ],
  },
};

module.exports = [www];
