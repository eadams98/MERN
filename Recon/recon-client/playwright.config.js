// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// Use 4173 by default so `npm start` on 3000 does not collide with the e2e static server.
const PORT = Number(process.env.PORT || 4173);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;

// Use CRA dev server for faster local iteration when PLAYWRIGHT_DEV_SERVER=1.
const webServerCommand = process.env.PLAYWRIGHT_DEV_SERVER
  ? `BROWSER=none PORT=${PORT} npm start`
  : `NODE_OPTIONS=--openssl-legacy-provider npm run build && npx serve -s build -l ${PORT}`;

module.exports = defineConfig({
  testDir: "./e2e",
  // Omit {platform} so one baseline works in macOS + Linux CI (fonts may still differ slightly).
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 200,
      threshold: 0.2,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer:
    process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1"
      ? undefined
      : {
          command: webServerCommand,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          stdout: "pipe",
          stderr: "pipe",
          timeout: 240 * 1000,
        },
});
