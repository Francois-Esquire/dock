const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GzipCompressionPlugin = require('compression-webpack-plugin');
const BrotliCompressionPlugin = require('brotli-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const context = process.cwd();
const debug = process.env.NODE_ENV !== 'production';
const publicPath = `${process.env.DOMAIN || ''}/`;

const mode = debug ? 'development' : 'production';
const devtool = debug ? 'inline-cheap-module-source-map' : 'hidden-source-map';

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
    'process.env.SERVER': JSON.stringify(false),
  }),
  new Visualizer({
    filename: 'statistics.html',
  }),
];

if (debug === false) {
  const test = /\.(js|css|svg)$/;
  const threshold = 12800;
  const minRatio = 0.8;

  plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
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

const [jsx, css, url] = [
  {
    test: /(\.js|\.jsx)$/,
    exclude,
    use: 'babel',
  },
  {
    test: /\.(css|s[ac]ss)$/,
    exclude,
    use: (debug ? ['style'] : [MiniCssExtractPlugin.loader]).concat(
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
    ),
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        loader: 'url',
        options: {
          limit: 16000,
          fallback: 'file-loader',
          outputPath: 'assets/',
          name: '[name].[ext]',
        },
      },
    ],
  },
];

const rules = [jsx, css, url];

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
};

module.exports = [www];
