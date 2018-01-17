const webpack = require('webpack');

const cwd = process.cwd();
const debug = process.env.NODE_ENV !== 'production';

const www = {
  name: 'www',
  target: 'web',
  context: cwd,
  devtool: debug ? 'cheap-module-eval-source-map' : 'source-map',
  entry: {
    main: [
      `${cwd}/src/www/main.jsx`,
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  output: {
    path: `${cwd}/public`,
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /(\.js|\.jsx)$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(debug ? 'development' : 'production'),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
  ],
};

module.exports = [www];
