import Router from '@koa/router';
import type { Next } from 'koa';
import * as gebruikerService from '../service/gebruiker';
import * as agendablokService from '../service/agendablok';
import * as taakService from '../service/taak';
import Joi from 'joi';
import validate from '../core/validation';
import type {
  CreateGebruikerRequest,
  GetAllGebruikersResponse,
  GetGebruikerByIdResponse,
  GetGebruikerRequest,
  LoginResponse,
  UpdateGebruikerRequest,
  UpdateGebruikerResponse,
} from '../types/gebruiker';
import type { KotTaskContext, KotTaskState, KoaContext, KoaRouter } from '../types/koa';
import type { GetAllTakenResponse } from '../types/taak';
import { requireAuthentication, authDelay } from '../core/auth';
import type { GetAllAgendablokkenResponse } from '../types/agendablok';
import type { IdParams } from '../types/common';

/**
 * @apiDefine Gebruiker
 * @apiDescription Endpoints for managing users.
 */

/**
 * @apiDefine GebruikerResponse
 * 
 * @apiSuccess {Number} id Unique user ID.
 * @apiSuccess {String} naam Name of the user.
 * @apiSuccess {String} voornaam Firstname of the user.
 * @apiSuccess {String} emailadres Email address of the user.
 */

/**
 * Middleware to check if the gebruikerId in the session matches the requested gebruikerId.
 * 
 * @param {KoaContext<GetGebruikerRequest>} ctx - The Koa context object
 * @param {Next} next - The next middleware in the stack
 * @throws {403} Throws a forbidden error if the gebruikerId does not match.
 */
const checkGebruikerId = (ctx: KoaContext<unknown, GetGebruikerRequest>, next: Next) => {
  const { gebruikerId } = ctx.state.session;
  const { id } = ctx.params;
  if (id !== 'me' && id !== gebruikerId) {
    return ctx.throw(
      403,
      'You are not allowed to view this user\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

/**
  * @api {get} /gebruikers Get all Users
  * @apiName GetAllGebruikers
  * @apiGroup Gebruiker
  * 
  * @apiSuccess {Object[]} items List of users.
  * @apiSuccess {Object} items.gebruiker User object.
  * @apiUse GebruikerResponse
  * 
  * @apiSuccessExample {json} Success-Response:
  *   HTTP/1.1 200 OK
  *   {
  *     "items": [
  *       {
  *         "id": 1,
  *         "naam": "Doe",
  *         "voornaam": "John",
  *         "emailadres": "john.doe@example.com"
  *       }
  *     ]
  *   }
  * 
  * @apiError (401) Unauthorized The user is not authenticated.
  * @apiError (403) Forbidden The user is not allowed to view this user's information.
 */
const getAllGebruikers = async (ctx: KoaContext<GetAllGebruikersResponse>) => {
  const gebruikers = await gebruikerService.getAll();
  ctx.body = {
    items: gebruikers,
  };
};
getAllGebruikers.validationScheme = null;

/**
 * @api {post} /gebruikers Register a new User
 * @apiName RegisterGebruiker
 * @apiGroup Gebruiker
 * 
 * @apiBody {String} naam Name of the user.
 * @apiBody {String} voornaam Firstname of the user.
 * @apiBody {String} emailadres Email address of the user.
 * @apiBody {String} wachtwoord Password of the user.
 * 
 * @apiSuccess {String} token Authentication token.
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "token": "jwt.token.string"
 *   }
 * 
 * @apiError (400) BadRequest The request is invalid.
 */
const registerGebruiker = async (ctx: KoaContext<LoginResponse, void, CreateGebruikerRequest>) => {
  const token = await gebruikerService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};

registerGebruiker.validationScheme = {
  body: {
    naam: Joi.string().required(),
    voornaam: Joi.string().required(),
    emailadres: Joi.string().email().required(),
    wachtwoord: Joi.string().min(8),
  },
};

/**
 * @api {get} /gebruikers/:id Get User by ID
 * @apiName GetGebruikerById
 * @apiGroup Gebruiker
 * 
 * @apiParam {Number|String} id User's unique ID or 'me'.
 * 
 * @apiUse GebruikerResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "id": 1,
 *     "naam": "Doe",
 *     "voornaam": "John",
 *     "emailadres": "john.doe@example.com"
 *   }
 * 
 * @apiError (401) Unauthorized The user is not authenticated.
 * @apiError (403) Forbidden The user is not allowed to view this user's information.
 * @apiError (404) NotFound No gebruiker with this id exists.
 */
const getGebruikerById = async (ctx: KoaContext<GetGebruikerByIdResponse, GetGebruikerRequest>) => {
  const gebruiker = await gebruikerService.getById(Number(ctx.params.id === 'me' ? ctx.state.session.gebruikerId
    : ctx.params.id));
  ctx.body = gebruiker;
};

getGebruikerById.validationScheme = {
  params: {
    id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().valid('me')),
  },
};

/**
 * @api {put} /gebruikers/:id Update User by ID
 * @apiName UpdateGebruiker
 * @apiGroup Gebruiker
 * 
 * @apiParam {Number} id User's unique ID.
 * 
 * @apiBody {String} naam Name of the user.
 * @apiBody {String} voornaam Firstname of the user.
 * @apiBody {String} emailadres Email address of the user.
 * 
 * @apiUse GebruikerResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "id": 1,
 *     "naam": "Changed",
 *     "voornaam": "John",
 *     "emailadres": "john.doe@example.com"
 *   }
 * 
 * @apiError (400) BadRequest The request is invalid.
 * @apiError (401) Unauthorized The user is not authenticated.
 * @apiError (404) NotFound No gebruiker with this id exists.
 */
const updateGebruiker = async (ctx: KoaContext<UpdateGebruikerResponse, IdParams, UpdateGebruikerRequest>) => {
  const gebruiker = await gebruikerService.updateById(ctx.params.id, ctx.request.body!);
  ctx.body = gebruiker;
};

updateGebruiker.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string().required(),
    voornaam: Joi.string().required(),
    emailadres: Joi.string().email().required(),
  },
};

