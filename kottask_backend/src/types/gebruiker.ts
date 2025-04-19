import type { Entity, ListResponse } from './common';

export interface Gebruiker extends Entity {
  naam: string;
  voornaam: string;
  emailadres: string;
  wachtwoord: string;
}

export interface PublicGebruiker extends Pick<Gebruiker, 'id' | 'naam' | 'voornaam' | 'emailadres'> { }

export interface GebruikerCreateInput {
  naam: string;
  voornaam: string;
  emailadres: string;
  wachtwoord: string;
}

export interface GebruikerUpdateInput extends Pick<GebruikerCreateInput, 'naam' | 'voornaam' | 'emailadres'> { }

export interface CreateGebruikerRequest { 
  naam: string;
  voornaam: string;
  emailadres: string;
  wachtwoord: string;
}
export interface UpdateGebruikerRequest extends Pick<CreateGebruikerRequest, 'naam' | 'voornaam' | 'emailadres'> { }

export interface GetAllGebruikersResponse extends ListResponse<PublicGebruiker> { }
export interface GetGebruikerByIdResponse extends PublicGebruiker { }
export interface CreateGebruikerResponse extends GetGebruikerByIdResponse { }
export interface UpdateGebruikerResponse extends GetGebruikerByIdResponse { }

export interface LoginRequest {
  emailadres: string;
  wachtwoord: string;
}

export interface LoginResponse {
  token: string;
}

export interface GetGebruikerRequest {
  id: number | 'me';
}