
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'Foo Bar',
      username: 'foo',
      password: 'bar',
    };
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user);
    cy.visit('');
  });

  it('Login form is shown', function () {
    cy.contains('(b)log in to application');
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
    cy.get('html').should('not.contain', 'blogs');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('foo');
      cy.get('#password').type('bar');
      cy.get('#login-button').click();
      
      cy.get('.notification')
        .contains('Foo Bar (b)logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)');
      cy.contains('blogs');
      cy.get('html').should('not.contain','(b)log in to application')
    });

    it('fails with incorrect credentials', function () {
      cy.get('#username').type('foo');
      cy.get('#password').type('bard');
      cy.get('#login-button').click();
      
      cy.get('.notification')
        .contains('wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
      cy.contains('(b)log in to application');
      cy.get('html').should('not.contain','blogs')
    });
  });

  describe('When logged in', function () {
    beforeEach(function() {
      cy.login({ username: 'foo', password: 'bar' });
    });

    it('A blog can be created', function() {
      cy.contains('new blog').click();

      cy.get('#blogTitle').type('a blog title');
      cy.get('#author').type('a blogger');
      cy.get('#url').type('http://blago.blog');
      cy.get('#blogAddButton').click();

      cy.get('.notification')
        .contains('a new blog a blog title by a blogger added')
        .and('have.css', 'color', 'rgb(0, 128, 0)');
      
      cy.get('.blogList')
        .should('contain', 'a blog title')
        .and('contain', 'a blogger');
    });
  });
});