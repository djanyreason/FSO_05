const doLogin = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const doLogout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click();
};

const makeBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click();
  await page.getByTestId('title').fill(title);
  await page.getByTestId('author').fill(author);
  await page.getByTestId('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page.locator('.aBlog').filter({ hasText: title }).waitFor();
};

export { doLogin, doLogout, makeBlog };
