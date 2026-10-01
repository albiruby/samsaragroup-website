const BASE = "http://localhost:3000";
const ROUTES = ["/", "/brands", "/samsara", "/svarga", "/acasa", "/outpace", "/grove", "/about", "/events", "/contact"];

let total = 0;

for (const route of ROUTES) {
  const html = await (await fetch(BASE + route)).text();

  // U+FFFD REPLACEMENT CHARACTER — a corrupted byte rendered to the user.
  const bad = [...html.matchAll(/�/g)];
  // Mojibake sequences: 'â€"' style UTF-8 read as latin-1.
  const moji = [...html.matchAll(/â€|Ã©|Ã¡/g)];

  if (bad.length || moji.length) {
    total += bad.length + moji.length;
    console.log(`${route}  U+FFFD=${bad.length}  mojibake=${moji.length}`);
    for (const m of bad.slice(0, 3)) {
      console.log("   ctx:", JSON.stringify(html.slice(Math.max(0, m.index - 70), m.index + 40)));
    }
  } else {
    console.log(`${route}  clean`);
  }
}

console.log(`\ntotal corruption markers: ${total}`);