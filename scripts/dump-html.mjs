/** Dumps raw normalised HTML per route so two runs can be diffed byte-for-byte. */
import { mkdir, writeFile } from "node:fs/promises";

const LABEL = process.argv[2] || "dump";
const DIR = new URL(`../.snapshots/html-${LABEL}/`, import.meta.url);
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

await mkdir(DIR, { recursive: true });

for (const route of ROUTES) {
  const name = (route === "/" ? "root" : route.replace(/\//g, "_").replace(/^_/, "")).replace(/[^a-z0-9_]/gi, "");
  const body = normalise(await (await fetch(BASE + route)).text());
  await writeFile(new URL(`${name}.txt`, DIR), body);
  console.log(`${route.padEnd(11)} ${String(body.length).padStart(6)}  ${name}.txt`);
}