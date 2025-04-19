describe('Add taak', () => {

  beforeEach(() => {
    cy.login('thomas.aelbrecht@example.com', 'test1234');
  });

  it('should add an agendablok', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/taken',
      { fixture: 'taken.json' },
    );
    cy.visit('http://localhost:5173/agendablokken/add');

    cy.get('[data-cy=agendablok_titel_input]').type('Test Agendablok');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    cy.get('[data-cy=agendablok_datumVan_input]').type(`${year}-${month}-${day}T12:00`);
    cy.get('[data-cy=agendablok_datumTot_input]').type(`${year}-${month}-${day}T13:00`);
    cy.get('[data-cy=agendablok_taak_input]').select('Stofzuigen');
    cy.get('[data-cy=submit_agendablok]').click();
    cy.visit('http://localhost:5173/agendablokken');
    cy.get('.fc-event-title').contains('Test Agendablok');
  });

  it('should delete an agendablok', () => {
    cy.visit('http://localhost:5173/agendablokken');
    cy.get('.fc-event').filter(':contains("Test Agendablok")').click();
    cy.get('[data-cy=delete_agendablok_btn]').click();
    cy.get('[data-cy=confirm_delete_agendablok_btn]').click();
    cy.get('.fc-event-title').should('not.contain', 'Test Agendablok');
  });

  it('should show the error message for the empty titel field', () => {
    cy.visit('http://localhost:5173/agendablokken/add');

    cy.get('[data-cy=agendablok_datumVan_input]').type('2024-12-20T12:00');
    cy.get('[data-cy=agendablok_datumTot_input]').type('2024-12-20T13:00');
    cy.get('[data-cy=agendablok_taak_input]').select('Stofzuigen');
    cy.get('[data-cy=submit_agendablok]').click();

    cy.get('[data-cy=label_input_error]').contains('Titel is verplicht');
  });

  it('should show the error message for the empty datumVan field', () => {
    cy.visit('http://localhost:5173/agendablokken/add');

    cy.get('[data-cy=agendablok_titel_input]').type('Test Agendablok');
    cy.get('[data-cy=agendablok_datumTot_input]').type('2024-12-20T13:00');
    cy.get('[data-cy=agendablok_taak_input]').select('Stofzuigen');
    cy.get('[data-cy=submit_agendablok]').click();

    cy.get('[data-cy=label_input_error]').contains('Beginmoment is verplicht');
  });

  it('should show the error message for the empty datumTot field', () => {
    cy.visit('http://localhost:5173/agendablokken/add');

    cy.get('[data-cy=agendablok_titel_input]').type('Test Agendablok');
    cy.get('[data-cy=agendablok_datumVan_input]').type('2024-12-20T12:00');
    cy.get('[data-cy=agendablok_taak_input]').select('Stofzuigen');
    cy.get('[data-cy=submit_agendablok]').click();

    cy.get('[data-cy=label_input_error]').contains('Eindmoment is verplicht');
  });

});