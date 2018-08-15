import path from 'path';

import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-re';
import resolve from 'rollup-plugin-node-resolve';
import postCSS from 'rollup-plugin-postcss';
import graphql from 'rollup-plugin-graphql';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const external = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.devDependencies))
  .concat('react-dom/server', 'stream');

const watch = {
  chokidar: true,
  include: 'src/**',
  exclude: 'node_modules/**',
};

const extensions = ['.js', '.jsx', '.css', '.scss'];

const [
  nodeEnv,
  serverEnv,
  clientSwap,
  replaceWWW,
  replaceDB,
  replaceSchema,
  replaceModels,
] = [
  {
    test: 'process.env.NODE_ENV',
    replace: JSON.stringify(process.env.NODE_ENV),
  },
  {
    test: 'process.env.SERVER',
    replace: JSON.stringify(true),
  },
  {
    // replace browser client with server mock
    test: "import client from '../../www/client';",
    replace: 'const client = { mutate: () => undefined }',
  },
  {
    test: "import markup from '../../www';",
    replace: "const markup = require('./www');",
  },
  {
    test: "import { mongo, redis } from '../db/db';",
    replace: "const { mongo, redis } = require('./db');",
  },
  {
    test: "import schema from '../schema';",
    replace: "const schema = require('./schema');",
  },
  {
    test: "import * as models from '../models';",
    replace: "const models = require('./models');",
  },
];

const cssDictionary = {};

const plugins = {
  assetTransform: {
    transform(code, id) {
      if (/\.(gif|png|jpg)$/.test(id))
        return `export default "/assets/${path.basename(id)}";`;

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
  graphql: graphql(),
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
      patterns: [nodeEnv, replaceWWW, replaceDB, replaceSchema, replaceModels],
    }),
    www: replace({
      patterns: [nodeEnv, serverEnv, clientSwap, replaceSchema],
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
  // inlineDynamicImport: true,
  plugins: [
    plugins.replace.www,
    plugins.assetTransform,
    plugins.resolve,
    plugins.graphql,
    plugins.postcss,
    plugins.postcssTransform,
    plugins.buble,
    plugins.clean,
  ],
};

const server = {
  external,
  watch,
  input: [
    'src/server/app.js',
    'src/db/db.js',
    'src/schema/schema.js',
    'src/models/models.js',
  ],
  output: {
    interop: false,
    dir: 'dist',
    format: 'cjs',
  },
  experimentalCodeSplitting: true,
  plugins: [
    plugins.replace.server,
    plugins.resolve,
    plugins.graphql,
    plugins.buble,
    plugins.clean,
  ],
};

module.exports = [server, www];
