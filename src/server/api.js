import KoaRouter from 'koa-router';

const api = new KoaRouter({ prefix: '/api' });

async function API(ctx) {
  ctx.status = 200;
  ctx.body = 'welcome to the api';
}

api.get(/\/*/, API);

export default api;
