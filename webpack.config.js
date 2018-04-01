const path = require('path');

const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const GzipCompressionPlugin = require('compression-webpack-plugin');
const BrotliCompressionPlugin = require('brotli-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const debug = process.env.NODE_ENV !== 'production';
const devtool = debug ? 'cheap-module-eval-source-map' : 'source-map';

// TODO:
// create a configuration file to feed webpack config based on env.

const publicPath = 'http://localhost:3000/';

const context = process.cwd();

const mode = debug ? 'development' : 'production';
const name = 'www';
const target = 'web';

const entry = {
  main: [`${context}/src/www/main.jsx`],
};

const output = {
  pathinfo: debug,
  path: `${context}/dist/public`,
  filename: 'js/[name].js',
  sourceMapFilename: 'maps/[filebase].map',
  publicPath,
};

const resolve = {
  modules: ['node_modules'],
  descriptionFiles: ['package.json'],
  mainFields: ['module', 'browser', 'main'],
  extensions: ['*', '.js', '.jsx'],
};

const resolveLoader = {
  modules: ['node_modules'],
  moduleExtensions: ['-loader'],
};

const optimization = {
  splitChunks: {
    chunks: 'all',
    minSize: 3000,
    minChunks: 1,
    maxAsyncRequests: 3,
    maxInitialRequests: 3,
    name: true,
    cacheGroups: {
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
      },
    },
  },
  minimize: !debug,
};

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(mode),
  }),
  new Visualizer({
    filename: './statistics.html',
  }),
];

if (debug === false) {
  const test = /\.(js|css|svg)$/;
  const threshold = 12800;
  const minRatio = 0.8;

  plugins.push(
    new ExtractText({
      filename: 'css/[name].css',
      allChunks: true,
      ignoreOrder: true,
    }),
    new GzipCompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test,
      threshold,
      minRatio,
    }),
    new BrotliCompressionPlugin({
      asset: '[path].br[query]',
      test,
      threshold,
      minRatio,
    }),
  );
}

const exclude = /node_modules/;

const styles = [
  {
    loader: 'css',
    options: {
      minimize: false,
      modules: true,
      importLoaders: 2,
      localIdentName: '[local]___[name]',
    },
  },
  {
    loader: 'postcss',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'sass',
  },
];

const [jsx, css] = [
  {
    test: /(\.js|\.jsx)$/,
    exclude,
    use: 'babel',
  },
  /* eslint-disable indent */
  {
    test: /\.(css|s[ac]ss)$/,
    exclude,
    use: debug
      ? ['style'].concat(styles)
      : ExtractText.extract({
          use: styles,
          fallback: 'style',
        }),
  },
  /* eslint-enable indent */
];
const rules = [jsx, css];

const www = {
  mode,
  name,
  target,
  context,
  devtool,
  entry,
  output,
  plugins,
  resolve,
  resolveLoader,
  optimization,
  module: {
    rules,
  },
  recordsPath: path.resolve(__dirname, 'records.json'),
};

module.exports = [www];
