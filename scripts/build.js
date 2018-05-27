import { exec } from 'helpers';

exec('rimraf dist');

exec('rollup -c');

exec('webpack', {
  BABEL_ENV: 'production',
});
