import { execSync } from 'child_process';

export const exec = (cmd, env) =>
  execSync(cmd, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, env),
  });
