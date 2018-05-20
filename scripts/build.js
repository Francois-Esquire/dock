import { execSync } from 'child_process';

const exec = (cmd, env) =>
  execSync(cmd, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, env),
  });

exec('rimraf dist');

exec('rollup -c');

exec('webpack', {
  BABEL_ENV: 'production',
});
