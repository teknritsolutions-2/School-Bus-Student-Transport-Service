// Provider wiring is checked with a test configuration, not real OAuth accounts.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.argv[2] || "http://127.0.0.1:8765/";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_PATH,
  });
  for (const provider of ["Google", "Apple"]) {
    const context = await browser.newContext();
    await context.route("**/auth-config.js*", (r) =>
      r.fulfill({
        contentType: "application/javascript",
        body: 'export const AUTH_CONFIG={url:"https://kinderride-test.supabase.co",publishableKey:"sb_publishable_test"};',
      }),
    );
    let endpoint;
    await context.route("https://kinderride-test.supabase.co/**", (r) => {
      endpoint = new URL(r.request().url());
      return r.fulfill({
        contentType: "text/html",
        body: "<title>Test OAuth endpoint</title>",
      });
    });
    const p = await context.newPage();
    await p.goto(new URL("pages/login.html", base).href);
    await p.locator(`[data-provider="${provider}"]`).click();
    await p.waitForURL("https://kinderride-test.supabase.co/**");
    assert.equal(endpoint.pathname, "/auth/v1/authorize");
    assert.equal(endpoint.searchParams.get("provider"), provider.toLowerCase());
    assert.equal(
      endpoint.searchParams.get("redirect_to"),
      new URL("pages/login.html", base).href,
    );
    assert.equal(endpoint.searchParams.get("code_challenge_method"), "s256");
    assert(endpoint.searchParams.get("code_challenge").length >= 43);
    console.log(
      "PASS",
      provider,
      "official SDK PKCE authorize URL and subpath callback",
    );
    await context.close();
  }
  const c = await browser.newContext();
  await c.route("**/auth-config.js*", (r) =>
    r.fulfill({
      contentType: "application/javascript",
      body: 'export const AUTH_CONFIG={url:"https://kinderride-test.supabase.co",publishableKey:"sb_publishable_test"};',
    }),
  );
  let passwordRequest = false;
  await c.route("https://kinderride-test.supabase.co/auth/v1/token**", (r) => {
    passwordRequest = true;
    assert.equal(r.request().postDataJSON().email, "parent@example.test");
    return r.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: "invalid_grant",
        error_description: "Invalid login credentials",
      }),
    });
  });
  const p = await c.newPage();
  await p.goto(new URL("pages/login.html", base).href);
  await p.locator("[name=email]").fill("parent@example.test");
  await p.locator("[name=password]").fill("Testing123!");
  await p.locator("[type=submit]").click();
  await p
    .locator("[data-auth-status]")
    .filter({ hasText: "Invalid login credentials" })
    .waitFor();
  assert(passwordRequest);
  assert(p.url().endsWith("/pages/login.html"));
  console.log(
    "PASS email login rejects server error without dashboard navigation",
  );
  await c.close();
  const publicPage = await browser.newPage();
  await publicPage.goto(new URL("pages/parent-dashboard.html", base).href);
  assert.equal(
    await publicPage.locator("[data-account-exit]").textContent(),
    "Exit",
  );
  await publicPage.locator("[data-account-exit]").click();
  await publicPage.waitForURL(new URL("index.html", base).href);
  assert.equal(
    await publicPage.locator(".header-tools .login-link.button").count(),
    1,
  );
  assert.equal(
    await publicPage.locator(".header-tools .dashboard-link").textContent(),
    "Dashboard",
  );
  console.log("PASS Exit returns home; Login button and Dashboard label");
  await browser.close();
})();
