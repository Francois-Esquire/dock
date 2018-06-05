import { execSync } from 'child_process';

const cwd = process.cwd();

export const exec = (cmd, env) =>
  execSync(cmd, {
    cwd,
    stdio: 'inherit',
    env: Object.assign({}, process.env, env),
  });
