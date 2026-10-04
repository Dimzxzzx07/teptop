import {expect, test} from '@playwright/test';

test('playground boots TSX and signal-driven interactions update the DOM', async ({page}) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await expect(pageErrors).toEqual([]);
  await expect(page.getByText('JSX runtime ready')).toBeVisible();
  const sessions = page.locator('.metric').first().locator('strong');
  await expect(sessions).toContainText('12,840');
  await page.getByRole('button', {name: 'Simulate session'}).click();
  await expect(sessions).toContainText('12,841');
  await page.getByRole('button', {name: 'Settings'}).click();
  await expect(page.getByText('Runtime settings')).toBeVisible();
});

test('playground navigation and metric layout fit a mobile viewport', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.locator('.metric')).toHaveCount(4);
  const columns = await page.locator('.grid').evaluate(element => getComputedStyle(element).gridTemplateColumns);
  expect(columns.trim().split(/\s+/)).toHaveLength(2);
});
