import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as userService from '../service/gebruiker';
import type {
  KoaContext,
  KoaRouter,
  KotTaskState,
  KotTaskContext,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/gebruiker';
import { authDelay } from '../core/auth';

/**
 * @api {post} /api/sessions Login
 * @apiName Login
 * @apiGroup Sessions
 * @apiDescription User session management.
 *
 * @apiBody {String} emailadres User's email address.
 * @apiBody {String} wachtwoord User's password.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *   "emailadres": "user@example.com",
 *   "wachtwoord": "securepassword123"
 * }
 *
 * @apiSuccess {String} token A JWT token to authenticate further requests.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "jwt.token.string"
 * }
 *
 * @apiError 400BadRequest You provided invalid data.
 * @apiError 401Unauthorized Authentication failed.
 */
const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { emailadres, wachtwoord } = ctx.request.body;
  const token = await userService.login(emailadres, wachtwoord);

  ctx.status = 200;
  ctx.body = { token };
};
login.validationScheme = {
  body: {
    emailadres: Joi.string().email(),
    wachtwoord: Joi.string(),
  },
};

export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<KotTaskState, KotTaskContext>({
    prefix: '/sessions',
  });

  router.post('/', authDelay, validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}
