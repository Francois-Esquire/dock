import path from 'path';

import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-re';
import resolve from 'rollup-plugin-node-resolve';
import postCSS from 'rollup-plugin-postcss';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const config = require('./config');

const external = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.devDependencies))
  .concat('react-dom/server', 'stream');

const watch = {
  chokidar: true,
  include: 'src/**',
  exclude: 'node_modules/**',
};

const extensions = ['.js', '.jsx', '.css', '.scss'];

const [nodeEnv, serverEnv, replaceAssetDir, replaceWWW] = [
  {
    test: 'process.env.NODE_ENV',
    replace: JSON.stringify(process.env.NODE_ENV),
  },
  {
    test: 'process.env.SERVER',
    replace: JSON.stringify(true),
  },
  {
    /* eslint-disable no-template-curly-in-string */
    test: '`${process.cwd()}/dist/public`',
    replace: '`${__dirname}/public`',
    /* eslint-enable no-template-curly-in-string */
  },
  {
    test: "import render from '../www';",
    replace: "const render = require('./www');",
  },
];

const cssDictionary = {};

const plugins = {
  assetTransform: {
    transform(code, id) {
      if (/\.(gif|png|jpg)$/.test(id))
        return `export default "${config.host}/assets/${path.basename(id)}";`;
      return code;
    },
  },
  postcssTransform: {
    transform(code, id) {
      if (/\.(css|s[ac]ss)$/.test(id))
        return `export default ${JSON.stringify(cssDictionary[id])};`;
      return code;
    },
  },
  clean: cleanup(),
  resolve: resolve({
    extensions,
    modulesOnly: true,
  }),
  postcss: postCSS({
    inject: false,
    extract: false,
    modules: true,
    config: {
      ctx: {
        modules: cssDictionary,
        log: true,
      },
    },
    exec: true,
    getExportNamed: true,
  }),
  buble: buble({
    transforms: {
      letConst: false,
      arrow: false,
      classes: false,
      modules: false,
      destructuring: false,
      // because cleanup uses acorn - rest syntax unsupported.
      // parameterDestructuring: false,
      defaultParameter: false,
      conciseMethodProperty: false,
      templateString: false,
    },
    objectAssign: 'Object.assign',
    jsx: 'React.createElement',
  }),
  replace: {
    server: replace({
      patterns: [nodeEnv, replaceAssetDir, replaceWWW],
    }),
    www: replace({
      patterns: [nodeEnv, serverEnv],
    }),
  },
};

const www = {
  external,
  watch,
  input: 'src/www/index.jsx',
  output: {
    file: 'dist/www.js',
    format: 'cjs',
  },
  plugins: [
    plugins.replace.www,
    plugins.assetTransform,
    plugins.resolve,
    plugins.postcss,
    plugins.postcssTransform,
    plugins.buble,
    plugins.clean,
  ],
};

const server = {
  external,
  watch,
  input: 'src/server/app.js',
  output: {
    interop: false,
    file: 'dist/app.js',
    format: 'cjs',
  },
  plugins: [
    plugins.replace.server,
    plugins.resolve,
    plugins.buble,
    plugins.clean,
  ],
};

module.exports = [server, www];
