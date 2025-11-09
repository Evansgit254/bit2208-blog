# End-to-End Testing

This project uses Playwright for end-to-end testing. The tests are located in the `e2e/` directory.

## Test Architecture

### E2E Mode

To make tests deterministic and fast, the app has a special "e2e mode" that can be enabled by setting `localStorage.e2e_mode`. When enabled:

- The sync service uses `localStorage` instead of SQLite/Firebase for persistence
- Posts are stored in `localStorage.e2e_posts`
- The app sets `localStorage.e2e_last_created` after creating/updating posts
- The blog post editor shows a status indicator (role="status") after successful saves

This mode is automatically enabled by the global test setup (`e2e/global.setup.ts`).

### Test Dependencies

Tests depend on:
1. A running web server (vite dev or preview)
2. Authentication state (created by `global.setup.ts`)
3. The e2e mode being enabled

## Running Tests

### Local Development

```bash
# Run tests against the dev server (faster iteration)
npm run test:e2e:dev

# Run specific tests
npm run test:e2e:dev -- e2e/post.spec.ts
npm run test:e2e:dev -- -g "Blog Post Management"

# Run with UI
npm run test:e2e:dev -- --ui

# Debug mode (headed + slow + debugger)
npm run test:e2e:dev -- --debug
```

### CI Environment

```bash
# Builds the app and runs tests against the preview server
npm run test:e2e:ci
```

The CI setup:
1. Builds the app (`npm run build`)
2. Starts the preview server
3. Runs tests with retries enabled

## Test Structure

Tests follow this general pattern:

1. Global setup (`global.setup.ts`)
   - Authenticates and saves auth state
   - Sets up e2e mode
2. Individual test files
   - Use the auth state
   - Create/manipulate test data
   - Verify UI behavior
   - Clean up after themselves

## Common Patterns

### Waiting for Changes

The app has several async operations. Tests should wait appropriately:

```typescript
// Wait for navigation
await expect(page).toHaveURL('/desired/path');

// Wait for content
await expect(page.getByRole('heading')).toBeVisible();

// Wait for save completion
await expect(page.getByRole('status')).toBeVisible();

// Wait for background operations
await waitForSync(page);
```

### Test Data

Tests should create their own data and not depend on other tests:

```typescript
// Create a post directly in localStorage
await createLocalPost(page, 'Test Post Title');

// Or create through the UI
await page.goto('/new');
await page.getByPlaceholder('Post title').fill('Test Post');
await page.getByRole('button', { name: /save/i }).click();
```

### Native Dialogs

Some actions (like delete) use browser confirm dialogs. Handle them like this:

```typescript
// Set up the handler before triggering the action
page.once('dialog', dialog => dialog.accept());
await deleteButton.click();
```

## Debugging Failed Tests

1. Check the Playwright report:
   ```bash
   npx playwright show-report
   ```

2. Look for:
   - Screenshots of failures
   - Error messages
   - Test timelines
   - Console logs

3. Common issues:
   - Timing: Add appropriate waits
   - Selectors: Verify element roles/labels
   - State: Ensure test data exists
   - Storage: Check localStorage contents