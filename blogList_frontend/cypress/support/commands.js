Cypress.Commands.add('login', ({ username, password }) => {
  cy.request({
    method: 'POST', 
    url: `${Cypress.env('BACKEND')}/login`, 
    body: { username: username, password: password }
  }).then(({ body }) => {
    localStorage.setItem('loggedBloglistUser', JSON.stringify(body))
    cy.visit('')
  });
});
