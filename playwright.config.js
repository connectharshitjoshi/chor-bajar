const { defineConfig, devices } = require('@playwright/test');

let baseURL = process.env.BASE_URL || 'http://localhost:3000';
if (!baseURL.endsWith('/')) {
  baseURL += '/';
}

const isLive = !!process.env.BASE_URL;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 30000,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // If running against local files, launch static server
  webServer: isLive ? undefined : {
    command: 'node scripts/serve.js',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
