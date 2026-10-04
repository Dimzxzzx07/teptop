import {expect, test} from '@playwright/test';

async function signIn(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  expect(errors).toEqual([]);
  await expect(page.getByLabel('Username')).toBeVisible();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('teptop-admin');
  await page.getByRole('button', {name: 'Sign in'}).click();
  await expect(page.getByRole('heading', {name: 'Good morning, admin'})).toBeVisible();
}

test('administrator can sign in, create/edit/delete a product', async ({page}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await signIn(page);
  await expect(page.locator('.metric').first()).toContainText('5');
  await page.locator('.sidebar .nav-link').filter({hasText: 'Products'}).click();
  await expect(page.getByRole('heading', {name: 'Products'})).toBeVisible();
  await page.getByRole('button', {name: 'New product'}).click();
  const createDialog = page.getByRole('dialog');
  await createDialog.getByLabel('Name').fill('Trail Cup');
  await createDialog.getByLabel('SKU').fill('TRL-CUP-01');
  await createDialog.getByLabel('Category').fill('Drinkware');
  await createDialog.getByLabel('Price').fill('24');
  await createDialog.getByLabel('Stock').fill('18');
  await createDialog.getByLabel('Status').selectOption('published');
  await createDialog.getByRole('button', {name: 'Create product'}).click();
  const row = page.getByRole('row').filter({hasText: 'Trail Cup'});
  await expect(row).toBeVisible();
  await row.getByRole('button', {name: 'Edit'}).click();
  const editDialog = page.getByRole('dialog');
  await editDialog.getByLabel('Price').fill('29');
  await editDialog.getByRole('button', {name: 'Save changes'}).click();
  await expect(page.getByRole('row').filter({hasText: 'Trail Cup'})).toContainText('$29');
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('row').filter({hasText: 'Trail Cup'}).getByRole('button', {name: 'Delete'}).click();
  await expect(page.getByRole('row').filter({hasText: 'Trail Cup'})).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('mobile navigation opens and resource tables stay usable', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await signIn(page);
  await page.getByRole('button', {name: 'Open navigation'}).click();
  await page.locator('.sidebar .nav-link').filter({hasText: 'Customers'}).click();
  await expect(page.getByRole('heading', {name: 'Customers'})).toBeVisible();
  await expect(page.locator('.data-table')).toBeVisible();
});
