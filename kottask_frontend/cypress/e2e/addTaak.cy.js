describe('Add and remove taak', () => {

  beforeEach(() => {
    cy.login('thomas.aelbrecht@example.com', 'test1234');
  });

  it('should add a taak', () => {
    cy.visit('http://localhost:5173/taken/add');

    cy.get('[data-cy=taak_titel_input]').type('Stofzuigen');
    cy.get('[data-cy=taak_beschrijving_input]').type('Stofzuigen in de living');
    cy.get('[data-cy=taak_prioriteit_input]').select('Dringend');
    cy.get('#gemaaktVoor').click();
    cy.get('.react-select__option').first().click();
    cy.get('[data-cy=submit_taak]').click();

    cy.get('[data-cy=taak_gemaakt_door]').eq(3).contains('Thomas Aelbrecht');
    cy.get('[data-cy=taak_titel]').eq(3).contains('Stofzuigen');
    cy.get('[data-cy=taak_beschrijving]').eq(3).contains('Stofzuigen in de living');
  });

  it('should remove the taak', () => {
    cy.visit('http://localhost:5173/taken/'); 
    cy.get('[data-cy=taak_remove_btn]').eq(3).click(); 
    cy.get('[data-cy=taak_confirm_delete]').click();
    cy.get('[data-cy=taak]').should('have.length', 3); 
  });

  it('should show the error message for the empty titel field', () => {
    cy.visit('http://localhost:5173/taken/add');

    cy.get('[data-cy=taak_beschrijving_input]').type('Stofzuigen in de living');
    cy.get('[data-cy=taak_prioriteit_input]').select('Dringend');
    cy.get('#gemaaktVoor').click();
    cy.get('.react-select__option').first().click();
    cy.get('[data-cy=submit_taak]').click();

    cy.get('[data-cy=label_input_error]').contains('Titel is verplicht');
  });

  it('should show the error message for the empty beschrijving field', () => {
    cy.visit('http://localhost:5173/taken/add');

    cy.get('[data-cy=taak_titel_input]').type('Stofzuigen');
    cy.get('[data-cy=taak_prioriteit_input]').select('Dringend');
    cy.get('#gemaaktVoor').click();
    cy.get('.react-select__option').first().click();
    cy.get('[data-cy=submit_taak]').click();

    cy.get('[data-cy=label_input_error]').contains('Beschrijving is verplicht');
  });

  it('should show the error message for the empty prioriteit field', () => {
    cy.visit('http://localhost:5173/taken/add');

    cy.get('[data-cy=taak_titel_input]').type('Stofzuigen');
    cy.get('[data-cy=taak_beschrijving_input]').type('Stofzuigen in de living');
    cy.get('#gemaaktVoor').click();
    cy.get('.react-select__option').first().click();
    cy.get('[data-cy=submit_taak]').click();

    cy.get('[data-cy=label_input_error]').contains('Prioriteit is verplicht');
  });

  it('should show the error message for the empty gemaaktVoor field', () => {
    cy.visit('http://localhost:5173/taken/add');

    cy.get('[data-cy=taak_titel_input]').type('Stofzuigen');
    cy.get('[data-cy=taak_beschrijving_input]').type('Stofzuigen in de living');
    cy.get('[data-cy=taak_prioriteit_input]').select('Dringend');
    cy.get('[data-cy=submit_taak]').click();

    cy.get('[data-cy=label_input_error]').contains('Gemaakt voor is verplicht');
  });

});