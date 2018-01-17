const buble = require('rollup-plugin-buble');

import pkg from './package.json';

const external = Object.keys(pkg.dependencies).concat(Object.keys(pkg.devDependencies));
const extensions = ['.js', '.jsx'];

const watch = {
    chokidar: true,
};

const server = {
    extensions,
    external,
    watch,
    input: 'src/server/app.js',
    output: {
        interop: false,
        file: 'dist/app.js',
        format: 'cjs',
    },
    plugins: [
        buble({
            transform: {
                letConst: false,
                arrow: false,
                classes: false,
                modules: false,
                destructuring: false,
                parameterDestructuring: false,
                defaultParameter: false,
                conciseMethodProperty: false,
                templateString: false,
            },
        }),
    ],
};

const render = {
    extensions,
    external,
    watch,
    input: 'src/www/index.jsx',
    output: {
        file: 'dist/www.js',
        format: 'cjs',
    },
    plugins: [
        buble({
            transforms: {
                letConst: false,
                arrow: false,
                classes: false,
                modules: false,
                destructuring: false,
                parameterDestructuring: false,
                defaultParameter: false,
                conciseMethodProperty: false,
                templateString: false,
              },
              objectAssign: 'Object.assign',
              jsx: 'React.createElement',
        }),
    ],
};

const client = {
    extensions,
    external,
    watch,
    input: 'src/www/main.jsx',
    output: {
        file: 'public/main.js',
        format: 'iife',
    },
    plugins: [
        buble({
              objectAssign: 'Object.assign',
              jsx: 'React.createElement',
        }),
    ],
};

module.exports = [
    server,
    render,
    client,
];