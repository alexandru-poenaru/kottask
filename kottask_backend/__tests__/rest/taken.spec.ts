import type supertest from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';

const createTaken = async () => {
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

const data = {
  taken: [
    {
      id: 1,
      titel: 'Taak 1',
      beschrijving: 'Beschrijving voor taak 1',
      prioriteit: 'NIET_DRINGEND',
      afgewerkt: false,
      gemaaktDoor: { id: 1, naam: 'Test', voornaam: 'User' },
      gemaaktVoor: [{ id: 2, naam: 'Test2', voornaam: 'User2' }],
    },
    {
      id: 2,
      titel: 'Taak 2',
      beschrijving: 'Beschrijving voor taak 2',
      prioriteit: 'DRINGEND',
      afgewerkt: false,
      gemaaktDoor: { id: 2, naam: 'Test2', voornaam: 'User2' },
      gemaaktVoor: [{ id: 1, naam: 'Test', voornaam: 'User' }, { id: 2, naam: 'Test2', voornaam: 'User2' }],
    },
  ],
};

export const dataToDelete = {
  taken: [1, 2],
};

describe('Taken', () => {
  let request: supertest.Agent;
  let authHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/taken';

  describe('GET /api/taken', () => {
    beforeAll(async () => {
      await createTaken();
    });

    afterAll(async () => {
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should return all taken', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(data.taken);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/taken/:id', () => {

    beforeAll(async () => {
      await createTaken();
    });

    afterAll(async () => {
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should 200 and return the requested taak', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        titel: 'Taak 1',
        beschrijving: 'Beschrijving voor taak 1',
        prioriteit: 'NIET_DRINGEND',
        afgewerkt: false,
        gemaaktDoor: {
          id: 1,
          naam: 'Test',
          voornaam: 'User',
        },
        gemaaktVoor: [
          {
            id: 2,
            naam: 'Test2',
            voornaam: 'User2',
          },
        ],
      });
    });

    it('should 404 when requesting not existing agendablok', async () => {
      const response = await request.get(`${url}/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);

      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er is geen taak met deze id',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid taak id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1`));

  });

  describe('POST /api/taken', () => {

    const takenToDelete: number[] = [];

    afterAll(async () => {
      await prisma.taak.deleteMany({ where: { id: { in: takenToDelete } } });
    });

    it('should 201 and return the created taak', async () => {
      const response = await request.post(url)
        .send({
          titel: 'Taak 3',
          beschrijving: 'Beschrijving voor taak 3',
          prioriteit: 'DRINGEND',
          gemaaktVoor: [1, 2],
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.titel).toBe('Taak 3');
      expect(response.body.beschrijving).toBe('Beschrijving voor taak 3');
      expect(response.body.prioriteit).toBe('DRINGEND');
      expect(response.body.afgewerkt).toBe(false);
      expect(response.body.gemaaktDoor).toEqual({ id: 1, naam: 'Test', voornaam: 'User' });
      expect(response.body.gemaaktVoor).toEqual([
        { id: 1, naam: 'Test', voornaam: 'User' },
        { id: 2, naam: 'Test2', voornaam: 'User2' },
      ]);
      takenToDelete.push(response.body.id);
    });

    it('should 400 when missing titel', async () => {
      const response = await request.post(url)
        .send({
          beschrijving: 'Beschrijving voor taak 4',
          prioriteit: 'DRINGEND',
          gemaaktDoor: 1,
          gemaaktVoor: [1, 2],
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('titel');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/taken/:id', () => {

    beforeAll(async () => {
      await createTaken();
    });

    afterAll(async () => {
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should 200 and return the updated agendablok', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'Updated taak',
          beschrijving: 'Updated beschrijving',
          prioriteit: 'DRINGEND',
          afgewerkt: false,
          gemaaktVoor: [1],
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        titel: 'Updated taak',
        beschrijving: 'Updated beschrijving',
        prioriteit: 'DRINGEND',
        afgewerkt: false,
        gemaaktDoor: { id: 1, naam: 'Test', voornaam: 'User' },
        gemaaktVoor: [{ id: 1, naam: 'Test', voornaam: 'User' }],
      });
    });

    it('should 400 when missing prioriteit', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'Updated taak',
          beschrijving: 'Updated beschrijving',
          afgewerkt: false,
          gemaaktVoor: [1],
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('prioriteit');
    });

    it('should 400 when gemaaktVoor is empty', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'Updated taak',
          beschrijving: 'Updated beschrijving',
          prioriteit: 'DRINGEND',
          afgewerkt: false,
          gemaaktVoor: [],
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('gemaaktVoor');
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/taken/:id', () => {

    beforeAll(async () => {
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
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing agendablok', async () => {
      const response = await request.delete(`${url}/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No taak with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid agendablok id', async () => {
      const response = await request.delete(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });

});