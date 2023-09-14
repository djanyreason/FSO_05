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

Cypress.Commands.add('addBlog', ({ blogObj }) => {
  const auth = `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistUser')).token}`
  cy.request({
    method: 'POST', 
    url: `${Cypress.env('BACKEND')}/blogs`, 
    body: blogObj,
    headers: { Authorization: auth }
  }).then(({ body }) => {
    cy.visit('')
  });
});

Cypress.Commands.add('addUser', ({ credentials }) =>{
  cy.request({
    method: 'POST',
    url: `${Cypress.env('BACKEND')}/users/`,
    body: credentials
  });
});