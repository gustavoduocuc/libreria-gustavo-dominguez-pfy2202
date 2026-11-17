import { expect, test } from '@playwright/test';

test('home shows the bookstore and its section menu', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Librería PFY2202' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Quiénes somos' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contáctanos' })).toBeVisible();
});
