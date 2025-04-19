import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Gebruiker, GebruikerCreateInput, GebruikerUpdateInput, PublicGebruiker } from '../types/gebruiker';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT, verifyJWT } from '../core/jwt';
import handleDBError from './_handleDBError';
import jwt from 'jsonwebtoken';
import { getLogger } from '../core/logging';
import type { SessionInfo } from '../types/auth';

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { sub } = await verifyJWT(authToken);

    return {
      gebruikerId: Number(sub),
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

const makeExposedGebruiker = ({ id, naam, voornaam, emailadres }: Gebruiker)
: PublicGebruiker => ({ id, naam, voornaam, emailadres });

export const getAll = async (): Promise<PublicGebruiker[]> => {
  const gebruikers = await prisma.gebruiker.findMany();
  return gebruikers.map(makeExposedGebruiker);
};

export const getById = async (id: number): Promise<PublicGebruiker> => {
  const gebruiker = await prisma.gebruiker.findUnique({
    where: { id },
  });

  if (!gebruiker)
    throw ServiceError.notFound('Er is geen gebruiker met deze id');

  return makeExposedGebruiker(gebruiker);
};

export const register = async ({ naam, voornaam, emailadres, wachtwoord }: GebruikerCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(wachtwoord);
    const gebruiker = await prisma.gebruiker.create({
      data: { naam, voornaam, emailadres, wachtwoord: passwordHash },
    });

    if (!gebruiker) {
      throw ServiceError.internalServerError('An unexpected error occured when creating the user');
    }
    return await generateJWT(gebruiker);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, { naam, voornaam, emailadres }
: GebruikerUpdateInput): Promise<PublicGebruiker> => {
  try {
    const updatedGebruiker = await prisma.gebruiker.update({
      where: { id },
      data: { naam, voornaam, emailadres },
    });
    return makeExposedGebruiker(updatedGebruiker);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const login = async (emailadres: string, wachtwoord: string): Promise<string> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { emailadres } });
  if (!gebruiker) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(wachtwoord, gebruiker.wachtwoord);

  if (!passwordValid) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }
  return await generateJWT(gebruiker);
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.gebruiker.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};