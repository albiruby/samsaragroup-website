import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = "http://localhost:3111";
const OUT = "D:/Cek Website JSD - Infia/Sams Group/screenshots/desktop";

const ROUTES = [
  ["/", "01-home"],
  ["/about", "02-about"],
  ["/samsara", "03-samsara"],
  ["/acasa", "04-acasa"],
  ["/svarga", "05-svarga"],
  ["/outpace", "06-outpace"],
  ["/grove", "07-grove"],
  ["/brands", "08-brands"],
  ["/events", "09-events"],
  ["/contact", "10-contact"],
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1429, height: 900 },
  deviceScaleFactor: 1,
  locale: "id-ID",
  timezoneId: "Asia/Jakarta",
});

/**
 * The preloader only appears on a fresh session and fades over ~1.8s. Seeding the
 * flag keeps the capture from catching a half-faded overlay.
 */
await context.addInitScript(() => {
  try {
    sessionStorage.setItem("samsara-preloaded", "1");
  } catch {}
});

const page = await context.newPage();

for (const [route, name] of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 60000 });

  // Wait for every image to settle, including lazy ones further down the page.
  await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll("img")];
    await Promise.all(
      imgs.map((i) =>
        i.complete
          ? Promise.resolve()
          : new Promise((res) => {
              i.addEventListener("load", res, { once: true });
              i.addEventListener("error", res, { once: true });
            })
      )
    );
  });

  // Scroll through so IntersectionObserver reveals fire, then return to the top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  // Park the hero carousel on slide 1 so captures are comparable between runs.
  const firstDot = page.locator('[aria-label="Go to image 1"]').first();
  if (await firstDot.count()) {
    await firstDot.click().catch(() => {});
    await page.waitForTimeout(900);
  }

  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: true });

  const box = await page.evaluate(() => ({
    h: document.body.scrollHeight,
    imgs: document.querySelectorAll("img").length,
    broken: [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0).length,
  }));

  console.log(
    `${route.padEnd(10)} -> ${name}.png  tinggi ${box.h}px  gambar ${box.imgs}  rusak ${box.broken}`
  );
}

await browser.close();
console.log(`\nselesai: ${OUT}`);