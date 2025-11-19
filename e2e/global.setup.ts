import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  // Ensure test mode flag is present before any app code runs
  await page.addInitScript(() => {
    try {
      // Enable e2e mode and seed a default post so tests that expect
      // an existing post (home/visual tests) have deterministic data.
      localStorage.setItem('e2e_mode', '1');
      const existing = JSON.parse(localStorage.getItem('e2e_posts') || 'null');
      if (!existing) {
        const id = `e2e-seed-${Date.now()}`;
        const post = {
          id,
          title: 'E2E Seed Post',
          body: '# Seeded Test Content\\n\\nThis post is seeded for e2e tests.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: 'e2e-user'
        };
        localStorage.setItem('e2e_posts', JSON.stringify([post]));
        localStorage.setItem('e2e_last_created', id);
      }
    } catch (_e) {
      // E2E setup failed, tests will handle
    }
  });

  // Navigate to login and wait for the page to be ready
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  // Wait for the inputs to appear before interacting
  await page.waitForSelector('#email-address', { timeout: 10000 });

  // Fill in test credentials
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Password').fill('testpassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for successful login (path-only check)
  await expect(page).toHaveURL('/');
  
  // Save authentication state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});