import type { Taak } from './taak';
import type { Entity, ListResponse } from './common';
import type { Gebruiker } from './gebruiker';

export interface Agendablok extends Entity {
  gebruiker: Pick<Gebruiker, 'id'>;
  titel: string;
  datumVan: Date;
  datumTot: Date;
  taak?: Pick<Taak, 'id'> | null;
}

export interface AgendablokCreateInput {
  gebruiker: number;
  titel: string;
  datumVan: Date;
  datumTot: Date;
  taak: number | null;
}

export interface AgendablokUpdateInput extends Omit<AgendablokCreateInput, 'gebruiker'> { }

export interface CreateAgendablokRequest extends AgendablokCreateInput { }
export interface UpdateAgendablokRequest extends AgendablokUpdateInput { }

export interface GetAllAgendablokkenResponse extends ListResponse<Agendablok> { }
export interface GetAgendablokByIdResponse extends Agendablok { }
export interface CreateAgendablokResponse extends GetAgendablokByIdResponse { }
export interface UpdateAgendablokResponse extends GetAgendablokByIdResponse { }