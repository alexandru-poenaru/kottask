import Router from '@koa/router';
import * as healthService from '../service/health';
import type { KotTaskContext, KotTaskState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { PingResponse, VersionResponse } from '../types/health';
import validate from '../core/validation';

/**
 * @apiDefine Health
 * @apiDescription Endpoints for checking the health of the application.
*/

/**
 * @api {get} /health/ping Check if the server is alive
 * @apiName Ping
 * @apiGroup Health
 * 
 * @apiSuccess {String} message The response message.
 * 
 * @apiError (500) InternalServerError The server is not responding.
 * @apiError (503) ServiceUnavailable The server is not available.
 */
const ping = async (ctx: KoaContext<PingResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

/**
 * @api {get} /health/version Get the version of the application
 * @apiName GetVersion
 * @apiGroup Health
 * 
 * @apiSuccess {String} version The version of the application.
 * 
 * @apiError (500) InternalServerError The server is not responding.
 * @apiError (503) ServiceUnavailable The server is not available.
*/
const getVersion = async (ctx: KoaContext<VersionResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;

export default function installPlacesRoutes(parent: KoaRouter) {
  const router = new Router<KotTaskState, KotTaskContext>({ prefix: '/health' });

  router.get('/ping', validate(ping.validationScheme), ping);
  router.get('/version', validate(getVersion.validationScheme), getVersion);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};