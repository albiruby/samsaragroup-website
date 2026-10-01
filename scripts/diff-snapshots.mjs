/** Diffs two consecutive fetches after normalisation; true variance = real bug. */
import { readFile } from "node:fs/promises";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const ROUTES = ["/", "/brands", "/samsara", "/svarga", "/acasa", "/outpace", "/grove", "/about", "/events", "/contact"];

function normalise(html) {
  return html
    .replace(/nonce="[^"]*"/g, 'nonce="X"')
    .replace(/\\"nonce\\":\\"[^\\]*\\"/g, '\\"nonce\\":\\"X\\"')
    .replace(/"buildId":"[^"]*"/g, '"buildId":"X"')
    .replace(/self\.__next_r="[^"]*"/g, 'self.__next_r="X"')
    .replace(/[?&]v=[a-f0-9]{8,}/g, "?v=X")
    .replace(/_next\/static\/[A-Za-z0-9_-]+\//g, "_next/static/HASH/")
    .replace(/\d{4}-\d{2}-\d{2}T[\d:.+Z-]+/g, "DATE")
    .replace(/\s+/g, " ")
    .trim();
}

let unstable = 0;

for (const route of ROUTES) {
  const a = normalise(await (await fetch(BASE + route)).text());
  const b = normalise(await (await fetch(BASE + route)).text());

  if (a === b) {
    console.log(`${route.padEnd(11)} deterministic`);
  } else {
    unstable++;
    let i = 0;
    while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++;
    console.log(`${route.padEnd(11)} VARIES @${i}`);
    console.log("   A:", JSON.stringify(a.slice(Math.max(0, i - 70), i + 70)));
    console.log("   B:", JSON.stringify(b.slice(Math.max(0, i - 70), i + 70)));
  }
}

console.log(`\n${unstable}/${ROUTES.length} unstable`);