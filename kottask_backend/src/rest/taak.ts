import Router from '@koa/router';
import * as taakService from '../service/taak';
import type {
  CreateTaakRequest,
  CreateTaakResponse,
  GetAllTakenResponse,
  GetTaakByIdResponse,
  UpdateTaakRequest,
  UpdateTaakResponse,
} from '../types/taak';
import type { KotTaskContext, KotTaskState, KoaContext, KoaRouter } from '../types/koa';
import type { IdParams } from '../types/common';
import { requireAuthentication } from '../core/auth';
import validate from '../core/validation';
import Joi from 'joi';

/**
 * @apiDefine Taak
 * @apiDescription Endpoints for managing tasks.
 */

/**
 * @apiDefine TaakResponse
 * @apiSuccess {Number} id Task ID.
 * @apiSuccess {String} titel Title of the task.
 * @apiSuccess {String} beschrijving Description of the task.
 * @apiSuccess {String} prioriteit Priority of the task.
 * @apiSuccess {Boolean} afgewerkt Status of the task (true if completed).
 * @apiSuccess {Object} gemaaktDoor The user who created the task.
 * @apiSuccess {Number} gemaaktDoor.id ID of the user who created the task.
 * @apiSuccess {String} gemaaktDoor.naam Last name of the user who created the task.
 * @apiSuccess {String} gemaaktDoor.voornaam First name of the user who created the task.
 * @apiSuccess {Object[]} gemaaktVoor Array of users the task is assigned to.
 * @apiSuccess {Number} gemaaktVoor.id ID of the user the task is assigned to.
 * @apiSuccess {String} gemaaktVoor.naam Last name of the user the task is assigned to.
 * @apiSuccess {String} gemaaktVoor.voornaam First name of the user the task is assigned to.
 */

/**
 * @api {get} /taken Get all taken
 * @apiName GetAllTaken
 * @apiGroup Taak
 * 
 * @apiSuccess {Object[]} items List of tasks.
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
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
 */
const getAllTaken = async (ctx: KoaContext<GetAllTakenResponse>) => {
  const taken = await taakService.getAll();
  ctx.body = {
    items: taken,
  };
};
getAllTaken.validationScheme = null;

/**
 * @api {post} /taken Create a new taak
 * @apiName CreateTaak
 * @apiGroup Taak
 * 
 * @apiBody {String} titel The title of the task.
 * @apiBody {String} beschrijving The description of the task.
 * @apiBody {String} prioriteit The priority of the task.
 * @apiBody {Number[]} gemaaktVoor The list of user IDs to assign the task to.
 * 
 * @apiSuccess {Object} taak The created task object.
 * @apiUse TaakResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
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
 * 
 * @apiError (400) BadRequest The request body is invalid.
 * @apiError (401) Unauthorized The user is not authenticated.
 */
const createTaak = async (ctx: KoaContext<CreateTaakResponse, void, CreateTaakRequest>) => {
  const taak = await taakService.create({...ctx.request.body, gemaaktDoor: ctx.state.session.gebruikerId});
  ctx.status = 201;
  ctx.body = taak;
};
createTaak.validationScheme = {
  body: {
    titel: Joi.string().required(),
    beschrijving: Joi.string().required(),
    prioriteit: Joi.string().required(),
    gemaaktVoor: Joi.array().items(Joi.number().integer()).min(1).required(),
  },
};

/**
 * @api {get} /taken/:id Get Taak by ID
 * @apiName GetTaakById
 * @apiGroup Taak
 * 
 * @apiParam {Number} id The unique identifier of the taak to retrieve.
 * 
 * @apiSuccess {Object} taak The task object.
 * @apiUse TaakResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
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
 * 
 * @apiError (404) NotFound No taak with this ID exists.
 */
const getTaakById = async (ctx: KoaContext<GetTaakByIdResponse, IdParams>) => {
  const taak = await taakService.getById(Number(ctx.params.id));
  ctx.body = taak;
};
getTaakById.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
};

/**
 * @api {put} /taken/:id Update an existing taak
 * @apiName UpdateTaak
 * @apiGroup Taak
 * 
 * @apiParam {Number} id The unique ID of the taak to update.
 * 
 * @apiBody {String} titel The updated title of the task.
 * @apiBody {String} beschrijving The updated description of the task.
 * @apiBody {String} prioriteit The updated priority of the task.
 * @apiBody {Boolean} afgewerkt The updated status of the task (true if completed).
 * @apiBody {Number[]} gemaaktVoor The updated list of user IDs to assign the task to.
 * 
 * @apiSuccess {Object} taak The updated task object.
 * @apiUse TaakResponse
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "titel": "Task Title",
 *       "beschrijving": "Task description",
 *       "prioriteit": "HEEL_DRINGEND",
 *       "afgewerkt": true,
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
 *     } * 
 * @apiError (400) BadRequest Some parameters may contain invalid values.
 * @apiError (404) NotFound No taak with this ID exists.
 * @apiError (401) Unauthorized The user is not authenticated.
 */
const updateTaak = async (ctx: KoaContext<UpdateTaakResponse, IdParams, UpdateTaakRequest>) => {
  const taak = await taakService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.body = taak;
};
updateTaak.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
  body: {
    titel: Joi.string().required(),
    beschrijving: Joi.string().required(),
    prioriteit: Joi.string().required(),
    afgewerkt: Joi.boolean().required(),
    gemaaktVoor: Joi.array().items(Joi.number().integer()).min(1).required(),
  },
};

/**
 * @api {delete} /taken/:id Delete a taak
 * @apiName DeleteTaak
 * @apiGroup Taak
 * 
 * @apiParam {Number} id The unique ID of the taak to delete.
 * 
 * @apiSuccess (204) NoContent The taak was successfully deleted.
 * 
 * @apiError (404) NotFound No taak with this ID exists.
 * @apiError (401) Unauthorized The user is not authorized to delete the taak.
 */
const deleteTaak = async (ctx: KoaContext<void, IdParams>) => {
  await taakService.deleteById(Number(ctx.params.id), ctx.state.session.gebruikerId);
  ctx.status = 204;
};
deleteTaak.validationScheme = {
  params:{
    id: Joi.number().integer().required(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<KotTaskState, KotTaskContext>({
    prefix: '/taken',
  });
  router.use(requireAuthentication);
  router.get('/', validate(getAllTaken.validationScheme), getAllTaken);
  router.post('/', validate(createTaak.validationScheme), createTaak);
  router.get('/:id', validate(getTaakById.validationScheme), getTaakById);
  router.put('/:id', validate(updateTaak.validationScheme), updateTaak);
  router.delete('/:id', validate(deleteTaak.validationScheme), deleteTaak);

  parent.use(router.routes()).use(router.allowedMethods());
};
