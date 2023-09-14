
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    cy.visit('')
  });

  it('Login form is shown', function () {
    cy.contains('log in to application');
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
    cy.get('html').should('not.contain', 'blogs');
  });
});