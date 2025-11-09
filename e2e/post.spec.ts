import { test, expect, type Page } from '@playwright/test';

// Increase timeout since we're dealing with Firebase
test.setTimeout(60000);

test.describe('Blog Post Management', () => {
  test.beforeEach(async ({ page }) => {
    // Enable E2E mode in the app so syncService uses a simple localStorage-backed store
    await page.goto('/');
    await page.evaluate(() => {
      // Keep existing e2e_posts so tests can operate on created data across steps
      localStorage.setItem('e2e_mode', '1');
    });
    await page.goto('/login');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('testpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/');
    await page.waitForLoadState('networkidle');
  });

  // Helper function to wait for sync completion
  async function waitForSync(page: Page) {
    // Wait for SQLite and Firebase operations
    await Promise.all([
      page.waitForTimeout(5000), // Give SQLite time
      page.waitForLoadState('networkidle'), // Wait for Firebase operations
      page.waitForLoadState('domcontentloaded') // Wait for page updates
    ]);

    // Also wait for any sync-related loading spinners to disappear
    await page.waitForSelector('[role="progressbar"]', { 
      state: 'hidden',
      timeout: 10000
    }).catch(() => {
      // Ignore if no spinner was found
    });

    // Check if there are any error messages
    const errors = await page.getByText(/error|fail/i).all();
    for (const error of errors) {
      if (await error.isVisible()) {
        throw new Error(`Sync error: ${await error.textContent()}`);
      }
    }
  }

  // Helper: create a post directly in localStorage for the current test context
  async function createLocalPost(page: Page, title: string) {
    return await page.evaluate((t) => {
      const id = `e2e-${Date.now()}`;
      const uniqueTitle = `${t} ${Date.now()}`;
      const post = {
        id,
        title: uniqueTitle,
        body: '# Test Content\n\nThis is a test blog post.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: 'e2e-test'
      };
      const existing = JSON.parse(localStorage.getItem('e2e_posts') || '[]');
      existing.unshift(post);
      localStorage.setItem('e2e_posts', JSON.stringify(existing));
      localStorage.setItem('e2e_last_created', id);
      // Mirror into blog_database_json so sqlite fallback can observe it if needed
      try { localStorage.setItem('blog_database_json', JSON.stringify(existing)); } catch (e) {}
      // Dispatch an event the app might listen for
      window.dispatchEvent(new CustomEvent('e2e:post-created', { detail: post }));
      return { id, title: uniqueTitle };
    }, title);
  }

  test('can create a new blog post', async ({ page }) => {
    // Navigate to new post
    const newPostLink = page.getByRole('link', { name: /new post/i });
    await newPostLink.click();

    // Wait for navigation to complete
    await expect(page).toHaveURL(/.*\/new/);
    await waitForSync(page);

    // Fill in details
    const titleInput = page.getByPlaceholder(/post title/i);
    const contentInput = page.getByPlaceholder(/write your post in markdown/i);

    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await contentInput.waitFor({ state: 'visible', timeout: 10000 });

    await titleInput.fill('Test Blog Post');
    await contentInput.fill('# Test Content\n\nThis is a test blog post.');

    // Get save button and click
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await Promise.all([
      saveButton.click(),
      // wait for the app's save success indicator (role=status) or the e2e event
  page.waitForSelector('[role="status"]', { state: 'visible', timeout: 15000 }).catch(() => null),
  page.waitForFunction(() => !!localStorage.getItem('e2e_last_created'), null, { timeout: 15000 }).catch(() => null)
    ]);

    // Wait for background sync and stable network state
    await page.waitForLoadState('networkidle');
    await waitForSync(page);
  // Debug: inspect localStorage to ensure the DB was saved
  const lsKeys = await page.evaluate(() => Object.keys(localStorage));
  console.log('localStorage keys after save:', lsKeys);
  const dbLen = await page.evaluate(() => localStorage.getItem('blog_database')?.length || 0);
  console.log('blog_database length:', dbLen);

  // Wait for potential error messages
  const error = page.getByText(/error|fail/i);
    const hasError = await error.isVisible().catch(() => false);
    if (hasError) {
      throw new Error(`Save failed: ${await error.textContent()}`);
    }
    await expect(page.getByText(/error|fail/i))
      .not.toBeVisible({ timeout: 5000 });

    await waitForSync(page);

    // Navigate home and verify
    await page.goto('/');
    await waitForSync(page);

      // Debug: Log the titles we find
      const titles = page.getByRole('heading');
      console.log('Found titles:', await titles.allTextContents());

      // Look for the new post (pick the first match to avoid strict-mode duplicate errors)
      await expect(page.getByRole('heading', { name: 'Test Blog Post' }).first())
        .toBeVisible({ timeout: 30000 });
  });

  test('can edit an existing post', async ({ page }) => {
  // Ensure this test has a post in its context
  const created = await createLocalPost(page, 'Test Blog Post');
    // Navigate to home and wait for sync
    await page.goto('/');
    await waitForSync(page);

    // Find and click the post with increased timeout
    await expect(async () => {
  const postTitle = page.getByRole('heading', { name: created.title }).first();
      const isVisible = await postTitle.isVisible();
      if (!isVisible) {
        throw new Error('Cannot find post to edit');
      }
      await postTitle.click();
    }).toPass({ timeout: 30000 });

    // Wait for post page to load
    await waitForSync(page);

    // Click edit (it's a link on the post view)
  // Find the edit link inside the current post view (avoid ambiguous global links)
  const editButton = page.getByRole('link', { name: /edit/i }).first();
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();
    await waitForSync(page);

    // Modify the content
    const titleInput = page.getByPlaceholder(/post title/i);
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill('Updated Test Blog Post');

    const contentInput = page.getByPlaceholder(/write your post in markdown/i);
    await expect(contentInput).toBeVisible({ timeout: 10000 });
    await contentInput.fill('# Updated Content\n\nThis post has been updated.');

    // Save changes and verify; wait for the save status or e2e event
    const saveButton = page.getByRole('button', { name: /save/i });
    await Promise.all([
      saveButton.click(),
  page.waitForSelector('[role="status"]', { state: 'visible', timeout: 15000 }).catch(() => null),
  page.waitForFunction(() => !!localStorage.getItem('e2e_last_created'), null, { timeout: 15000 }).catch(() => null)
    ]);

    // Ensure no visible error
    await expect(page.getByText(/error|fail/i)).not.toBeVisible({ timeout: 5000 });

    await waitForSync(page);

    // Navigate to home and verify update
    await page.goto('/');
    await waitForSync(page);

    // Verify updated post appears
    await expect(page.getByRole('heading', { name: 'Updated Test Blog Post' }))
      .toBeVisible({ timeout: 30000 });
  });

  test('can delete a post', async ({ page }) => {
    // Ensure this test has a post in its context
  const created = await createLocalPost(page, 'Updated Test Blog Post');
    // Navigate to home and wait for sync
    await page.goto('/');
    await waitForSync(page);

    // Find and click the post
    await expect(async () => {
  const postTitle = page.getByRole('heading', { name: created.title }).first();
      const isVisible = await postTitle.isVisible();
      if (!isVisible) {
        throw new Error('Cannot find post to delete');
      }
      await postTitle.click();
    }).toPass({ timeout: 30000 });

    await waitForSync(page);

    // Navigate to edit page to access delete control
  const editLink = page.getByRole('link', { name: /edit/i }).first();
  await expect(editLink).toBeVisible({ timeout: 10000 });
  await editLink.click();
    await waitForSync(page);

    // Click delete and accept the browser confirm dialog
    const deleteButton = page.getByRole('button', { name: /delete/i });
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    // Some confirmation flows are handled by the browser's native dialog — set up a one-time listener
    page.once('dialog', (d) => d.accept());
    // Trigger the click via evaluate to avoid flaky click timeouts in headless mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const del = buttons.find(b => (b.textContent || '').toLowerCase().includes('delete'));
      (del as HTMLButtonElement | undefined)?.click();
    });

    // Wait for deletion and sync
    await waitForSync(page);

    // Verify we're back on home page
    await expect(page).toHaveURL('/');
    await waitForSync(page);

    // Verify post is gone
    await expect(page.getByRole('heading', { name: 'Updated Test Blog Post' }))
      .not.toBeVisible({ timeout: 30000 });
  });
});