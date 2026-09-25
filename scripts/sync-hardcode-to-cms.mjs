// Sinkronisasi hardcode gambar -> Sanity CMS.
// Kebijakan: hardcode MENANG untuk world.gallery, world.image, dan carouselImage(placement=home).
// Jalankan: node scripts/sync-hardcode-to-cms.mjs [--dry-run]
// Di dev: startWatcher() dipanggil otomatis dari src/instrumentation.js.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const BRANDS = ["samsara", "acasa", "svarga", "outpace", "grove"];

const log = (...a) => console.log("[sync-cms]", ...a);
const warn = (...a) => console.error("[sync-cms]", ...a);

function loadEnv() {
  const file = path.join(ROOT, ".env.local");
  const text = fs.readFileSync(file, "utf8");
  const get = (k) => text.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
  return {
    token: get("SANITY_API_TOKEN"),
    projectId: get("NEXT_PUBLIC_SANITY_PROJECT_ID") || "p5zu5azj",
    dataset: get("NEXT_PUBLIC_SANITY_DATASET") || "production",
  };
}

const shaOf = (buf) => crypto.createHash("sha1").update(buf).digest("hex");
const newKey = () => crypto.randomBytes(6).toString("hex");
const shaFromRef = (ref) => ref?.match(/^image-([0-9a-f]{40})-/)?.[1] || null;

function makeClient({ token, projectId, dataset }) {
  const base = `https://${projectId}.api.sanity.io/v1`;
  const auth = { Authorization: "Bearer " + token };
  return {
    async gql(query) {
      const r = await fetch(
        `${base}/data/query/${dataset}?query=${encodeURIComponent(query)}`,
        { headers: auth },
      );
      const d = await r.json();
      if (d.error) throw new Error(JSON.stringify(d.error));
      return d.result;
    },
    async mutate(mutations) {
      const r = await fetch(`${base}/data/mutate/${dataset}`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ mutations }),
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(JSON.stringify(d).slice(0, 400));
      return d;
    },
    async uploadImage(abs, filename) {
      const r = await fetch(
        `${base}/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`,
        {
          method: "POST",
          headers: { ...auth, "Content-Type": "image/webp" },
          body: fs.readFileSync(abs),
        },
      );
      const d = await r.json();
      if (!r.ok || d.error || !d.document?._id)
        throw new Error(`upload ${filename}: ${JSON.stringify(d).slice(0, 300)}`);
      return d.document._id;
    },
  };
}

export function extractHeroPaths(src) {
  const m = src.match(/world\?\.gallery\?\.length[\s\S]*?:\s*\[([\s\S]*?)\]/);
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

export function extractBrandFallbacks(src) {
  const out = {};
  for (const line of src.split("\n")) {
    const m = line.match(/name:\s*"([A-Za-z]+)"[^{}]*?fallback:\s*"([^"]+)"/);
    if (m) out[m[1].toLowerCase()] = m[2];
  }
  return Object.keys(out).length ? out : null;
}

