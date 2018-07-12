import KoaRouter from 'koa-router';

// will be replaced during build by 'const render = require('./www');'
// otherwise working for tests.
import markup from '../../www';

const www = new KoaRouter();

www.get('/*', async function html(ctx) {
  ctx.set('Content-Type', 'text/html');

  try {
    ctx.body = await markup.render(ctx);
  } catch (e) {
    if (e.code === undefined) e.code = 500;
    ctx.body = markup.error(ctx, e);
  }
});

export default www;
