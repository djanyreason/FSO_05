const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('(b)log in to application')).toBeVisible();

    const usernameInput = await page.getByTestId('username');
    const passwordInput = await page.getByTestId('password');

    await expect(usernameInput.getByText('username')).toBeVisible();
    await expect(usernameInput.getByRole('textbox')).toBeVisible();
    await expect(passwordInput.getByText('password')).toBeVisible();
    await expect(passwordInput.getByRole('textbox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });
});
