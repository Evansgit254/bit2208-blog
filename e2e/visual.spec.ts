import { test, expect } from '@playwright/test';

// Type for document with fonts API
type DocumentWithFonts = Document & { fonts?: { ready: Promise<void> } };

test.describe('Visual Regression Tests', () => {
  test('home page layout', async ({ page }) => {
    // Ensure deterministic rendering: set e2e mode and wait for fonts/network
    await page.addInitScript(() => {
      try { 
        localStorage.setItem('e2e_mode', '1'); 
      } catch (_e) {
        // localStorage not available
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => (document as DocumentWithFonts).fonts?.ready);
    // Small stabilization pause for layout
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('home-page.png', {
      mask: [
        page.getByTestId('search-results'), // Mask dynamic content
        page.getByTestId('post-date'), // Mask dynamic timestamps
        page.getByTestId('site-title')
      ],
      timeout: 10000,
      // Allow a tiny amount of pixel difference due to renderer variations
      maxDiffPixelRatio: 0.02
    });
  });

  test('login page layout', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('create post page layout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('testpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Navigate to create post
    await page.getByRole('link', { name: /new post/i }).click();
    
    // Take screenshot of empty form after stabilizing
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => (document as DocumentWithFonts).fonts?.ready);
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('create-post-page.png', {
      mask: [page.locator('.markdown-editor')], // Mask editor as it may have different cursor positions
      timeout: 10000,
      maxDiffPixelRatio: 0.03
    });
  });

  test('blog post view layout', async ({ page }) => {
    await page.goto('/post/test-post');
    await expect(page).toHaveScreenshot('post-view-page.png', {
      mask: [
        page.getByTestId('post-date'), // Mask dynamic date
        page.getByTestId('author-info') // Mask author details
      ]
    });
  });

  test('responsive layouts', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1280, height: 720 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }   // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => (document as DocumentWithFonts).fonts?.ready);
      await page.waitForTimeout(200);
      const maxDiff = viewport.width <= 375 ? 0.06 : 0.02;
      await expect(page).toHaveScreenshot(`home-page-${viewport.width}x${viewport.height}.png`, {
        mask: [
          page.getByTestId('search-results'),
          page.getByTestId('post-date'),
          page.getByTestId('site-title')
        ],
        timeout: 10000,
        maxDiffPixelRatio: maxDiff
      });
      
      // Login page
      await page.goto('/login');
      await expect(page).toHaveScreenshot(`login-page-${viewport.width}x${viewport.height}.png`);
    }
  });
});
