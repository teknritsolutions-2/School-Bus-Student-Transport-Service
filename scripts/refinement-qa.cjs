const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.argv[2] || "http://127.0.0.1:8765/";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_PATH,
  });
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("response", (r) => {
    if (r.status() >= 400) errors.push(r.status() + " " + r.url());
  });
  const go = async (path) => {
    await p.goto(new URL(path, base).href);
    await p.evaluate(() => document.fonts.ready);
  };
  await go("pages/pricing-policies.html");
  const hero = await p.locator(".pricing-intro > .container").boundingBox();
  const section = await p
    .locator(".section > .container")
    .first()
    .boundingBox();
  assert(Math.abs(hero.x - section.x) < 1);
  assert(Math.abs(hero.width - section.width) < 1);
  await p.screenshot({ path: "/tmp/kr-pricing-wide.png" });
  console.log("PASS Pricing banner aligns with shared page gutters");
  await go("pages/home2.html");
  assert.equal(await p.locator("#daily-journey .journey-rail").count(), 0);
  const tabs = await p.locator(".stage-tabs").boundingBox(),
    panel = await p.locator(".stage-panel").boundingBox();
  assert(Math.abs(tabs.width - panel.width) < 1);
  assert(panel.height < 330);
  await p
    .locator("#daily-journey")
    .screenshot({ path: "/tmp/kr-home2-compact.png" });
  console.log(
    "PASS Home 2 horizontal stages and compact content, without duplicate timeline",
  );
  for (const width of [320, 390, 768, 1024, 1180]) {
    await p.setViewportSize({ width, height: 900 });
    await go("pages/parent-dashboard.html");
    for (const dir of ["ltr", "rtl"]) {
      await p.evaluate((dir) => (document.documentElement.dir = dir), dir);
      const menu = await p.locator("[data-workspace-menu]").boundingBox();
      const brand = await p.locator(".workspace-topbar .brand").boundingBox();
      assert(menu.x > width - 85);
      assert(brand.x < 45);
      assert.equal(
        await p.locator(".workspace-topbar .workspace-tools").isVisible(),
        false,
      );
      await p.locator("[data-workspace-menu]").click();
      assert(
        await p
          .locator(".workspace-preferences [data-theme-toggle]")
          .isVisible(),
      );
      assert(
        await p.locator(".workspace-preferences [data-dir-toggle]").isVisible(),
      );
      const old = await p.locator("html").getAttribute("data-theme");
      await p.locator(".workspace-preferences [data-theme-toggle]").click();
      assert.notEqual(await p.locator("html").getAttribute("data-theme"), old);
      await p.locator(".workspace-preferences [data-dir-toggle]").click();
      assert.notEqual(await p.locator("html").getAttribute("dir"), dir);
      await p.locator("[data-workspace-close]").click();
    }
    if (width === 390 || width === 1024)
      await p.screenshot({ path: "/tmp/kr-dashboard-" + width + ".png" });
  }
  console.log(
    "PASS Dashboard branding left/menu right; drawer theme and direction controls at five phone/tablet widths, both directions",
  );
  const backgrounds = [];
  for (const name of ["login", "register"]) {
    await p.setViewportSize({ width: 1440, height: 1000 });
    await go("pages/" + name + ".html");
    const image = p.locator(".auth-scene img");
    await image.evaluate((i) => i.decode());
    backgrounds.push(await image.getAttribute("src"));
    assert.equal(await image.getAttribute("sizes"), "100vw");
    await p.screenshot({ path: "/tmp/kr-new-" + name + ".png" });
  }
  assert.notEqual(backgrounds[0], backgrounds[1]);
  assert(backgrounds.every((src) => !src.includes("interior")));
  await p.setViewportSize({ width: 390, height: 900 });
  await go("pages/about.html");
  const img = p.locator(".about-audiences img");
  await img.evaluate((i) => i.decode());
  assert.match(await img.evaluate((i) => i.currentSrc), /-640.webp/);
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    "PASS Distinct exterior auth backgrounds and smaller phone photo variants",
  );
  await browser.close();
})();
