const TAAK_DATA = [
  {
    id: 1,
    titel: 'Afwas doen',
    beschrijving: 'Afwas doen',
    prioriteit: 'NIET_DRINGEND',
    gemaaktDoor: {
      id: 3,
      naam: 'Alexandru',
    },
    gemaaktVoor: [
      {
        id: 2,
        naam: 'Thomas',
      },
    ],
    afgewerkt: false,
  },
  {
    id: 2,
    titel: 'Stofzuigen',
    beschrijving: 'Stofzuigen in de kamer',
    prioriteit: 'DRINGEND',
    gemaaktDoor: {
      id: 2,
      naam: 'Thomas',
    },
    gemaaktVoor: [{
      id: 3,
      naam: 'Alexandru',
    }],
    afgewerkt: false,
  },
  {
    id: 3,
    titel: 'Verluchten',
    beschrijving: 'Verluchten',
    prioriteit: 'HEEL_DRINGEND',
    gemaaktDoor: {
      id: 1,
      naam: 'Arnaud',
    },
    gemaaktVoor: [
      {
        id: 2,
        naam: 'Thomas',
      },
      {
        id: 3,
        naam: 'Alexandru',
      }],
    afgewerkt: false,
  },
  {
    id: 4,
    titel: 'Naar de les gaan',
    beschrijving: 'Les OS',
    prioriteit: 'DRINGEND',
    gemaaktDoor: {
      id: 2,
      naam: 'Thomas',
    },
    gemaaktVoor: [
      {
        id: 1,
        naam: 'Arnaud',
      },
      {
        id: 3,
        naam: 'Alexandru',
      },
    ],
    afgewerkt: true,
  },
];

export { TAAK_DATA };