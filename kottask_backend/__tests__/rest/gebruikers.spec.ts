import type supertest from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';

describe('Gebruikers', () => {

  let request: supertest.Agent;
  let authHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/gebruikers';

  describe('GET /api/gebruikers', () => {

    it('should return all users', async () => {
      const response = await request.get(url).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items).toEqual([
        {
          id: 1,
          naam: 'Test',
          voornaam: 'User',
          emailadres: 'test.user@hogent.be',
        },
        {
          id: 2,
          naam: 'Test2',
          voornaam: 'User2',
          emailadres: 'test2.user2@hogent.be',
        },
      ]);
    });
  });

  describe('GET /api/gebruikers/:id', () => {

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        naam: 'Test',
        voornaam: 'User',
        emailadres: 'test.user@hogent.be',
      });
    });

    it('should 200 and return my user info when passing \'me\' as id', async () => {
      const response = await request.get(`${url}/me`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        naam: 'Test',
        voornaam: 'User',
        emailadres: 'test.user@hogent.be',
      });
    });

    it('should 403 when not own user id', async () => {
      const response = await request.get(`${url}/2`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
    });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe('POST /api/gebruikers', () => {

    afterAll(async () => {
      await prisma.gebruiker.deleteMany({
        where: {
          emailadres: 'new.user@hogent.be',
        },
      });
    });

    it('should 200 and return the registered user', async () => {
      const response = await request.post(url)
        .send({
          naam: 'New',
          voornaam: 'User',
          emailadres: 'new.user@hogent.be',
          wachtwoord: '123456789101112',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('PUT /api/gebruikers/:id', () => {

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          naam: 'Changed',
          voornaam: 'Name',
          emailadres: 'new.user@hogent.be',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        naam: 'Changed',
        voornaam: 'Name',
        emailadres: 'new.user@hogent.be',
      });
    });

    it('should 403 when not own user id', async () => {
      const response = await request.put(`${url}/2`)
        .send({
          naam: 'Changed',
          voornaam: 'Name',
          emailadres: 'new.user@hogent.be',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/gebruikers/:id', () => {

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 403 when not own gebruiker id', async () => {
      const response = await request.delete(`${url}/2`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });

  describe('GET /api/gebruikers/:id/agendablokken', () => {
    const dataToDelete = {
      agendablokken: [1, 2],
      taken: [1, 2],
    };

    const createTaken = async () => {
      await prisma.gebruiker.createMany({
        data: [
          { id: 1, naam: 'Test', voornaam: 'User', emailadres: 'test.user@hogent.be', wachtwoord: 'password' },
          { id: 2, naam: 'Test2', voornaam: 'User2', emailadres: 'test2.user2@hogent.be', wachtwoord: 'password' },
        ],
        skipDuplicates: true,
      });

      await prisma.taak.create({
        data: {
          id: 1,
          titel: 'Taak 1',
          beschrijving: 'Beschrijving voor taak 1',
          prioriteit: 'NIET_DRINGEND',
          gebruiker: 1,
          gemaaktVoor: {
            connect: { id: 2 },
          },
        },
      });

      await prisma.taak.create({
        data: {
          id: 2,
          titel: 'Taak 2',
          beschrijving: 'Beschrijving voor taak 2',
          prioriteit: 'DRINGEND',
          gebruiker: 2,
          gemaaktVoor: {
            connect: [{ id: 1 }, { id: 2 }],
          },
        },
      });
    };

    const createData = async () => {
      await createTaken();

      await prisma.agendablok.create({
        data: {
          id: 1,
          agendablokVan: 1,
          titel: 'Agendablok 1',
          datumVan: new Date('2023-10-01T09:00:00Z'),
          datumTot: new Date('2023-10-01T10:00:00Z'),
        },
      });

      await prisma.agendablok.create({
        data: {
          id: 2,
          agendablokVan: 2,
          titel: 'Agendablok 2',
          datumVan: new Date('2023-10-01T11:00:00Z'),
          datumTot: new Date('2023-10-01T12:00:00Z'),
          taakInAgendablok: 1,
        },
      });
    };

    beforeAll(async () => {
      await createData();
    });

    afterAll(async () => {
      await prisma.agendablok.deleteMany({ where: { id: { in: dataToDelete.agendablokken } } });
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should 200 and return the agendablokken of the given gebruiker', async () => {
      const response = await request.get(`${url}/2/agendablokken`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(1);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 2,
            titel: 'Agendablok 2',
            datumVan: '2023-10-01T11:00:00.000Z',
            datumTot: '2023-10-01T12:00:00.000Z',
            gebruiker: {
              id: 2,
              naam: 'Test2',
              voornaam: 'User2',
            },
            taak: {
              id: 1,
              titel: 'Taak 1',
              beschrijving: 'Beschrijving voor taak 1',
              gemaaktDoor: {
                id: 1,
                naam: 'Test',
                voornaam: 'User',
              },
            },
          },
        ]),
      );
    });

    it('should 200 and return the agendablokken of the logged in gebruiker when passing \'me\' as id', async () => {
      const response = await request.get(`${url}/me/agendablokken`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(1);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            titel: 'Agendablok 1',
            datumVan: '2023-10-01T09:00:00.000Z',
            datumTot: '2023-10-01T10:00:00.000Z',
            gebruiker: {
              id: 1,
              naam: 'Test',
              voornaam: 'User',
            },
            taak: null,
          },
        ]),
      );
    });

    it('should 400 with invalid agendablok id', async () => {
      const response = await request.get(`${url}/invalid/agendablokken`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1/agendablokken`));
  });

  describe('GET /api/gebruikers/:id/taken', () => {
    const dataToDelete = {
      taken: [1, 2],
    };

    const createTaken = async () => {
      await prisma.gebruiker.createMany({
        data: [
          { id: 1, naam: 'Test', voornaam: 'User', emailadres: 'test.user@hogent.be', wachtwoord: 'password' },
          { id: 2, naam: 'Test2', voornaam: 'User2', emailadres: 'test2.user2@hogent.be', wachtwoord: 'password' },
        ],
        skipDuplicates: true,
      });

      await prisma.taak.create({
        data: {
          id: 1,
          titel: 'Taak 1',
          beschrijving: 'Beschrijving voor taak 1',
          prioriteit: 'NIET_DRINGEND',
          gebruiker: 1,
          gemaaktVoor: {
            connect: { id: 2 },
          },
        },
      });

      await prisma.taak.create({
        data: {
          id: 2,
          titel: 'Taak 2',
          beschrijving: 'Beschrijving voor taak 2',
          prioriteit: 'DRINGEND',
          gebruiker: 2,
          gemaaktVoor: {
            connect: [{ id: 1 }, { id: 2 }],
          },
        },
      });
    };

    beforeAll(async () => {
      createTaken();
    });

    afterAll(async () => {
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should 200 and return the taken of the given gebruiker', async () => {
      const response = await request.get(`${url}/2/taken`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(1);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            titel: 'Taak 1',
            beschrijving: 'Beschrijving voor taak 1',
            prioriteit: 'NIET_DRINGEND',
            afgewerkt: false,
            gemaaktDoor: { id: 1, naam: 'Test', voornaam: 'User' },
            gemaaktVoor: [{ id: 2, naam: 'Test2', voornaam: 'User2' }],
          },
        ]),
      );
    });

    it('should 200 and return the taken of the logged in gebruiker when passing \'me\' as id', async () => {
      const response = await request.get(`${url}/me/taken`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(1);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 2,
            titel: 'Taak 2',
            beschrijving: 'Beschrijving voor taak 2',
            prioriteit: 'DRINGEND',
            afgewerkt: false,
            gemaaktDoor: { id: 2, naam: 'Test2', voornaam: 'User2' },
            gemaaktVoor: [{ id: 1, naam: 'Test', voornaam: 'User' }, { id: 2, naam: 'Test2', voornaam: 'User2' }],
          },
        ]),
      );
    });

    it('should 400 with invalid taak id', async () => {
      const response = await request.get(`${url}/invalid/agendablokken`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1/taken`));
  });

});