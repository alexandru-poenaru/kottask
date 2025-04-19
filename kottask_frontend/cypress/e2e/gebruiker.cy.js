describe('User', () => {
  beforeEach(() => {
    cy.login('thomas.aelbrecht@example.com', 'test1234');
  });

  it('should display correct user details', () => {
    cy.visit('http://localhost:5173/me');

    cy.get('[data-cy=voornaam_input]').should('be.disabled').invoke('val').should('eq', 'Thomas');
    cy.get('[data-cy=naam_input]').should('be.disabled').invoke('val').should('eq', 'Aelbrecht');
    cy.get('[data-cy=emailadres_input]').should('be.disabled').invoke('val').should('eq', 'thomas.aelbrecht@example.com');
  });

  it('should edit user details', () => {
    cy.visit('http://localhost:5173/me');

    cy.get('[data-cy=edit_user_btn]').click();
    cy.get('[data-cy=voornaam_input]').should('not.be.disabled').clear().type('Thomas2');
    cy.get('[data-cy=naam_input]').should('not.be.disabled').clear().type('Aelbrecht2');
    cy.get('[data-cy=emailadres_input]').should('not.be.disabled').clear().type('thomas.aelbrecht2@example.com');
    cy.get('[data-cy=save_user_btn]').click();

    cy.visit('http://localhost:5173/me');
    cy.get('[data-cy=voornaam_input]').should('be.disabled').invoke('val').should('eq', 'Thomas2');
    cy.get('[data-cy=naam_input]').should('be.disabled').invoke('val').should('eq', 'Aelbrecht2');
    cy.get('[data-cy=emailadres_input]').should('be.disabled').invoke('val').should('eq', 'thomas.aelbrecht2@example.com');

    //veranderingen revert
    cy.get('[data-cy=edit_user_btn]').click();
    cy.get('[data-cy=voornaam_input]').should('not.be.disabled').clear().type('Thomas');
    cy.get('[data-cy=naam_input]').should('not.be.disabled').clear().type('Aelbrecht');
    cy.get('[data-cy=emailadres_input]').should('not.be.disabled').clear().type('thomas.aelbrecht@example.com');
    cy.get('[data-cy=save_user_btn]').click();
  });

  it('should show error message for empty voornaam field', () => {
    cy.visit('http://localhost:5173/me');

    cy.get('[data-cy=edit_user_btn]').click();
    cy.get('[data-cy=voornaam_input]').should('not.be.disabled').clear();
    cy.get('[data-cy=save_user_btn]').click();

    cy.get('[data-cy=label_input_error]').contains('Voornaam is verplicht');
  });

  it('should show error message for empty naam field', () => {
    cy.visit('http://localhost:5173/me');

    cy.get('[data-cy=edit_user_btn]').click();
    cy.get('[data-cy=naam_input]').should('not.be.disabled').clear();
    cy.get('[data-cy=save_user_btn]').click();

    cy.get('[data-cy=label_input_error]').contains('Naam is verplicht');
  });

  it('should show error message for empty emailadres field', () => {
    cy.visit('http://localhost:5173/me');

    cy.get('[data-cy=edit_user_btn]').click();
    cy.get('[data-cy=emailadres_input]').should('not.be.disabled').clear();
    cy.get('[data-cy=save_user_btn]').click();

    cy.get('[data-cy=label_input_error]').contains('E-mailadres is verplicht');
  });

  it('should show error message for invalid emailadres', () => {
    cy.visit('http://localhost:5173/me');

    cy.get('[data-cy=edit_user_btn]').click();
    cy.get('[data-cy=emailadres_input]').should('not.be.disabled').clear().type('invalid');
    cy.get('[data-cy=save_user_btn]').click();

    cy.get('[data-cy=label_input_error]').contains('Ongeldig e-mailadres');
  });
});