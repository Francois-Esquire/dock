const debug = process.env.NODE_ENV !== 'production';
const test = process.env.NODE_ENV === 'test';

const port = process.env.PORT || 3000;

try {
  if (debug === false) {
    // eslint-disable-next-line global-require
    const app = require('./dist/app');

    app.listen(port);
  } else if (test === false) {
    let app = (req, res) => res.end();

    // eslint-disable-next-line global-require
    const server = require('http').createServer((req, res) => app(req, res));

    server.listen(port, error => {
      if (error) throw error;

      // eslint-disable-next-line global-require
      require('./src/dev')(server, koa => {
        app = koa;
      });
    });
  }
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND')
    console.log('please run "npm run build" before you begin.\n');
  else throw e;
}
