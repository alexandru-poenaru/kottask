describe('General', () => {
  it('draait de applicatie', () => {
    cy.visit('http://localhost:5173');
    cy.get('h1').should('exist');
  });

  it('should login and logout', () => {
    cy.login('thomas.aelbrecht@example.com', 'test1234');
    cy.logout();
  });
});