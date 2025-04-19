import supertest from 'supertest';
import type { Server } from '../../src/createServer';
import createServer from '../../src/createServer';
import { prisma } from '../../src/data';
import { hashPassword } from '../../src/core/password';

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();

    const passwordHash = await hashPassword('12345678');
    await prisma.gebruiker.createMany({
      data: [
        {
          id: 1,
          naam: 'Test',
          voornaam: 'User',
          emailadres: 'test.user@hogent.be',
          wachtwoord: passwordHash,
        },
        {
          id: 2,
          naam: 'Test2',
          voornaam: 'User2',
          emailadres: 'test2.user2@hogent.be',
          wachtwoord: passwordHash,
        },
      ],
    });

    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    await prisma.taak.deleteMany();
    await prisma.gebruiker.deleteMany();
    await prisma.agendablok.deleteMany();

    await server.stop();
  });
}
