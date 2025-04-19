import type { Prioriteit } from '@prisma/client';
import type { Entity, ListResponse } from './common';
import type { Gebruiker } from './gebruiker';

export interface Taak extends Entity {
  gemaaktDoor: Pick<Gebruiker, 'id'>;
  titel: string;
  beschrijving: string;
  prioriteit: Prioriteit;
  gemaaktVoor: Pick<Gebruiker, 'id'>[];
}

export interface TaakCreateInput {
  gemaaktDoor: number;
  titel: string;
  beschrijving: string;
  prioriteit: Prioriteit;
  gemaaktVoor: number[];
}

export interface TaakUpdateInput extends Omit<TaakCreateInput, 'gemaaktDoor'> {
  afgewerkt: boolean;
}

export interface CreateTaakRequest extends TaakCreateInput { }
export interface UpdateTaakRequest extends TaakUpdateInput { }

export interface GetAllTakenResponse extends ListResponse<Taak> { }
export interface GetTaakByIdResponse extends Taak { }
export interface CreateTaakResponse extends GetTaakByIdResponse { }
export interface UpdateTaakResponse extends GetTaakByIdResponse { }