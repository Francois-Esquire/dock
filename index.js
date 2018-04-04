const port = process.env.PORT || (process.env.PORT = 3000);

try {
  // eslint-disable-next-line global-require
  const app = require('./dist/app');
  console.log(app);
  app.listen(port);
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND')
    console.log(
      'please make sure to run "npm install & npm run build" before you begin.\n',
    );
  else throw e;
}
