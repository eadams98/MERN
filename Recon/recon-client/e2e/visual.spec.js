const { test, expect } = require("@playwright/test");

/**
 * Visual regression: PNG baselines live next to this file under
 * visual.spec.js-snapshots/chromium/*.png — commit them so PRs show image diffs.
 *
 * Optional dashboard shot: set E2E_USERNAME, E2E_PASSWORD; E2E_ROLE=contractor|trainee|school
 */

const ROLE_TAB = {
  contractor: "Contractor",
  trainee: "Trainee",
  school: "School",
};

test.describe("Visual snapshots", () => {
  test("login page", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('input[name="name"]', { state: "visible" });
    await expect(page).toHaveScreenshot("login-full.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("home dashboard (requires E2E_* env)", async ({ page }) => {
    const user = process.env.E2E_USERNAME;
    const pass = process.env.E2E_PASSWORD;
    if (!user || !pass) {
      test.skip(true, "Set E2E_USERNAME and E2E_PASSWORD for authenticated screenshots.");
    }
    const roleKey = (process.env.E2E_ROLE || "contractor").toLowerCase();
    const tab = ROLE_TAB[roleKey] || ROLE_TAB.contractor;

    await page.goto("/");
    await page.locator('input[name="name"]').fill(user);
    await page.locator('input[name="password"]').fill(pass);
    await page.getByText(tab, { exact: true }).click();
    await page.getByRole("button", { name: /login/i }).click();
    await page.waitForURL(/\/home/, { timeout: 120000 });
    await page.getByRole("heading", { name: /^home$/i }).waitFor({ state: "visible", timeout: 60000 });
    await expect(page).toHaveScreenshot("home-dashboard.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
