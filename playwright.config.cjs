const { devices } = require('@playwright/test');
require('dotenv').config();

const config = {
  testDir: 'e2e',
  timeout: 30_000,
  expect: { 
    timeout: 5000,
    toHaveScreenshot: { maxDiffPixels: 100 }
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    process.env.CI ? ['dot'] : ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    baseURL: process.env.CI ? 'http://localhost:5000' : 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        screenshot: { mode: 'on' }
      },
      dependencies: ['setup']
    }
  ],
  webServer: {
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    url: process.env.CI ? 'http://localhost:5000' : 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}'
};

module.exports = config;