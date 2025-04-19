import type { Next } from 'koa';
import type { KoaContext } from '../types/koa';
import * as gebruikerService from '../service/gebruiker';
import config from 'config';

const AUTH_MAX_DELAY = config.get<number>('auth.maxDelay');

export const authDelay = async (_: KoaContext, next: Next) => {
  await new Promise((resolve) => {
    const delay = Math.round(Math.random() * AUTH_MAX_DELAY);
    setTimeout(resolve, delay);
  });
  return next();
};

export const requireAuthentication = async (ctx: KoaContext, next: Next) => {
  const { authorization } = ctx.headers;

  ctx.state.session = await gebruikerService.checkAndParseSession(authorization);

  return next();
};
