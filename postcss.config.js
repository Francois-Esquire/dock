/* eslint
    import/no-extraneous-dependencies: 0,
    global-require: 0
*/

const cssModules = require('postcss-modules');
const cssNext = require('postcss-cssnext');
const cssImport = require('postcss-import');
const cssNano = require('cssnano');
const scss = require('postcss-scss');

module.exports = function postcssConfig(ctx) {
  const debug = ctx.env !== 'production';

  const map = debug ? true : { inline: false };

  const cssDict = ctx.options.modules;

  const plugins = [cssImport(), cssNext()];

  if (cssDict) {
    plugins.push(
      cssModules({
        generateScopedName: '[local]___[name]',
        getJSON(filename, json) {
          if (filename in cssDict === false) cssDict[filename] = json;
        },
      }),
    );
  }

  if (debug) {
    plugins.push(
      cssNano({
        autoprefixer: false,
      }),
    );
  }

  return {
    parser: scss,
    map,
    plugins,
  };
};
