import {defineConfig, devices} from '@playwright/test';
import {rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const testStore = resolve(fileURLToPath(new URL('.', import.meta.url)), '.playwright-admin-store.json');
await rm(testStore, {force: true});

export default defineConfig({
  testDir: './test/browser',
  reporter: 'list',
  use: {baseURL: 'http://127.0.0.1:4175', trace: 'retain-on-failure'},
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  webServer: {
    command: 'node server/index.js',
    url: 'http://127.0.0.1:4175/api/health',
    env: {PORT: '4175', NODE_ENV: 'test', DASH_ADMIN_USER: 'admin', DASH_ADMIN_PASSWORD: 'teptop-admin', DASH_ADMIN_DATA_FILE: testStore},
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
