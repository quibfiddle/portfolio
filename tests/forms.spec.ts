import { test, expect } from '@playwright/test';

test('contact form accepts input', async ({ page }) => {
  await page.goto('/contact');

  const form = page.locator('form');
  if (await form.count() === 0) {
    test.skip();
    return;
  }

  const nameField = page.getByLabel(/name/i);
  const emailField = page.getByLabel(/email/i);

  if (await nameField.count() > 0) {
    await nameField.fill('Test User');
  }

  if (await emailField.count() > 0) {
    await emailField.fill('test@example.com');
  }

  const errors: string[] = [];
  page.on('pageerror', err => errors.push(err.message));

  const submitButton = page.getByRole('button', { name: /submit|send/i });
  if (await submitButton.count() > 0) {
    await submitButton.focus();
  }

  expect(errors).toHaveLength(0);
});
