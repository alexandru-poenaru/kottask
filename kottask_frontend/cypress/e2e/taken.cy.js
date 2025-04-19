describe('Taken list', () => {

  beforeEach(() => {
    cy.login('thomas.aelbrecht@example.com', 'test1234');
  });

  it('should show the taken', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/taken',
      { fixture: 'taken.json' },
    );

    cy.visit('http://localhost:5173');
    cy.get('[data-cy=taak]').should('have.length', 3);
    cy.get('[data-cy=taak_titel]').eq(0).contains('Afwas doen');
    cy.get('[data-cy=taak_prioriteit]').eq(0).contains('Niet dringend');
  });

  it('should have the delete and change button disabled for a task that is not created by the user', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/taken',
      { fixture: 'taken.json' },
    );

    cy.visit('http://localhost:5173');
    cy.get('[data-cy=taak_remove_btn]').eq(0).should('be.disabled');
    cy.get('[data-cy=taak_change_btn]').eq(0).should('be.disabled');
  });

  it('should show a loading indicator for a very slow response', () => {
    cy.intercept(
      'http://localhost:9000/api/taken',
      (req) => {
        req.on('response', (res) => {
          res.setDelay(1000);
        });
      },
    ).as('slowResponse');

    cy.visit('http://localhost:5173');
    cy.get('[data-cy=loader]').should('be.visible');
    cy.wait('@slowResponse');
    cy.get('[data-cy=loader]').should('not.exist');
  });

  it('should show all taken with the letters stof in their title', () => {
    cy.visit('http://localhost:5173');
    cy.intercept(
      'GET',
      'http://localhost:9000/api/taken',
      { fixture: 'taken.json' },
    );
    cy.get('[data-cy=taken_search_input]').type('stof');
    cy.get('[data-cy=taken_search_btn]').click();

    cy.get('[data-cy=taak]').should('have.length',1);
    cy.get('[data-cy=taak_titel]').eq(0).contains(/Stofzuigen/);
  });

  it('should show a message when no taken are found', () => {
    cy.visit('http://localhost:5173');

    cy.get('[data-cy=taken_search_input]').type('xyz');
    cy.get('[data-cy=taken_search_btn]').click();

    cy.get('[data-cy=no_taken_message]').should('exist');
  });

  it('should show an error if the API call fails', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/taken',
      {
        statusCode: 500,
        body: {
          error: 'Internal server error',
        },
      },
    );
    cy.visit('http://localhost:5173');

    cy.get('[data-cy=axios_error_message').should('exist');
  });
});