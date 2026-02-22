// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '*.spec.js',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },
  webServer: {
    command: 'npx serve .. -l 3000 --no-clipboard',
    port: 3000,
    reuseExistingServer: true,
    timeout: 10000,
  },
});
