const { test, expect, beforeEach, describe } = require('@playwright/test');
const { doLogin, makeBlog } = require('./testHelper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Foo Bar',
        username: 'foo',
        password: 'bar',
      },
    });

    await page.goto('http://localhost:5173');
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
  });
});
