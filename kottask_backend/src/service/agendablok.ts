import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Agendablok, AgendablokCreateInput, AgendablokUpdateInput } from '../types/agendablok';
import handleDBError from './_handleDBError';

export const AGENDABLOK_SELECT = {
  id: true,
  gebruiker: {
    select: {
      id: true,
      naam: true,
      voornaam: true,
    },
  },
  titel: true,
  datumVan: true,
  datumTot: true,
  taak: {
    select: {
      id: true,
      titel: true,
      beschrijving: true,
      gemaaktDoor: {
        select: {
          id: true,
          naam: true,
          voornaam: true,
        },
      },
    },
  },
};

export const getAll = async (): Promise<Agendablok[]> => {
  return prisma.agendablok.findMany({
    select: AGENDABLOK_SELECT,
  });
};

export const getById = async (id: number): Promise<Agendablok> => {
  const agendablok = await prisma.agendablok.findUnique({
    where: { id },
    select: AGENDABLOK_SELECT,
  });

  if (!agendablok)
    throw ServiceError.notFound('Er is geen agendablok met deze id');

  return agendablok;
};

export const create = async ({ gebruiker, titel, datumVan, datumTot, taak }
: AgendablokCreateInput): Promise<Agendablok> => {
  try {
    return await prisma.agendablok.create({
      data: {
        agendablokVan: gebruiker,
        titel,
        datumVan,
        datumTot,
        taakInAgendablok: taak,
      },
      select: AGENDABLOK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, agendablok: AgendablokUpdateInput): Promise<Agendablok> => {
  try {
    return prisma.agendablok.update({
      where: { id },
      data: {
        titel: agendablok.titel,
        datumVan: agendablok.datumVan,
        datumTot: agendablok.datumTot,
        taakInAgendablok: agendablok.taak ? agendablok.taak : null,
      },
      select: AGENDABLOK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, gebruikerId: number): Promise<void> => {
  try {
    await prisma.agendablok.delete({
      where: { id, gebruiker: { id: gebruikerId } },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getAgendablokkenByGebruikerId = async (id: number): Promise<Agendablok[]> => {
  try {
    return prisma.agendablok.findMany({
      where: { gebruiker: { id: Number(id) } },
      select: AGENDABLOK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};