import KoaRouter from 'koa-router';

const api = new KoaRouter({ prefix: '/api' });

api.get(/\/*/, async function rest(ctx) {
  ctx.status = 200;
  ctx.body = 'welcome to the api endpoint';
});

export default api;