export function extractMarquee(src) {
  const m = src.match(/const fallbackMarquee\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return null;
  return [...m[1].matchAll(/src:\s*"([^"]+)"\s*,\s*brand:\s*"([^"]+)"/g)].map(
    (x) => ({ src: x[1], brand: x[2] }),
  );
}

function resolveLocal(urlPath) {
  const abs = path.join(PUBLIC_DIR, ...urlPath.replace(/^\//, "").split("/"));
  if (!fs.existsSync(abs)) throw new Error(`file tidak ada di public: ${urlPath}`);
  const buf = fs.readFileSync(abs);
  return { abs, sha: shaOf(buf), filename: path.basename(urlPath) };
}

export async function sync({ dryRun = false, source = "cli" } = {}) {
  const t0 = Date.now();
  const env = loadEnv();
  if (!env.token) throw new Error("SANITY_API_TOKEN tidak ditemukan di .env.local");
  const c = makeClient(env);

  const [worlds, slides, assets] = await Promise.all([
    c.gql(`*[_type == "world"]{_id, slug, image, gallery}`),
    c.gql(
      `*[_type == "carouselImage" && placement == "home"] | order(order asc){_id, order, brand, image, title}`,
    ),
    c.gql(`*[_type == "sanity.imageAsset"]{_id}`),
  ]);

  const shaToAsset = new Map();
  for (const a of assets) {
    const s = shaFromRef(a._id);
    if (s && !shaToAsset.has(s)) shaToAsset.set(s, a._id);
  }

  const mutations = [];
  const notes = [];
  let uploads = 0;
  let errors = 0;

  async function ensure(urlPath) {
    const f = resolveLocal(urlPath);
    const known = shaToAsset.get(f.sha);
    if (known) return { sha: f.sha, ref: known, filename: f.filename };
    if (dryRun) return { sha: f.sha, ref: null, filename: f.filename, needsUpload: true };
    const id = await c.uploadImage(f.abs, f.filename);
    shaToAsset.set(f.sha, id);
    uploads++;
    return { sha: f.sha, ref: id, filename: f.filename };
  }

  const worldBySlug = Object.fromEntries(
    worlds.map((w) => [w.slug?.current, w]),
  );

  for (const slug of BRANDS) {
    try {
      const file = path.join(ROOT, "src", "app", slug, "page.js");
      const paths = extractHeroPaths(fs.readFileSync(file, "utf8"));
      if (!paths) throw new Error("pola array hero tidak ditemukan di " + slug + "/page.js");
      const world = worldBySlug[slug];
      if (!world) throw new Error("dokumen world tidak ada di CMS");
      const cur = world.gallery || [];
      const desired = [];
      for (const p of paths) desired.push(await ensure(p));
      const same =
        cur.length === desired.length &&
        cur.every((g, i) => shaFromRef(g.asset?._ref) === desired[i].sha);
      if (same) continue;
      const keyBySha = new Map();
      for (const it of cur) {
        const s = shaFromRef(it.asset?._ref);
        if (s && !keyBySha.has(s)) keyBySha.set(s, it._key || newKey());
      }
      const next = desired.map((d) => ({
        _type: "image",
        _key: keyBySha.get(d.sha) || newKey(),
        asset: { _type: "reference", _ref: d.ref },
      }));
      notes.push(`gallery ${slug}: ${cur.length} -> ${desired.length}`);
      if (!dryRun) mutations.push({ patch: { id: world._id, set: { gallery: next } } });
    } catch (e) {
      warn(`gallery ${slug}: ${e.message}`);
      errors++;
    }
  }

  try {
    const file = path.join(ROOT, "src", "app", "brands", "page.js");
    const fallbacks = extractBrandFallbacks(fs.readFileSync(file, "utf8"));
    if (!fallbacks) throw new Error("pola fallback brands tidak ditemukan");
    for (const [slug, p] of Object.entries(fallbacks)) {
      const world = worldBySlug[slug];
      if (!world) throw new Error(`world ${slug} tidak ada di CMS`);
      const d = await ensure(p);
      const curSha = shaFromRef(world.image?.asset?._ref);
      if (curSha === d.sha) continue;
      notes.push(
        `image ${slug}: ${curSha ? curSha.slice(0, 8) : "(kosong)"} -> ${d.sha.slice(0, 8)} (${d.filename})`,
      );
      if (!dryRun) {
        mutations.push({
          patch: {
            id: world._id,
            set: {
              image: { _type: "image", asset: { _type: "reference", _ref: d.ref } },
            },
          },
        });
      }
    }
  } catch (e) {
    warn(`image brands: ${e.message}`);
    errors++;
  }

  try {
    const file = path.join(ROOT, "src", "components", "HomePage.js");
    const want = extractMarquee(fs.readFileSync(file, "utf8"));
    if (!want) throw new Error("pola fallbackMarquee tidak ditemukan");
    const killIds = [];
    let nextNum = Math.max(
      0,
      ...slides.map((d) => Number(d._id.match(/carousel-home-(\d+)/)?.[1] || 0)),
    );
    for (let i = 0; i < Math.max(want.length, slides.length); i++) {
      if (i < want.length && i < slides.length) {
        const doc = slides[i];
        const w = want[i];
        const d = await ensure(w.src);
        const set = {};
        if (shaFromRef(doc.image?.asset?._ref) !== d.sha)
          set.image = {
            _type: "image",
            asset: { _type: "reference", _ref: d.ref },
          };
        if ((doc.brand || null) !== w.brand) set.brand = w.brand;
        if (doc.order !== i + 1) set.order = i + 1;
        if (!Object.keys(set).length) continue;
        notes.push(`slide ${i + 1} (${doc._id}): ${Object.keys(set).join(", ")}`);
        if (!dryRun) mutations.push({ patch: { id: doc._id, set } });
      } else if (i < want.length) {
        const w = want[i];
        const d = await ensure(w.src);
        const num = ++nextNum;
        const nn = String(num).padStart(2, "0");
        notes.push(`slide baru: carousel-home-${nn} (${d.filename})`);
        if (!dryRun) {
          mutations.push({
            create: {
              _id: `carousel-home-${nn}`,
              _type: "carouselImage",
              placement: "home",
              title: `Home ${nn} · ${d.filename.replace(/\.[^.]+$/, "")}`,
              image: {
                _type: "image",
                asset: { _type: "reference", _ref: d.ref },
              },
              brand: w.brand,
              order: i + 1,
              active: true,
            },
          });
        }
      } else {
        killIds.push(slides[i]._id);
        notes.push(`slide dihapus: ${slides[i]._id}`);
      }
    }
    if (killIds.length && !dryRun) {
      mutations.push({
        delete: {
          query: `*[_id in [${killIds.map((i) => JSON.stringify(i)).join(",")}] && _type in ["carouselImage"]]`,
        },
      });
    }
  } catch (e) {
    warn(`marquee: ${e.message}`);
    errors++;
  }

  if (!dryRun && mutations.length) await c.mutate(mutations);

  for (const n of notes) log(`${source}: ${n}`);
  const dur = ((Date.now() - t0) / 1000).toFixed(1) + "s";
  if (notes.length === 0 && errors === 0) {
    log(`${source}: tidak ada perubahan (${dur})`);
  } else {
    log(
      `${source}: ${notes.length} perubahan, ${mutations.length} mutasi, ${uploads} upload, ${errors} error (${dur})`,
    );
  }
  return { notes: notes.length, mutations: mutations.length, uploads, errors };
}

export function startWatcher({ debounce = 900 } = {}) {
  if (globalThis.__SYNC_CMS_WATCHER__) return;
  globalThis.__SYNC_CMS_WATCHER__ = true;
  const files = [
    ...BRANDS.map((s) => path.join(ROOT, "src", "app", s, "page.js")),
    path.join(ROOT, "src", "app", "brands", "page.js"),
    path.join(ROOT, "src", "components", "HomePage.js"),
  ];
  let timer = null;
  let queue = Promise.resolve();
  const run = (source) => {
    queue = queue
      .then(() => sync({ source }))
      .catch((e) => warn("sync gagal:", e.message));
  };
  for (const f of files) {
    try {
      fs.watch(f, () => {
        clearTimeout(timer);
        timer = setTimeout(() => run("watch"), debounce);
      });
    } catch (e) {
      warn("watch gagal:", path.relative(ROOT, f), e.message);
    }
  }
  run("startup");
  log(`watcher aktif — ${files.length} file dipantau (hanya dev)`);
}

const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const dryRun = process.argv.includes("--dry-run");
  sync({ dryRun, source: dryRun ? "dry-run" : "cli" })
    .then((r) => process.exit(r.errors ? 1 : 0))
    .catch((e) => {
      warn(e.message);
      process.exit(1);
    });
}
