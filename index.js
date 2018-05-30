const port = process.env.PORT || (process.env.PORT = 3000);

try {
  // eslint-disable-next-line global-require
  const app = require('./dist/app');

  // eslint-disable-next-line no-console
  app.listen(port, () => console.log('server is listening on %s', port));
} catch (e) {
  // TODO:
  // proper and informative error reporting
  throw e;
}
