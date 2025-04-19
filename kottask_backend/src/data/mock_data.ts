export const GEBRUIKERS = [
  {
    id: 1,
    naam: 'Jansen',
    voornaam: 'Pieter',
    emailadres: 'pieter.jansen@example.com',
  },
  {
    id: 2,
    naam: 'De Vries',
    voornaam: 'Annelies',
    emailadres: 'annelies.devries@example.com',
  },
  {
    id: 3,
    naam: 'Peeters',
    voornaam: 'Sophie',
    emailadres: 'sophie.peeters@example.com',
  },
];

export const TAKEN = [
  {
    id: 1,
    agendablokId: 1,
    gemaaktDoor: 1,
    beschrijving: 'Notities maken',
    belang: 'Hoog',
  },
  {
    id: 2,
    agendablokId: 2,
    gemaaktDoor: 2,
    beschrijving: 'Project presentatie voorbereiden',
    belang: 'Midden',
  },
  {
    id: 3,
    agendablokId: null,
    gemaaktDoor: 3,
    beschrijving: 'Teamvergadering voorbereiden',
    belang: 'Laag',
  },
];

export const AGENDABLOKKEN = [
  {
    id: 1,
    beschrijving: 'Ochtendvergadering',
    datum: '2024-10-22',
    uurVan: '09:00',
    uurTot: '10:30',
  },
  {
    id: 2,
    beschrijving: 'Projectupdate',
    datum: '2024-10-23',
    uurVan: '11:00',
    uurTot: '12:00',
  },
  {
    id: 3,
    beschrijving: 'Teamlunch',
    datum: '2024-10-23',
    uurVan: '12:30',
    uurTot: '13:30',
  },
];

export const TAAK_GEBRUIKERS = [
  {
    taakId: 1,
    taakVoor: 1,
  },
  {
    taakId: 2,
    taakVoor: 2,
  },
  {
    taakId: 3,
    taakVoor: 3,
  },
  {
    taakId: 2,
    taakVoor: 1,
  },
];