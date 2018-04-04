import { execSync } from 'child_process';
import stream from 'stream';
import fs from 'fs';

import pkg from '../package.json';

// const copy = (from, to) =>
//   fs.createReadStream(from).pipe(fs.createWriteStream(to));

const write = (to, cb = _stream => _stream) =>
  cb(
    new stream.Transform({
      transform(chunk, encoding, callback) {
        callback(undefined, chunk);
      },
    }),
  ).pipe(fs.createWriteStream(to));

const exec = (cmd, env) =>
  execSync(cmd, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, env),
  });

exec('rimraf dist');

exec('rollup -c');

exec('webpack');

write('dist/index.js', _stream => {
  /* eslint-disable */
  _stream.write(
    `(${function startup() {
      require('./app.js').listen(process.env.PORT || 3000);
    }})()`,
  );
  /* eslint-enable */

  return _stream;
});

write('dist/package.json', _stream => {
  const { name, version, scripts, dependencies } = pkg;

  _stream.write(
    JSON.stringify(
      {
        name,
        version,
        scripts: { start: `NODE_ENV=production ${scripts.start}` },
        dependencies,
      },
      undefined,
      2,
    ),
  );

  return _stream;
});
