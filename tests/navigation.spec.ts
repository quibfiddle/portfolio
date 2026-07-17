import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});

test('all navigation links work', async ({ page }) => {
  await page.goto('/');

  const navLinks = page.locator('nav a');
  const count = await navLinks.count();

  for (let i = 0; i < count; i++) {
    const link = navLinks.nth(i);
    const href = await link.getAttribute('href');

    // Skip hidden links (e.g. mobile nav panel at desktop viewport) and downloads
    if (href && href.startsWith('/') && !href.endsWith('.pdf') && (await link.isVisible())) {
      await link.click();
      await expect(page).not.toHaveURL(/404/);
      await page.goto('/');
    }
  }
});
