describe('Blog app', function ()
{
  beforeEach(function ()
  {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Root User',
      username: 'root',
      password: 'secret'
    };
    cy.request('POST', 'http://localhost:3000/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function ()
  {
    cy.get('form').contains('username').get('#loginusername');
    cy.get('form').contains('password').get('#loginpassword');
  });

  describe('Login', function ()
  {
    it('succeeds with correct credentials', function ()
    {
      cy.get('#loginusername').type('root');
      cy.get('#loginpassword').type('secret');
      cy.get('#loginButton').click();
      cy.contains('Root User logged in');
    });

    it('fails with wrong credentials', function ()
    {
      cy.get('#loginusername').type('notroot');
      cy.get('#loginpassword').type('explicit');
      cy.get('#loginButton').click();
      cy.contains('invalid username or password').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function ()
  {
    beforeEach(function ()
    {
      cy.login({ username: 'root', password: 'secret' });
      // log in user here
    });

    it('A blog can be created', function ()
    {
      cy.contains('create new blog').click();
      cy.get('#ttitle').type('React patterns');
      cy.get('#tauthor').type('Michael Chan');
      cy.get('#turl').type('https://reactpatterns.com/');
      cy.get('form').contains('create').click();
      // cy.get('#submitNewBlog').click();
      cy.contains('React patterns Michael Chan');
    });
  });
});
