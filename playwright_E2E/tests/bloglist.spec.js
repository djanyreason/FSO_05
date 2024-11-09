const { test, expect, beforeEach, describe } = require('@playwright/test');
const { doLogin, doLogout, makeBlog } = require('./testHelper');
const exp = require('constants');

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

      test('blogs are arranged in descending order of likes', async ({
        page,
      }) => {
        const blogMC = await page
          .locator('.aBlog')
          .filter({ hasText: 'Michael Chan' });
        const blogEWD = await page
          .locator('.aBlog')
          .filter({ hasText: 'Edsger W. Dijkstra' });
        const blogRCM = await page
          .locator('.aBlog')
          .filter({ hasText: 'Robert C. Martin' });

        await blogMC.getByRole('button', { name: 'view' }).click();
        await blogEWD.getByRole('button', { name: 'view' }).click();
        await blogRCM.getByRole('button', { name: 'view' }).click();

        for (let i = 1; i <= 3; i++) {
          await blogMC.getByRole('button', { name: 'like' }).click();
          await blogMC.filter({ hasText: 'likes ' + i }).waitFor();
        }
        for (let i = 1; i <= 1; i++) {
          await blogEWD.getByRole('button', { name: 'like' }).click();
          await blogEWD.filter({ hasText: 'likes ' + i }).waitFor();
        }

        await expect(page.locator('.aBlog').nth(0)).toContainText(
          'Michael Chan'
        );
        await expect(page.locator('.aBlog').nth(1)).toContainText(
          'Edsger W. Dijkstra'
        );
        await expect(page.locator('.aBlog').nth(2)).toContainText(
          'Robert C. Martin'
        );

        for (let i = 1; i <= 2; i++) {
          await blogRCM.getByRole('button', { name: 'like' }).click();
          await blogRCM.filter({ hasText: 'likes ' + i }).waitFor();
        }

        await expect(page.locator('.aBlog').nth(0)).toContainText(
          'Michael Chan'
        );
        await expect(page.locator('.aBlog').nth(1)).toContainText(
          'Robert C. Martin'
        );
        await expect(page.locator('.aBlog').nth(2)).toContainText(
          'Edsger W. Dijkstra'
        );

        for (let i = 3; i <= 4; i++) {
          await blogRCM.getByRole('button', { name: 'like' }).click();
          await blogRCM.filter({ hasText: 'likes ' + i }).waitFor();
        }

        await expect(page.locator('.aBlog').nth(0)).toContainText(
          'Robert C. Martin'
        );
        await expect(page.locator('.aBlog').nth(1)).toContainText(
          'Michael Chan'
        );
        await expect(page.locator('.aBlog').nth(2)).toContainText(
          'Edsger W. Dijkstra'
        );
      });
    });
  });
});
