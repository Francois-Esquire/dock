import KoaRouter from 'koa-router';

import api from './api';

// require statement is ignored during build to reference files in dist/
// eslint-disable-next-line import/no-unresolved
const render = require('./www');

async function html(ctx) {
  // eslint-disable-next-line no-underscore-dangle
  const _html = await render(ctx);

  ctx.body = _html;
  ctx.status = 200;
  ctx.set('Content-Type', 'text/html');
}

const router = new KoaRouter();

router
  .use(api.allowedMethods())
  .use(api.routes())
  .get(/\/*/, html);

export default router;
