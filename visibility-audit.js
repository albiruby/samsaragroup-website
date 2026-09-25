const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = path.resolve(__dirname, "..", "screenshots", "desktop");

const PAGES = [
  { route: "/", name: "01-home" },
  { route: "/about", name: "02-about" },
  { route: "/events", name: "03-events" },
  { route: "/journal", name: "04-journal" },
  { route: "/contact", name: "06-contact" },
  { route: "/locations", name: "07-locations" },
  { route: "/collaborations", name: "08-collaborations" },
  { route: "/samsara", name: "09-samsara" },
  { route: "/svarga", name: "11-svarga" },
  { route: "/acasa", name: "12-acasa" },
  { route: "/nocturne", name: "13-nocturne" },
  { route: "/music", name: "14-music" },
  { route: "/dining", name: "15-dining" },
  { route: "/hospitality", name: "16-hospitality" },
  { route: "/community", name: "17-community" },
  { route: "/design", name: "18-design" },
  { route: "/lifestyle", name: "19-lifestyle" },
  { route: "/privacy", name: "20-privacy" },
  { route: "/terms", name: "21-terms" },
  { route: "/locations/jakarta", name: "22-locations-jakarta" },
  { route: "/locations/ubud", name: "23-locations-ubud" },
  { route: "/locations/canggu", name: "24-locations-canggu" },
  { route: "/menu", name: "25-menu" },
];

(async () => {
  // Ensure output dir exists
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const errors = [];
  const pagesTested = [];

  for (const { route, name } of PAGES) {
    const screenshotPath = path.join(SCREENSHOT_DIR, `${name}.png`);
    const pageErrors = [];

    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        pageErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    const url = `${BASE_URL}${route}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.screenshot({ path: screenshotPath, fullPage: true });
      pagesTested.push(route);
      if (pageErrors.length > 0) {
        errors.push({ route, consoleErrors: pageErrors });
      }
      console.log(`✓ ${route} → ${path.basename(screenshotPath)}`);
    } catch (err) {
      console.error(`✗ ${route} — ${err.message}`);
      errors.push({ route, consoleErrors: [err.message] });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log("\n========== AUDIT SUMMARY ==========");
  console.log(`Pages tested: ${pagesTested.length}/${PAGES.length}`);
  if (errors.length > 0) {
    console.log(`\nConsole errors found on ${errors.length} page(s):\n`);
    for (const e of errors) {
      console.log(`  ${e.route}:`);
      for (const msg of e.consoleErrors) {
        console.log(`    - ${msg}`);
      }
    }
  } else {
    console.log("No console errors detected.");
  }
  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}`);
})();
