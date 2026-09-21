const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = path.resolve(__dirname, "..", "screenshots", "mobile");

const PAGES = [
  { route: "/", name: "mobile-01-home" },
  { route: "/about", name: "mobile-02-about" },
  { route: "/events", name: "mobile-03-events" },
  { route: "/contact", name: "mobile-06-contact" },
  { route: "/samsara", name: "mobile-09-samsara" },
  { route: "/menu", name: "mobile-25-menu" },
];

(async () => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });

  for (const { route, name } of PAGES) {
    const screenshotPath = path.join(SCREENSHOT_DIR, `${name}.png`);
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`✓ ${route} → ${name}.png`);
    } catch (err) {
      console.error(`✗ ${route} — ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nMobile screenshots saved to: ${SCREENSHOT_DIR}`);
})();
