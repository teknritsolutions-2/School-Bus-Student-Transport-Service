// Run against a local or published subpath. Playwright is a development-only tool.
// PLAYWRIGHT_MODULE=/path/to/playwright BROWSER_PATH=/path/to/browser node scripts/browser-qa.cjs [base-url] [matrix]
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const base = process.argv[2] || "http://127.0.0.1:8765/";
const pages = [
  "index.html",
  ...fs
    .readdirSync("pages")
    .filter((x) => x.endsWith(".html"))
    .map((x) => "pages/" + x),
];
const matrixPages = [
  ...pages,
  "pages/services.html#service-activities",
  "pages/services.html#service-groups",
  ...[
    "track",
    "students",
    "logs",
    "notifications",
    "subscription",
    "receipts",
    "settings",
    "help",
  ].map((id) => "pages/parent-dashboard.html#" + id),
];
const widths = [320, 360, 390, 425, 430, 768, 820, 960, 1024, 1180, 1280, 1440];
const errors = [],
  failures = [];
let checks = 0;
async function test(name, run) {
  try {
    await run();
    checks++;
    console.log("PASS", name);
  } catch (e) {
    failures.push(name + ": " + e.message);
    console.log("FAIL", name, e.message);
  }
}
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_PATH,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  const p = await context.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("response", (r) => {
    if (r.status() >= 400) errors.push(r.status() + " " + r.url());
  });
  const go = async (path) => {
    await p.goto(new URL(path, base).href);
    await p.evaluate(() => document.fonts.ready);
  };
  await test("all physical routes, assets, local links and unique photography", async () => {
    const images = new Set();
    for (const path of pages) {
      await go(path);
      await p.locator("h1").waitFor();
      const data = await p.evaluate(async () => {
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
        return {
          images: [...document.images].map((i) => ({
            src: i.src,
            ok: i.naturalWidth > 0,
          })),
          links: [...document.querySelectorAll("a[href]")].map((a) => a.href),
        };
      });
      for (const i of data.images) {
        assert(i.ok, i.src);
        assert(!images.has(i.src), "Repeated photo: " + i.src);
        images.add(i.src);
      }
      for (const href of data.links) {
        const u = new URL(href);
        if (u.origin !== new URL(base).origin) continue;
        assert(
          u.pathname.startsWith(new URL(base).pathname),
          "Escapes subpath: " + href,
        );
        const relative =
          decodeURIComponent(u.pathname.slice(new URL(base).pathname.length)) ||
          "index.html";
        assert(fs.existsSync(relative), "Missing destination: " + relative);
      }
    }
    console.log("Routes:", pages.length, "unique photos:", images.size);
  });
  await go("index.html");
  await test("Home dropdown and Services direct destination", async () => {
    await p.locator(".home-menu summary").click();
    assert.equal(await p.locator(".dropdown a").count(), 2);
    assert.equal(
      await p.locator(".dropdown a").first().textContent(),
      "Home 1",
    );
    await p.keyboard.press("Escape");
    assert.equal(await p.locator(".home-menu").getAttribute("open"), null);
    assert.equal(
      await p
        .locator(".desktop-navigation > a")
        .filter({ hasText: "Services" })
        .count(),
      1,
    );
  });
  await test("combined route filters, empty state and reverse stop times", async () => {
    await p.selectOption("[name=area]", "Reference area A");
    await p.selectOption("[name=school]", "Reference school B");
    await p.locator("[data-route-finder] button").click();
    assert(await p.locator(".empty-state").isVisible());
    assert.equal(await p.locator(".route-result").count(), 0);
    await p.selectOption("[name=school]", "Reference school A");
    await p.selectOption("[name=journey]", "Afternoon return");
    await p.locator("[data-route-finder] button").click();
    assert.equal(await p.locator(".route-result").count(), 1);
    assert.match(
      await p.locator(".stop-list li").first().textContent(),
      /Reference school A.*3:45 PM/s,
    );
    assert(
      (await p.locator(".route-result-foot a").getAttribute("href")).includes(
        "/pages/contact.html",
      ),
    );
  });
  await test("actual sticky header and back-to-top", async () => {
    await p.evaluate(() => scrollTo(0, 1500));
    await p.waitForTimeout(100);
    assert.equal(
      Math.round((await p.locator(".site-header").boundingBox()).y),
      0,
    );
    await p.locator("[data-back-top]").click();
    await p.waitForTimeout(100);
    assert.equal(await p.evaluate(() => scrollY), 0);
  });
  await test("theme and direction toggle once and persist", async () => {
    await p.locator(".header-tools [data-theme-toggle]").click();
    await p.locator(".header-tools [data-dir-toggle]").click();
    await p.reload();
    assert.equal(await p.locator("html").getAttribute("data-theme"), "dark");
    assert.equal(await p.locator("html").getAttribute("dir"), "rtl");
    await p.locator(".header-tools [data-theme-toggle]").click();
    await p.locator(".header-tools [data-dir-toggle]").click();
  });
  await test("mobile navigation focus trap, Escape and RTL drawer", async () => {
    await p.setViewportSize({ width: 390, height: 844 });
    await p.locator("[data-menu-open]").click();
    assert(
      await p
        .locator("[data-menu-close]")
        .evaluate((el) => el === document.activeElement),
    );
    await p.locator(".drawer-tools a").focus();
    await p.keyboard.press("Tab");
    assert(
      await p
        .locator(".site-drawer .brand")
        .evaluate((el) => el === document.activeElement),
    );
    await p.keyboard.press("Escape");
    assert(
      await p
        .locator("[data-menu-open]")
        .evaluate((el) => el === document.activeElement),
    );
    await p.locator("[data-menu-open]").click();
    await p.locator(".drawer-tools [data-dir-toggle]").click();
    assert((await p.locator("[data-drawer]").boundingBox()).x >= 0);
    await p.keyboard.press("Escape");
    await p.setViewportSize({ width: 1440, height: 1000 });
    await p.locator(".header-tools [data-dir-toggle]").click();
  });
  await go("pages/services.html");
  await test("service selector photos, details, links, keyboard and direct selection", async () => {
    for (let index = 0; index < 3; index++) {
      await p.locator(`[data-service-tab="${index}"]`).click();
      assert.equal(await p.locator("[data-service-panel]:visible").count(), 1);
      const panel = p.locator(`[data-service-panel="${index}"]`);
      assert(await panel.isVisible());
      assert.match(
        await panel.locator("a.button").getAttribute("href"),
        /transport-services.html#/,
      );
      const dimensions = await panel.locator("img").evaluate(async (image) => {
        await image.decode();
        return {
          width: image.naturalWidth,
          height: image.naturalHeight,
          renderedWidth: image.clientWidth,
          renderedHeight: image.clientHeight,
          frameWidth: image.parentElement.clientWidth,
        };
      });
      assert(
        Math.abs(
          dimensions.renderedWidth / dimensions.renderedHeight -
            dimensions.width / dimensions.height,
        ) < 0.02,
      );
      assert(dimensions.renderedWidth >= dimensions.frameWidth - 2);
    }
    await p.reload();
    assert(await p.locator("#service-groups").isVisible());
    await p.locator('[data-service-tab="2"]').focus();
    await p.keyboard.press("Home");
    assert.equal(
      await p.locator('[data-service-tab="0"]').getAttribute("aria-selected"),
      "true",
    );
    await p.keyboard.press("ArrowRight");
    assert.equal(
      await p.locator('[data-service-tab="1"]').getAttribute("aria-selected"),
      "true",
    );
  });
  await go("pages/home2.html");
  await test("Home 2 tabs and keyboard selection", async () => {
    await p.locator('[data-stage="1"]').click();
    assert.match(
      await p.locator("[data-stage-content]").textContent(),
      /handoff/,
    );
    await p.keyboard.press("ArrowRight");
    assert.equal(
      await p.locator('[data-stage="2"]').getAttribute("aria-selected"),
      "true",
    );
  });
  for (const path of ["faq", "blog"]) {
    await go("pages/" + path + ".html");
    await test(path + " search and empty state", async () => {
      await p.locator("input[type=search]").fill("no-such-topic-zxy");
      assert(await p.locator("[data-search-empty]").isVisible());
      await p.locator("input[type=search]").fill("");
      assert(!(await p.locator("[data-search-empty]").isVisible()));
      await p.locator("[data-category]").nth(1).click();
      assert.equal(
        await p.locator("[data-category]").nth(1).getAttribute("aria-pressed"),
        "true",
      );
    });
  }
  await go("pages/subscription-plans.html");
  await test("example family estimate", async () => {
    await p.selectOption("[name=plan]", "family");
    await p.locator("[name=students]").fill("3");
    await p.locator("[name=months]").fill("2");
    assert.match(await p.locator("output").textContent(), /19,800/);
  });
  for (const path of ["login", "register"]) {
    await go("pages/" + path + ".html");
    await test(
      path + " validation and honest unconnected behavior",
      async () => {
        assert.equal(await p.locator(".site-header,.site-footer").count(), 0);
        if (path === "register") await p.locator("[name=name]").fill("Parent");
        await p.locator("[name=email]").fill("parent@example.test");
        await p.locator("[name=password]").fill("Testing123!");
        await p.locator("[data-password-toggle]").first().click();
        assert.equal(
          await p.locator("[name=password]").getAttribute("type"),
          "text",
        );
        if (path === "register") {
          await p.locator("[name=confirm]").fill("Mismatch123!");
          await p.locator("input[type=checkbox]").check();
          await p.locator("[data-auth-form] button[type=submit]").click();
          assert.equal(
            await p.locator("[name=confirm]").evaluate((i) => i.validity.valid),
            false,
          );
          await p.locator("[name=confirm]").fill("Testing123!");
        }
        await p.locator("[data-auth-form] button[type=submit]").click();
        assert(p.url().includes(path + ".html"));
        assert.match(
          await p.locator("[data-auth-status]").textContent(),
          /not connected/,
        );
        await p.locator("[data-provider]").first().click();
        assert.match(
          await p.locator("[data-auth-status]").textContent(),
          /No sign-in request/,
        );
        if (path === "login") {
          await p.locator("[data-forgot]").click();
          assert.match(
            await p.locator("[data-auth-status]").textContent(),
            /No reset email/,
          );
        }
        assert(
          !(await p.evaluate(() => JSON.stringify(localStorage))).includes(
            "Testing123!",
          ),
        );
      },
    );
  }
  await go("pages/contact.html");
  await test("contact preview and downloadable unsent draft", async () => {
    await p.locator("[name=name]").fill("Parent");
    await p.locator("[name=email]").fill("parent@example.test");
    await p.locator("[name=message]").fill("<b>Route enquiry</b>");
    await p.locator("[data-enquiry] button[type=submit]").click();
    assert.match(
      await p.locator("[data-enquiry-preview] pre").textContent(),
      /<b>Route enquiry<\/b>/,
    );
    assert.equal(await p.locator("[data-enquiry-preview] pre b").count(), 0);
    const dl = p.waitForEvent("download");
    await p.locator("[data-download-draft]").click();
    assert.match((await dl).suggestedFilename(), /enquiry/);
  });
  await go("pages/parent-dashboard.html");
  const view = async (id) => {
    await p.evaluate((id) => (location.hash = id), id);
    await p.locator("[data-workspace-title]").filter({ hasText: ".*" }).count();
    await p.waitForTimeout(60);
  };
  await test("all nine dashboard views and student switch", async () => {
    assert.equal(await p.locator("[data-view]").count(), 9);
    await p.selectOption("#selected-student", "student-b");
    assert.match(await p.locator(".assignment-panel").textContent(), /REF-24/);
    for (const id of [
      "track",
      "students",
      "logs",
      "notifications",
      "subscription",
      "receipts",
      "settings",
      "help",
      "overview",
    ]) {
      await view(id);
      assert(await p.locator("[data-workspace-content]").textContent());
    }
  });
  await test("playback pause/reset isolated from historical records and notices", async () => {
    await view("logs");
    const history = await p.locator("tbody").textContent();
    const storage = await p.evaluate(() => JSON.stringify(localStorage));
    await view("track");
    await p.selectOption("#playback-direction", "Afternoon return");
    assert.match(
      await p.locator("[data-playback-stops] li").first().textContent(),
      /Reference school B/,
    );
    await p.locator("[data-playback=start]").click();
    await p.waitForTimeout(1100);
    await p.locator("[data-playback=pause]").click();
    const percent = await p.locator("[data-playback-percent]").textContent();
    assert.notEqual(percent, "0%");
    await p.waitForTimeout(600);
    assert.equal(
      await p.locator("[data-playback-percent]").textContent(),
      percent,
    );
    await p.locator("[data-playback=reset]").click();
    assert.equal(
      await p.locator("[data-playback-percent]").textContent(),
      "0%",
    );
    assert.match(
      await p.locator("[data-playback-events]").textContent(),
      /No simulation events/,
    );
    assert.equal(await p.evaluate(() => JSON.stringify(localStorage)), storage);
    await view("logs");
    assert.equal(await p.locator("tbody").textContent(), history);
  });
  await test("notice read state and plan selection persist", async () => {
    await view("notifications");
    await p.locator("[data-read-all]").click();
    assert.equal(await p.locator("[data-notice-count]").textContent(), "0");
    await view("subscription");
    await p.locator("[data-plan=family]").click();
    assert.match(
      await p.locator("[data-workspace-status]").textContent(),
      /No payment/,
    );
    await p.reload();
    assert.match(
      await p.locator(".plan.featured").textContent(),
      /Family Return/,
    );
  });
  await test("actual draft PDF download", async () => {
    await view("receipts");
    const download = p.waitForEvent("download");
    await p.locator("[data-receipt]").click();
    const d = await download;
    await d.saveAs("/tmp/kinderride-qa-receipt.pdf");
    assert.equal(
      fs
        .readFileSync("/tmp/kinderride-qa-receipt.pdf")
        .subarray(0, 4)
        .toString(),
      "%PDF",
    );
    assert(
      fs
        .readFileSync("/tmp/kinderride-qa-receipt.pdf")
        .toString()
        .includes("DRAFT - NOT PROOF OF PAYMENT"),
    );
  });
  await test("workspace settings save, display toggles and reset", async () => {
    await view("settings");
    await p.locator("#display-name").fill("Test Parent");
    await p.locator("[data-profile-form] button").click();
    await p.reload();
    assert.equal(await p.locator("#display-name").inputValue(), "Test Parent");
    await p.locator(".workspace-topbar [data-theme-toggle]").click();
    assert.equal(await p.locator("html").getAttribute("data-theme"), "dark");
    await p.locator(".workspace-topbar [data-theme-toggle]").click();
    await p.locator("[data-notice-pref=service]").check();
    p.once("dialog", (d) => d.accept());
    await p.locator("[data-reset-local]").click();
    assert.equal(
      await p.locator("#selected-student").inputValue(),
      "student-a",
    );
  });
  await test("dashboard mobile drawer and adapted history", async () => {
    await p.setViewportSize({ width: 320, height: 780 });
    await p.locator("[data-workspace-menu]").click();
    assert(
      await p
        .locator("[data-workspace-close]")
        .evaluate((el) => el === document.activeElement),
    );
    await p.locator("[data-view=logs]").click();
    await p.waitForFunction(
      () => document.querySelector("[data-workspace-sidebar]").inert,
    );
    assert.equal(
      await p.locator("[data-workspace-sidebar]").getAttribute("inert"),
      "",
    );
    assert.equal(await p.locator("thead").isVisible(), false);
  });
  if (process.argv[3] === "matrix") {
    for (const path of matrixPages) {
      await go(path);
      for (const theme of ["light", "dark"])
        for (const dir of ["ltr", "rtl"])
          for (const width of widths) {
            await p.setViewportSize({ width, height: 900 });
            await p.evaluate(
              ({ theme, dir }) => {
                document.documentElement.dataset.theme = theme;
                document.documentElement.dir = dir;
              },
              { theme, dir },
            );
            const result = await p.evaluate(() => ({
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              bad: [...document.querySelectorAll("main img")]
                .filter(
                  (i) =>
                    i.complete &&
                    i.naturalWidth &&
                    Math.abs(
                      i.getBoundingClientRect().width /
                        i.getBoundingClientRect().height -
                        i.naturalWidth / i.naturalHeight,
                    ) > 0.04,
                )
                .map((i) => i.src),
            }));
            if (result.overflow || result.bad.length)
              failures.push(
                JSON.stringify({ path, theme, dir, width, ...result }),
              );
          }
      console.log("MATRIX", path, 48, "states");
    }
  }
  await browser.close();
  fs.writeFileSync(
    "/tmp/kinderride-qa-results.json",
    JSON.stringify(
      {
        base,
        checks,
        states: process.argv[3] === "matrix" ? matrixPages.length * 48 : 0,
        errors,
        failures,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ checks, errors, failures }, null, 2));
  if (errors.length || failures.length) process.exitCode = 1;
})();
