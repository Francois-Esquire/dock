// require statement is ignored during build to reference files in dist/
// eslint-disable-next-line import/no-unresolved
const render = require('./www');

async function www(ctx) {
  const html = await render(ctx);

  ctx.body = html;
  ctx.status = 200;
  ctx.set('Content-Type', 'text/html');
}

export default www;
