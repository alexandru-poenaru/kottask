import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../core/password';

const prisma = new PrismaClient();

async function main() {
  // Seed gebruikers
  // ==========
  const passwordHash = await hashPassword('test1234');
  await prisma.gebruiker.createMany({
    data: [
      {
        id: 1,
        naam: 'Aelbrecht',
        voornaam: 'Thomas',
        emailadres: 'thomas.aelbrecht@example.com',
        wachtwoord: passwordHash,
      },
      {
        id: 2,
        naam: 'Poenaru',
        voornaam: 'Alexandru',
        emailadres: 'alexandru.poenaru@example.com',
        wachtwoord: passwordHash,
      },
      {
        id: 3,
        naam: 'Samyn',
        voornaam: 'Karine',
        emailadres: 'karine.samyn@example.com',
        wachtwoord: passwordHash,
      },
    ],
  });

  // Seed taken --> 3 keer want er is geen support voor nesting in createMany
  // ===========
  await prisma.taak.create({
    data: {
      titel: 'Afwas doen',
      beschrijving: 'Afwas doen',
      prioriteit: 'NIET_DRINGEND',
      gemaaktDoor: { connect: { id: 3 } },
      gemaaktVoor: {
        connect: { id: 1 },
      },
    },
  });

  await prisma.taak.create({
    data: {
      titel: 'Stofzuigen',
      beschrijving: 'Stofzuigen in de keuken, goed in de hoekjes',
      prioriteit: 'HEEL_DRINGEND',
      gemaaktDoor: { connect: { id: 2 } },
      gemaaktVoor: {
        connect: [{ id: 1 }, { id: 3 }],
      },
    },
  });

  await prisma.taak.create({
    data: {
      titel: 'Verluchten',
      beschrijving: 'Verlucht nog eens je kamer, er komt een vreemde geur uit jouw kamer...',
      prioriteit: 'DRINGEND',
      gemaaktDoor: { connect: { id: 1 } },
      gemaaktVoor: {
        connect: { id: 2 },
      },
    },
  });

  // Seed agendablokken --> Opnieuw geen support voor nesting in createMany
  // =================

  // User Thomas
  // ===========
  await prisma.agendablok.create({
    data: {
      gebruiker: { connect: { id: 1 } },
      titel: 'Taak uitvoeren',
      datumVan: new Date(2024, 11, 16, 8, 15),
      datumTot: new Date(2024, 11, 16, 10, 15),
      taak: { connect: { id: 1 } },
    },
  });

  await prisma.agendablok.create({
    data: {
      gebruiker: { connect: { id: 1 } },
      titel: 'Les CCSA',
      datumVan: new Date(2024, 11, 17, 10, 30),
      datumTot: new Date(2024, 11, 17, 12, 30),
    },
  });

  await prisma.agendablok.create({
    data: {
      gebruiker: { connect: { id: 1 } },
      titel: 'Les Costing',
      datumVan: new Date(2024, 11, 18, 13, 30),
      datumTot: new Date(2024, 11, 18, 15, 30),
    },
  });

  // User Alexandru
  // ===========
  await prisma.agendablok.create({
    data: {
      gebruiker: { connect: { id: 2 } },
      titel: 'Stofzuigen',
      datumVan: new Date(2024, 11, 19, 10, 30),
      datumTot: new Date(2024, 11, 19, 12, 30),
    },
  });

  // User Karine
  // ===========
  await prisma.agendablok.create({
    data: {
      gebruiker: { connect: { id: 3 } },
      titel: 'Korte pauze',
      datumVan: new Date(2024, 11, 20, 11, 30),
      datumTot: new Date(2024, 11, 20, 12, 30),
    },
  });

  await prisma.agendablok.create({
    data: {
      gebruiker: { connect: { id: 3 } },
      titel: 'Taak uitvoeren',
      datumVan: new Date(2024, 11, 16, 15, 45),
      datumTot: new Date(2024, 11, 16, 17, 45),
      taak: { connect: { id: 3 } },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
