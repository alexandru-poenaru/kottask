## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL v8](https://dev.mysql.com/downloads/windows/installer/8.0.html)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Front-end

## Opstarten

- Zorg ervoor dat Corepack is ingeschakeld:

```bash
corepack enable
```

- Installeer alle afhankelijkheden met het volgende commando:

```bash
yarn install
```

- Maak een `.env` bestand aan in de root van `kottask_frontend` met de volgende inhoud.

```dotenv
VITE_API_URL=http://localhost:9000/api
```

- Start de app met `yarn dev`. Deze draait standaard op <http://localhost:5137>.

## Testen

Voer de tests uit met `yarn test` en kies `E2E testing` in het Cypress-venster. Er wordt een nieuw browservenster geopend waarin je kunt selecteren welke testsuite je wilt uitvoeren.

## Back-end

## Opstarten

- Maak een `.env` bestand aan in de root van `kottask_backend` met de volgende inhoud.
Vul aan waar nodig met jouw variabelen (DATABASE_URL).

```bash
NODE_ENV=development
DATABASE_URL=mysql://<GEBRUIKERSNAAM>:<WACHTWOORD>@localhost:3306/<DATABASE_NAAM>
```
- Schakel Corepack in: `corepack enable`
- Installeer alle afhankelijkheden: `yarn`
- Voer de migraties uit: `yarn migrate:dev`
- Start de development server: `yarn start:dev`

## Testen

- Maak een `.env.test` bestand aan in de root van `kottask_backend` met de volgende inhoud.
Vul aan waar nodig met jouw variabelen (DATABASE_URL).

```bash
NODE_ENV=testing
DATABASE_URL=mysql://<GEBRUIKERSNAAM>:<WACHTWOORD>@localhost:3306/<DATABASE_NAAM>
```

- Schakel Corepack in: `corepack enable`
- Installeer alle afhankelijkheden: `yarn`
- Voer de migraties uit: `yarn migrate:test`
- Voer de tests uit: `yarn test`
  - Dit zal een nieuwe server starten voor elke test suite die wordt uitgevoerd, je zult geen output zien omdat logging is uitgeschakeld om de output schoner te maken.
  - De gebruikerssuite zal 'lang' duren (ongeveer 6s) om te voltooien, dit is normaal omdat veel cryptografische operaties worden uitgevoerd.
- Voer de tests uit met dekking: `yarn test:coverage`
  - Dit zal een dekkingsrapport genereren in de map `__tests__/coverage`.
  - Open `__tests__/coverage/lcov-report/index.html` in je browser om het dekkingsrapport te zien.
