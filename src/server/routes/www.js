import KoaRouter from 'koa-router';

// will be replaced during build by 'const render = require('./www');'
// otherwise working for tests.
import markup from '../../www';

async function html(ctx) {
  ctx.set('Content-Type', 'text/html');

  try {
    ctx.body = await markup.render(ctx);
  } catch (e) {
    ctx.body = markup.error(e, (ctx.status = 500));
  }
}

const www = new KoaRouter();

www.get('/*', html);

export default www;
