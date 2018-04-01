/*
  eslint
    import/no-extraneous-dependencies: 0
*/

const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = require('../../../webpack.config');

const [www] = webpackConfig;

const { mode, resolveLoader, module: { rules } } = www;

module.exports = {
  mode,
  module: { rules },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', '.scss'],
  },
  resolveLoader,
  entry: '',
  output: {
    path: '[name].[ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/components/__cosmos__/cosmos.html',
    }),
  ],
};
