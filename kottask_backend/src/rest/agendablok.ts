import Router from '@koa/router';
import * as agendablokService from '../service/agendablok';
import Joi from 'joi';
import type {
  CreateAgendablokRequest,
  CreateAgendablokResponse,
  GetAllAgendablokkenResponse,
  GetAgendablokByIdResponse,
  UpdateAgendablokRequest,
  UpdateAgendablokResponse,
} from '../types/agendablok';
import type { KotTaskContext, KotTaskState, KoaContext, KoaRouter } from '../types/koa';
import type { IdParams } from '../types/common';
import { requireAuthentication } from '../core/auth';
import validate from '../core/validation';

/**
 * @apiDefine Agendablok
 * @apiDescription Endpoints for managing agenda blocks.
 */

/**
 * @apiDefine AgendablokResponse
 * @apiSuccess {Number} id Agenda block ID.
 * @apiSuccess {Object} gebruiker User who created the agenda block.
 * @apiSuccess {Number} gebruiker.id User ID.
 * @apiSuccess {String} gebruiker.naam User's last name.
 * @apiSuccess {String} gebruiker.voornaam User's first name.
 * @apiSuccess {String} titel Name of the agenda block.
 * @apiSuccess {Date} datumVan Start date of the agenda block.
 * @apiSuccess {Date} datumTot End date of the agenda block.
 * @apiSuccess {Object} [taak] Task linked to the agenda block.
 * @apiSuccess {Number} taak.id Task ID.
 * @apiSuccess {String} taak.titel Task title.
 * @apiSuccess {String} taak.beschrijving Task description.
 * @apiSuccess {Object} taak.gemaaktDoor User who created the task.
 * @apiSuccess {Number} taak.gemaaktDoor.id User ID.
 * @apiSuccess {String} taak.gemaaktDoor.naam User's last name.
 * @apiSuccess {String} taak.gemaaktDoor.voornaam User's first name.
 */

/**
 * @api {get} /agendablokken Get all agendablokken
 * @apiName GetAllAgendablokken
 * @apiGroup Agendablok
 * 
 * @apiSuccess {Object[]} items List of agenda blocks.
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
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
 */
const getAllAgendablokken = async (ctx: KoaContext<GetAllAgendablokkenResponse>) => {
  const agendablokken = await agendablokService.getAll();
  ctx.body = {
    items: agendablokken,
  };
};
getAllAgendablokken.validationScheme = null;

/**
 * @api {post} /agendablokken Create a new agendablok
 * @apiName CreateAgendablok
 * @apiGroup Agendablok
 * 
 * @apiBody {String} titel The title of the agendablok.
 * @apiBody {Date} datumVan The start date of the agendablok.
 * @apiBody {Date} datumTot The end date of the agendablok.
 * @apiBody {Number} [taak] The task ID linked to the agendablok.
 * 
 * @apiSuccess {Object} agendablok The created agendablok object.
 * @apiUse AgendablokResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
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
 * 
 * @apiError (400) BadRequest The request body is invalid.
 * @apiError (401) Unauthorized The user is not authenticated.
 */
const createAgendablok = async (ctx: KoaContext<CreateAgendablokResponse, void, CreateAgendablokRequest>) => {
  const agendablok = await agendablokService.create({ ...ctx.request.body, gebruiker: ctx.state.session.gebruikerId });
  ctx.status = 201;
  ctx.body = agendablok;
};
createAgendablok.validationScheme = {
  body: {
    titel: Joi.string().required(),
    datumVan: Joi.date().required(),
    datumTot: Joi.date().required(),
    taak: Joi.number().integer().optional(),
  },
};

/**
 * @api {get} /agendablokken/:id Get Agendablok by ID
 * @apiName GetAgendablokById
 * @apiGroup Agendablok
 * 
 * @apiParam {Number} id The unique identifier of the agendablok to retrieve.
 * 
 * @apiSuccess {Object} agendablok The agendablok object.
 * @apiUse AgendablokResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
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
 * 
 * @apiError (404) NotFound No agendablok with this ID exists.
 */
const getAgendablokById = async (ctx: KoaContext<GetAgendablokByIdResponse, IdParams>) => {
  const agendablok = await agendablokService.getById(Number(ctx.params.id));
  ctx.body = agendablok;
};
getAgendablokById.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
};

/**
 * @api {put} /agendablokken/:id Update an existing agendablok
 * @apiName UpdateAgendablok
 * @apiGroup Agendablok
 * 
 * @apiParam {Number} id The unique ID of the agendablok to update.
 * 
 * @apiBody {String} titel The updated title of the agendablok.
 * @apiBody {Date} datumVan The updated start date of the agendablok.
 * @apiBody {Date} datumTot The updated end date of the agendablok.
 * @apiBody {Number} [taak] The updated task ID linked to the agendablok.
 * 
 * @apiSuccess {Object} agendablok The updated agendablok object.
 * @apiUse AgendablokResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "gebruiker": {
 *         "id": 1,
 *         "naam": "Doe",
 *         "voornaam": "John"
 *       },
 *       "titel": "WorkChange",
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
 * 
 * @apiError (400) BadRequest Some parameters may contain invalid values.
 * @apiError (404) NotFound No agendablok with this ID exists.
 * @apiError (401) Unauthorized The user is not authenticated.
 */
const updateAgendablok = async (ctx: KoaContext<UpdateAgendablokResponse, IdParams, UpdateAgendablokRequest>) => {
  const agendablok = await agendablokService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.body = agendablok;
};
updateAgendablok.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
  body: {
    titel: Joi.string().required(),
    datumVan: Joi.date().required(),
    datumTot: Joi.date().required(),
    taak: Joi.number().integer().optional(),
  },
};

/**
 * @api {delete} /agendablokken/:id Delete an agendablok
 * @apiName DeleteAgendablok
 * @apiGroup Agendablok
 * 
 * @apiParam {Number} id The unique ID of the agendablok to delete.
 * 
 * @apiSuccess (204) NoContent The agendablok was successfully deleted.
 * 
 * @apiError (404) NotFound No agendablok with this ID exists.
 * @apiError (401) Unauthorized The user is not authorized to delete the agendablok.
 */
const deleteAgendablok = async (ctx: KoaContext<void, IdParams>) => {
  await agendablokService.deleteById(Number(ctx.params.id), ctx.state.session.gebruikerId);
  ctx.status = 204;
};
deleteAgendablok.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<KotTaskState, KotTaskContext>({
    prefix: '/agendablokken',
  });

  router.use(requireAuthentication);
  router.get('/', validate(getAllAgendablokken.validationScheme), getAllAgendablokken);
  router.post('/', validate(createAgendablok.validationScheme), createAgendablok);
  router.get('/:id', validate(getAgendablokById.validationScheme), getAgendablokById);
  router.put('/:id', validate(updateAgendablok.validationScheme), updateAgendablok);
  router.delete('/:id', validate(deleteAgendablok.validationScheme), deleteAgendablok);

  parent.use(router.routes()).use(router.allowedMethods());
};