/**
 * @api {get} /gebruikers/:id/taken Get Tasks for User by ID
 * @apiName GetTakenForGebruikerId
 * @apiGroup Gebruiker
 * 
 * @apiParam {Number|String} id User's unique ID or 'me'.
 * 
 * @apiSuccess {Object[]} items List of tasks.
 * @apiSuccess {Number} items.id Unique task ID.
 * @apiSuccess {String} items.naam Name of the task.
 * @apiSuccess {String} items.beschrijving Description of the task.
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 * {
 *   "items": [
 *     {
 *       "id": 1,
 *       "titel": "Stofzuigen",
 *       "beschrijving": "Stofzuigen in de hoekjes van de kamer.",
 *       "prioriteit": "HEEL_DRINGEND",
 *       "afgewerkt": false,
 *       "gemaaktDoor": {
 *         "id": 1,
 *         "naam": "Doe",
 *         "voornaam": "John"
 *       },
 *       "gemaaktVoor": [
 *         {
 *           "id": 2,
 *           "naam": "Smith",
 *           "voornaam": "Jane"
 *         },
 *         {
 *           "id": 3,
 *           "naam": "Brown",
 *           "voornaam": "Bob"
 *         }
 *       ]
 *     }
 *   ]
 * }
 * 
 * @apiError (401) Unauthorized The user is not authenticated.
 * @apiError (403) Forbidden The user is not allowed to view these tasks.
 * @apiError (404) NotFound No gebruiker with this id exists.
 */
const getTakenForGebruikerId = async (ctx: KoaContext<GetAllTakenResponse, GetGebruikerRequest>) => {
  const taken = await taakService.getTakenVoorGebruikerId(ctx.params.id === 'me' ? ctx.state.session.gebruikerId
    : ctx.params.id);
  ctx.body = { items: taken };
};

