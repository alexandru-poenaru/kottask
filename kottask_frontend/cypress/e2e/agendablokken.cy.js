describe('Agenda', () => {

  beforeEach(() => {
    cy.login('thomas.aelbrecht@example.com', 'test1234');
  });

  it('should show the agenda', () => {
    cy.visit('http://localhost:5173/agendablokken');
    cy.get('.fc').should('be.visible');
  });

  it('should show an error if the API call fails', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/agendablokken',
      {
        statusCode: 500,
        body: {
          error: 'Internal server error',
        },
      },
    );
    cy.visit('http://localhost:5173/agendablokken');

    cy.get('[data-cy=axios_error_message').should('exist');
  });
});