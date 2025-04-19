import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface KotTaskState {
  session: SessionInfo;
}

export interface KotTaskContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  KotTaskState,
  KotTaskContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<KotTaskState, KotTaskContext> { }

export interface KoaRouter extends Router<KotTaskState, KotTaskContext> { }