getTakenForGebruikerId.validationScheme = {
  params: {
    id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().valid('me')),
  },
};

/**
 * @api {get} /gebruikers/:id/agendablokken Get Agenda Blocks for User by ID
 * @apiName GetAgendablokkenByGebruikerId
 * @apiGroup Gebruiker
 * 
 * @apiParam {Number|String} id User's unique ID or 'me'.
 * 
 * @apiSuccess {Object[]} items List of agenda blocks.
 * @apiSuccess {Number} items.id Unique agenda block ID.
 * @apiSuccess {String} items.titel Title of the agenda block.
 * @apiSuccess {String} items.beschrijving Description of the agenda block.
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 * {
 *   "items": [
 *     {
 *       "id": 1,
 *       "gebruiker": {
 *         "id": 1,
 *         "naam": "Doe",
 *         "voornaam": "John"
 *       },
 *       "titel": "Work",
 *       "datumVan": "2024-12-01T10:00:00Z",
 *       "datumTot": "2024-12-01T11:00:00Z",
 *       "taak": {
 *         "id": 10,
 *         "titel": "Task Title",
 *         "beschrijving": "Task Description",
 *         "gemaaktDoor": {
 *           "id": 2,
 *           "naam": "Smith",
 *           "voornaam": "Jane"
 *         }
 *       }
 *     }
 *   ]
 * }
 * 
 * @apiError (401) Unauthorized The user is not authenticated.
 * @apiError (403) Forbidden The user is not allowed to view these agenda blocks.
 * @apiError (404) NotFound No gebruiker with this id exists.
 */
const getAgendablokkenByGebruikerId = async (ctx: KoaContext<GetAllAgendablokkenResponse, GetGebruikerRequest>) => {
  const agendablokken = await agendablokService.getAgendablokkenByGebruikerId(ctx.params.id === 'me'
    ? ctx.state.session.gebruikerId : ctx.params.id);
  ctx.body = { items: agendablokken };
};
getAgendablokkenByGebruikerId.validationScheme = {
  params: {
    id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().valid('me')),
  },
};

/**
 * @api {delete} /gebruikers/:id Delete User by ID
 * @apiName DeleteGebruikerById
 * @apiGroup Gebruiker
 * 
 * @apiParam {Number} id User's unique ID.
 * 
 * @apiSuccess (204) NoContent The user was successfully deleted.
 * 
 * @apiError (401) Unauthorized The user is not authenticated.
 * @apiError (403) Forbidden The user is not allowed to delete this user.
 * @apiError (404) NotFound No gebruiker with this id exists.
 */
const deleteGebruikerById = async (ctx: KoaContext<void, IdParams>) => {
  await gebruikerService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteGebruikerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<KotTaskState, KotTaskContext>({
    prefix: '/gebruikers',
  });

  router.post('/', authDelay, validate(registerGebruiker.validationScheme), registerGebruiker);

  router.get('/', requireAuthentication, validate(getAllGebruikers.validationScheme),
    getAllGebruikers);
  router.get('/:id', requireAuthentication, validate(getGebruikerById.validationScheme),
    checkGebruikerId, getGebruikerById);
  router.put('/:id', requireAuthentication, validate(updateGebruiker.validationScheme),
    checkGebruikerId, updateGebruiker);
  router.get('/:id/agendablokken', requireAuthentication, validate(getAgendablokkenByGebruikerId.validationScheme),
    getAgendablokkenByGebruikerId);
  router.get('/:id/taken', requireAuthentication, validate(getTakenForGebruikerId.validationScheme),
    getTakenForGebruikerId);
  router.delete('/:id', requireAuthentication, validate(deleteGebruikerById.validationScheme),
    checkGebruikerId, deleteGebruikerById);

  parent.use(router.routes()).use(router.allowedMethods());
};
