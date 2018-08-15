import KoaRouter from 'koa-router';

import www from './www';
import api from './api';
import graphql from './graphql';

const router = new KoaRouter();

router
  .use(graphql.routes())
  .use(graphql.allowedMethods())
  .use(api.routes())
  .use(api.allowedMethods())
  .use(www.routes())
  .use(www.allowedMethods());

export default router;
