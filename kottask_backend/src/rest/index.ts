import Router from '@koa/router';
import installGebruikerRouter from './gebruiker';
import installAgendablokRouter from './agendablok';
import installTaakRouter from './taak';
import installHealthRouter from './health';
import installSessionRouter from './session';
import type {
  KotTaskContext,
  KotTaskState,
  KoaApplication,
} from '../types/koa';

/**
 * @apiDefine Index
 * @apiDescription The root of the API. This is the entry point where all the routes are defined.
 * The API supports endpoints for managing users, tasks, agendas, health status, and session information.
 */

export default (app: KoaApplication) => {
  const router = new Router<KotTaskState, KotTaskContext>({
    prefix: '/api',
  });

  installGebruikerRouter(router);
  installAgendablokRouter(router);
  installTaakRouter(router);
  installHealthRouter(router);
  installSessionRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};