import register from '@babel/register';
// import 'ignore-styles';

register({
  babelrc: false,
  sourceMaps: 'inline',
  extensions: ['.js', '.jsx'],
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
  presets: ['@babel/preset-react', ['@ava/stage-4', { modules: false }]],
});
