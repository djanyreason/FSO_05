const { test, expect, beforeEach, describe } = require('@playwright/test');
const { doLogin, doLogout, makeBlog } = require('./testHelper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Foo Bar',
        username: 'foo',
        password: 'bar',
      },
    });
    await request.post('/api/users', {
      data: {
        name: 'Boo Far',
        username: 'boo',
        password: 'far',
      },
    });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('(b)log in to application')).toBeVisible();

    const usernameInput = await page.getByTestId('username');
    const passwordInput = await page.getByTestId('password');

    await expect(usernameInput.locator('..')).toContainText('username');
    await expect(passwordInput.locator('..')).toContainText('password');
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await doLogin(page, 'foo', 'bar');

      const notificationDiv = await page.locator('.notification');

      await expect(notificationDiv).toContainText('Foo Bar (b)logged in');
      await expect(notificationDiv).toHaveCSS('border-style', 'solid');
      await expect(notificationDiv).toHaveCSS(
        'background-color',
        'rgb(211, 211, 211)'
      );
      await expect(notificationDiv).toHaveCSS('color', 'rgb(0, 128, 0)');

      await expect(page.getByText('Foo Bar logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await doLogin(page, 'fu', 'bar');

      const notificationDiv = await page.locator('.notification');

      await expect(notificationDiv).toContainText('wrong username or password');
      await expect(notificationDiv).toHaveCSS('border-style', 'solid');
      await expect(notificationDiv).toHaveCSS(
        'background-color',
        'rgb(211, 211, 211)'
      );
      await expect(notificationDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

      await expect(page.getByText('Foo Bar logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await doLogin(page, 'foo', 'bar');
    });

    test('a new blog can be created', async ({ page }) => {
      await makeBlog(
        page,
        'React patterns',
        'Michael Chan',
        'https://reactpatterns.com/'
      );

      await expect(
        page.locator('.aBlog').filter({ hasText: 'React patterns' })
      ).toBeVisible();
    });

    describe('...and a blog has been created', () => {
      beforeEach(async ({ page }) => {
        await makeBlog(
          page,
          'React patterns',
          'Michael Chan',
          'https://reactpatterns.com/'
        );
      });

      test('the blog can be liked', async ({ page }) => {
        const firstBlog = await page.locator('.aBlog').first();

        await firstBlog.getByRole('button', { name: 'view' }).click();

        await expect(firstBlog).toContainText('likes 0');

        await firstBlog.getByRole('button', { name: 'like' }).click();

        await expect(firstBlog).toContainText('likes 1');
      });

      test('the blog can be deleted by the user who added it', async ({
        page,
      }) => {
        const firstBlog = await page.locator('.aBlog').first();

        await firstBlog.getByRole('button', { name: 'view' }).click();

        await expect(
          firstBlog.getByRole('button', { name: 'remove' })
        ).toBeVisible();

        page.on('dialog', (dialog) => dialog.accept());
        await firstBlog.getByRole('button', { name: 'remove' }).click();

        await expect(firstBlog).not.toBeVisible();
      });

      test('only the user who added the blog can see the remove button', async ({
        page,
      }) => {
        const firstBlog = await page.locator('.aBlog').first();

        await firstBlog.getByRole('button', { name: 'view' }).click();

        await expect(
          firstBlog.getByRole('button', { name: 'remove' })
        ).toBeVisible();

        await doLogout(page);
        await doLogin(page, 'boo', 'far');

        await firstBlog.getByRole('button', { name: 'view' }).click();

        await expect(
          firstBlog.getByRole('button', { name: 'remove' })
        ).not.toBeVisible();
      });
    });

    describe('... and multiple blogs have been added', () => {
      beforeEach(async ({ page }) => {
        await makeBlog(
          page,
          'React patterns',
          'Michael Chan',
          'https://reactpatterns.com/'
        );
        await makeBlog(
          page,
          'Canonical string reduction',
          'Edsger W. Dijkstra',
          'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
        );
        await makeBlog(
          page,
          'First class tests',
          'Robert C. Martin',
          'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
        );
      });
    });
  });
});
