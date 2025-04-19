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

export const createData = async () => {
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

const data = {
  taken: [
    {
      id: 1,
      titel: 'Taak 1',
      beschrijving: 'Beschrijving voor taak 1',
      prioriteit: 'NIET_DRINGEND',
      gemaaktDoor: 1,
      gemaaktVoor: [2],
    },
    {
      id: 2,
      titel: 'Taak 2',
      beschrijving: 'Beschrijving voor taak 2',
      prioriteit: 'DRINGEND',
      gemaaktDoor: 2,
      gemaaktVoor: [1, 2],
    },
  ],
  agendablokken: [
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
  ],
};

export const dataToDelete = {
  taken: [1, 2],
  agendablokken: [1, 2],
};

describe('Agendablokken', () => {
  let request: supertest.Agent;
  let authHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/agendablokken';

  describe('GET /api/agendablokken', () => {
    beforeAll(async () => {
      await createData();
    });

    afterAll(async () => {
      await prisma.agendablok.deleteMany({ where: { id: { in: dataToDelete.agendablokken } } });
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should return all agendablokken', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(data.agendablokken);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/agendablokken/:id', () => {

    beforeAll(async () => {
      await createData();
    });

    afterAll(async () => {
      await prisma.agendablok.deleteMany({ where: { id: { in: dataToDelete.agendablokken } } });
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should 200 and return the requested agendablok', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
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
      });
    });

    it('should 404 when requesting not existing agendablok', async () => {
      const response = await request.get(`${url}/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);

      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er is geen agendablok met deze id',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid agendablok id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe('POST /api/agendablokken', () => {

    const agendablokkenToDelete: number[] = [];

    afterAll(async () => {
      await prisma.agendablok.deleteMany({ where: { id: { in: agendablokkenToDelete } } });
    });

    it('should 201 and return the created agendablok', async () => {
      const response = await request.post(url)
        .send({
          titel: 'Agendablok 3',
          datumVan: '2023-10-01T09:00:00.000Z',
          datumTot: '2023-10-01T10:00:00.000Z',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.titel).toBe('Agendablok 3');
      expect(response.body.datumVan).toBe('2023-10-01T09:00:00.000Z');
      expect(response.body.datumTot).toBe('2023-10-01T10:00:00.000Z');
      expect(response.body.gebruiker).toEqual({
        id: 1,
        naam: 'Test',
        voornaam: 'User',
      });
      expect(response.body.taak).toBeNull();

      agendablokkenToDelete.push(response.body.id);
    });

    it('should 400 when missing titel', async () => {
      const response = await request.post(url)
        .send({
          datumVan: '2023-10-01T09:00:00.000Z',
          datumTot: '2023-10-01T10:00:00.000Z',
          taak: null,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('titel');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/agendablokken/:id', () => {

    beforeAll(async () => {
      await createData();
    });

    afterAll(async () => {
      await prisma.agendablok.deleteMany({ where: { id: { in: dataToDelete.agendablokken } } });
      await prisma.taak.deleteMany({ where: { id: { in: dataToDelete.taken } } });
    });

    it('should 200 and return the updated agendablok', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'Angepaste agendablok',
          datumVan: '2023-10-01T09:00:00.000Z',
          datumTot: '2023-10-01T10:00:00.000Z',
          taak: 1,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        titel: 'Angepaste agendablok',
        datumVan: '2023-10-01T09:00:00.000Z',
        datumTot: '2023-10-01T10:00:00.000Z',
        gebruiker: {
          id: 1,
          naam: 'Test',
          voornaam: 'User',
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
      });
    });

    it('should 400 when missing titel', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          datumVan: '2023-10-01T09:00:00.000Z',
          datumTot: '2023-10-01T10:00:00.000Z',
          taak: 1,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('titel');
    });

    it('should 400 when missing datumVan', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'Angepaste agendablok',
          datumTot: '2023-10-01T10:00:00.000Z',
          taak: 1,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('datumVan');
    });

    it('should 400 when missing datumTot', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'Angepaste agendablok',
          datumVan: '2023-10-01T09:00:00.000Z',
          taak: 1,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('datumTot');
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/agendablokken/:id', () => {

    beforeAll(async () => {
      await prisma.agendablok.create({
        data: {
          id: 1,
          agendablokVan: 1,
          titel: 'Agendablok 1',
          datumVan: new Date('2023-10-01T09:00:00Z'),
          datumTot: new Date('2023-10-01T10:00:00Z'),
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
        message: 'No agendablok with this id exists',
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