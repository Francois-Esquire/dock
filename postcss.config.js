/* eslint
    import/no-extraneous-dependencies: 0
*/

const cssModules = require('postcss-modules');
const cssNext = require('postcss-cssnext');
const cssImport = require('postcss-import');
const cssNano = require('cssnano');
const scss = require('postcss-scss');

module.exports = function postcssConfig(ctx) {
  const debug = ctx.env !== 'production';

  const map = debug || { inline: false };

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

  if (debug === false) {
    plugins.push(
      cssNano({
        autoprefixer: false,
        mergeIdents: true,
      }),
    );
  }

  return {
    parser: scss,
    map,
    plugins,
  };
};
