import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Taak, TaakCreateInput, TaakUpdateInput } from '../types/taak';
import handleDBError from './_handleDBError';

export const TAAK_SELECT = {
  id: true,
  titel: true,
  beschrijving: true,
  prioriteit: true,
  gemaaktDoor: {
    select: {
      id: true,
      naam: true,
      voornaam: true,
    },
  },
  gemaaktVoor: {
    select: {
      id: true,
      naam: true,
      voornaam: true,
    },
  },
  afgewerkt: true,
};

export const getAll = (): Promise<Taak[]> => {
  return prisma.taak.findMany({
    select: TAAK_SELECT,
  });
};

export const getById = async (id: number): Promise<Taak> => {
  const taak = await prisma.taak.findUnique({
    where: { id },
    select: TAAK_SELECT,
  });

  if (!taak)
    throw ServiceError.notFound('Er is geen taak met deze id');

  return taak;
};

export const create = async ({ titel, beschrijving, prioriteit, gemaaktVoor, gemaaktDoor }
: TaakCreateInput): Promise<Taak> => {
  try {
    return await prisma.taak.create({
      data: {
        gemaaktDoor: { connect: { id: gemaaktDoor } },
        titel: titel,
        beschrijving: beschrijving,
        prioriteit: prioriteit,
        gemaaktVoor: { connect: gemaaktVoor.map((id) => ({ id })) },
      },
      select: TAAK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, taak: TaakUpdateInput): Promise<Taak> => {
  try {
    return prisma.taak.update({
      where: { id },
      data: {
        titel: taak.titel,
        beschrijving: taak.beschrijving,
        prioriteit: taak.prioriteit,
        gemaaktVoor: { set: [], connect: taak.gemaaktVoor ? taak.gemaaktVoor.map((id: number) => ({ id })) : [] },
        afgewerkt: taak.afgewerkt,
      },
      select: TAAK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, gemaaktDoor: number): Promise<void> => {
  try {
    await prisma.taak.delete({
      where: { id, gemaaktDoor: { id: gemaaktDoor } },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getTakenVoorGebruikerId = async (id: number): Promise<Taak[]> => {
  try {
    return prisma.taak.findMany({
      where: { gemaaktVoor: { some: { id: Number(id) } } },
      select: TAAK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};