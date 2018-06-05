import KoaRouter from 'koa-router';

import www from './www';
import api from './api';

const router = new KoaRouter();

router
  .use(api.routes())
  .use(api.allowedMethods())
  .use(www.routes())
  .use(www.allowedMethods());

export default router;
