const debug = process.env.NODE_ENV !== 'production';
const test = process.env.NODE_ENV === 'test';

const port = process.env.PORT || (process.env.PORT = 3000);

try {
  if (debug === false) {
    // eslint-disable-next-line global-require
    const app = require('./dist/app');

    app.listen(port);
  } else if (test === false) require('./dev'); // eslint-disable-line global-require
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND')
    console.log('please run "npm run build" before you begin.\n');
  else throw e;
}
