export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sams-sams.vercel.app"
).replace(/\/+$/, "");

export function siteUrl(path = "") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function safeUrl(value) {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

export const DEFAULT_OG_IMAGE = {
  url: "/ambiencesamsara/DSC08930.webp",
  width: 1920,
  height: 1280,
  alt: "Samsara Group",
};

export function ogImages(image, alt = "Samsara Group") {
  const url = safeUrl(image);
  if (!url) return [{ ...DEFAULT_OG_IMAGE, url: siteUrl(DEFAULT_OG_IMAGE.url) }];
  return [{ url, width: 1200, height: 630, alt }];
}