describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'Foo Bar',
      username: 'foo',
      password: 'bar',
    };
    cy.addUser({ credentials: user });
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
    beforeEach(function () {
      cy.login({ username: 'foo', password: 'bar' });
    });

    it('A blog can be created', function () {
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

    it('user can like a blog', function () {
      const blogObj = {
        title: 'a blog title',
        author: 'a blogger',
        url: 'http://blago.blog'
      };
      cy.addBlog({ blogObj: blogObj });

      cy.contains('view').click();

      cy.get('.likes').contains('likes 0');
      cy.get('.likeButton').click();

      cy.get('.likes')
        .contains('likes 1')
        .and('not.contain', 'likes 0');
    });

    describe('and a blog they created in blogList', function () {
      beforeEach(function () {
        const blogObj = {
          title: 'a blog title',
          author: 'a blogger',
          url: 'http://blago.blog'
        };
        cy.addBlog({ blogObj: blogObj });
      });

      it('user can delete blog', function() {
        cy.get('.blogList')
          .should('contain', 'a blog title')
          .and('contain', 'a blogger');

        cy.contains('view').click();

        cy.contains('remove').click();

        cy.get('.notification')
          .contains('Blog a blog title by a blogger removed')
          .and('have.css', 'color', 'rgb(0, 128, 0)');

        cy.get('.blogList')
          .should('not.contain', 'a blog title')
          .and('not.contain', 'a blogger');
      });

      it('only creator can see the remove button', function() {
        cy.get('.blogList')
          .should('contain', 'a blog title')
          .and('contain', 'a blogger');

        cy.contains('view').click();

        cy.get('.blogList')
          .get('.deleteButton');

        const newUser = {
          username: 'barf',
          password: 'food',
          name: 'Barf Food'
        };
        cy.addUser({ credentials: newUser });
        cy.login(newUser);

        cy.contains('view').click();

        cy.get('.blogList');
        cy.get('.blogList')
          .get('.deleteButton')
          .should('not.exist');
      });
    });

    describe('and several blogs are in the bloglist', function () {
      beforeEach(function () {
        const blogObj = {
          title: 'blog one',
          author: 'a blogger',
          url: 'http://blago.blog',
          likes: 2.5
        };
        cy.addBlog({ blogObj: blogObj });
        const blogObj2 = {
          title: 'blog two',
          author: 'a blogger',
          url: 'http://blago.blog',
          likes: 1
        };
        cy.addBlog({ blogObj: blogObj2 });
        const blogObj3 = {
          title: 'blog three',
          author: 'a blogger',
          url: 'http://blago.blog',
          likes: 0.75
        };
        cy.addBlog({ blogObj: blogObj3 });
      });

      it('blogs are initially ordered from most to least likes', function () {
        cy.get('.aBlog').eq(0).should('contain', 'blog one');
        cy.get('.aBlog').eq(1).should('contain', 'blog two');
        cy.get('.aBlog').eq(2).should('contain', 'blog three');
      });

      it('blogs reorder correctly when user likes a blog', function() {
        cy.get('.aBlog').eq(2).contains('view').click();
        cy.get('.aBlog').eq(2).contains('like').click();

        cy.get('.aBlog').eq(0).should('contain', 'blog one');
        cy.get('.aBlog').eq(1).should('contain', 'blog three');
        cy.get('.aBlog').eq(2).should('contain', 'blog two');

        cy.get('.aBlog').eq(1).contains('like').click();

        cy.get('.aBlog').eq(0).should('contain', 'blog three');
        cy.get('.aBlog').eq(1).should('contain', 'blog one');
        cy.get('.aBlog').eq(2).should('contain', 'blog two');
      });
    });
  });
});