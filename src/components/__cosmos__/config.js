module.exports = {
  rootPath: `${process.cwd()}/src/components`,
  proxiesPath: './__cosmos__/proxies.js',
  webpackConfigPath: './__cosmos__/webpack.config.js',
  publicPath: '../../static',
  publicUrl: '/assets/',
  containerQuerySelector: '#app',
  globalImports: ['../styles/main.scss'],
};
