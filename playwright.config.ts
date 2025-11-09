import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Path to global setup file (Playwright will import it).
  testDir: 'e2e',
  timeout: 30_000,
  expect: { 
    timeout: 5000
  },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'dot' : [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    baseURL: 'http://localhost:5173',
    screenshot: 'on'
  },
  projects: [
    {
        name: 'setup',
        testMatch: /global\.setup\.ts/
      },
      {
        name: 'chromium',
        use: { 
          ...devices['Desktop Chrome'],
          storageState: 'playwright/.auth/user.json'
        },
        dependencies: ['setup']
      }
  ],
    webServer: {
      // In CI, build and serve the preview build
      // In dev, use vite dev server for HMR and faster iteration
      command: process.env.CI 
        ? 'npm run build && npx vite preview --port 5173'
        : 'npx vite --port 5173',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}'
});
