import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

/**
 * End-to-end tests against the production build. Uses the Chrome installed on the machine
 * (`channel: "chrome"`), so no browser download is needed. Pyodide and NumPy load from the
 * CDN, as for a learner, so the tests need network access.
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  expect: { timeout: 30_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
  webServer: {
    command: `bun run build && bun run start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
