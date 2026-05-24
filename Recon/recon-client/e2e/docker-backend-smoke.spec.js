/**
 * Manual smoke test against Docker backend (localhost:4000 / 4001).
 * Run: PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test e2e/docker-backend-smoke.spec.js --headed
 */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "smoke-results");
const CREDS = {
  contractor: { user: "contractor.1@yahoo.com", pass: "password", tab: "Contractor" },
  trainee: { user: "trainee.1@yahoo.com", pass: "password", tab: "Trainee" },
  school: { user: "school.1@yahoo.com", pass: "password", tab: "School" },
};

const log = [];
function record(step, status, detail = "") {
  log.push({ step, status, detail });
  // eslint-disable-next-line no-console
  console.log(`[SMOKE] ${status.toUpperCase()} — ${step}${detail ? `: ${detail}` : ""}`);
}

async function login(page, roleKey) {
  const c = CREDS[roleKey];
  await page.goto("/");
  await page.locator('input[name="name"]').fill(c.user);
  await page.locator('input[name="password"]').fill(c.pass);
  await page.getByRole("tab", { name: c.tab }).click();
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForURL(/\/home/, { timeout: 90000 });
  await page.getByRole("heading", { name: /^home$/i }).waitFor({ state: "visible", timeout: 30000 });
}

test.describe("Docker backend smoke (document only)", () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT, { recursive: true });
  });

  test("full smoke walkthrough", async ({ page }) => {
    test.setTimeout(300000);
    const apiCalls = [];
    page.on("response", async (res) => {
      const url = res.url();
      if (url.includes("localhost:4000") || url.includes("localhost:4001")) {
        let body = "";
        try {
          body = (await res.text()).slice(0, 200);
        } catch (_) {
          body = "(unreadable)";
        }
        apiCalls.push({ method: res.request().method(), url, status: res.status(), body });
      }
    });

    // --- Contractor login ---
    try {
      await login(page, "contractor");
      await page.screenshot({ path: path.join(OUT, "01-contractor-home.png"), fullPage: true });
      record("Contractor login", "pass", "Redirected to /home");
    } catch (e) {
      record("Contractor login", "fail", String(e.message || e));
      await page.screenshot({ path: path.join(OUT, "01-contractor-login-fail.png"), fullPage: true });
    }

    // --- Contractor profile ---
    try {
      await page.goto("/home/profile");
      await page.waitForTimeout(3000);
      const firstName = page.locator('input[name="firstName"]');
      await firstName.waitFor({ state: "visible", timeout: 15000 });
      const val = await firstName.inputValue();
      await page.screenshot({ path: path.join(OUT, "02-contractor-profile.png"), fullPage: true });
      if (val.toLowerCase().includes("bob")) {
        record("Contractor profile", "pass", `firstName=${val}`);
      } else {
        record("Contractor profile", "partial", `Profile loaded but firstName="${val}"`);
      }
    } catch (e) {
      record("Contractor profile", "fail", String(e.message || e));
      await page.screenshot({ path: path.join(OUT, "02-contractor-profile-fail.png"), fullPage: true });
    }

    // --- Contractor trainees (profile connections table) ---
    try {
      const rows = page.locator("table tbody tr");
      const count = await rows.count();
      const firstRowText = count > 0 ? await rows.first().innerText() : "";
      await page.screenshot({ path: path.join(OUT, "03-contractor-trainees-profile-table.png"), fullPage: true });
      if (count >= 1 && firstRowText.includes("trainee")) {
        record("Contractor trainees (profile table)", "pass", `${count} rows, sample: ${firstRowText.slice(0, 80)}`);
      } else if (count >= 1) {
        record("Contractor trainees (profile table)", "partial", `${count} rows but names may be blank — row: ${firstRowText.slice(0, 80)}`);
      } else {
        record("Contractor trainees (profile table)", "fail", "No table rows rendered");
      }
    } catch (e) {
      record("Contractor trainees (profile table)", "fail", String(e.message || e));
    }

    // --- Report years page ---
    try {
      await page.goto("/home/report/view");
      await page.waitForTimeout(2000);
      const traineeSelect = page.locator("select").first();
      await traineeSelect.waitFor({ state: "visible", timeout: 15000 });
      const options = await traineeSelect.locator("option").allTextContents();
      const traineeEmails = options.filter((o) => o.includes("@"));
      if (traineeEmails.length === 0) {
        record("Report years — trainee picker", "fail", `No trainee emails in dropdown: ${options.join("|")}`);
      } else {
        await traineeSelect.selectOption({ label: traineeEmails[0] });
        await page.waitForTimeout(3000);
        await page.screenshot({ path: path.join(OUT, "04-report-years.png"), fullPage: true });
        const yearSelect = page.locator("select").nth(1);
        const yearOptions = await yearSelect.locator("option").allTextContents();
        const years = yearOptions.filter((o) => /^\d{4}$/.test(o.trim()));
        if (years.length > 0) {
          record("Report years page", "pass", `Years loaded: ${years.join(", ")}`);
        } else {
          record("Report years page", "partial", `Trainee selected but year dropdown empty. Options: ${yearOptions.join("|")}`);
        }
      }
    } catch (e) {
      record("Report years page", "fail", String(e.message || e));
      await page.screenshot({ path: path.join(OUT, "04-report-years-fail.png"), fullPage: true });
    }

  // --- Logout-ish: fresh session for school ---
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // --- School login ---
    try {
      await login(page, "school");
      await page.screenshot({ path: path.join(OUT, "05-school-home.png"), fullPage: true });
      record("School login", "pass", "Redirected to /home");
    } catch (e) {
      record("School login", "fail", String(e.message || e));
      await page.screenshot({ path: path.join(OUT, "05-school-login-fail.png"), fullPage: true });
    }

    try {
      await page.goto("/home/profile");
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT, "06-school-profile.png"), fullPage: true });
      const schoolField = page.locator('input[name="schoolName"]');
      const schoolName = await schoolField.inputValue().catch(() => "");
      record("School profile", schoolName ? "pass" : "partial", `schoolName="${schoolName}"`);
    } catch (e) {
      record("School profile", "fail", String(e.message || e));
    }

    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // --- Trainee login ---
    try {
      await login(page, "trainee");
      await page.screenshot({ path: path.join(OUT, "07-trainee-home.png"), fullPage: true });
      record("Trainee login", "pass", "Redirected to /home");
    } catch (e) {
      record("Trainee login", "fail", String(e.message || e));
      await page.screenshot({ path: path.join(OUT, "07-trainee-login-fail.png"), fullPage: true });
    }

    try {
      await page.goto("/home/profile");
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT, "08-trainee-profile.png"), fullPage: true });
      const firstName = await page.locator('input[name="firstName"]').inputValue().catch(() => "");
      record("Trainee profile", firstName ? "pass" : "partial", `firstName="${firstName}"`);
    } catch (e) {
      record("Trainee profile", "fail", String(e.message || e));
    }

    fs.writeFileSync(path.join(OUT, "smoke-log.json"), JSON.stringify({ log, apiCalls }, null, 2));
    fs.writeFileSync(
      path.join(OUT, "smoke-summary.txt"),
      log.map((r) => `${r.status.toUpperCase().padEnd(8)} ${r.step}${r.detail ? " — " + r.detail : ""}`).join("\n")
    );

    const failures = log.filter((r) => r.status === "fail");
    expect(failures, `Smoke failures:\n${failures.map((f) => f.step).join("\n")}`).toHaveLength(0);
  });
});
