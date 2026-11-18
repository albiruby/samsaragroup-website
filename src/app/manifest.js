/**
 * Served at /manifest.webmanifest. Gives a phone's "Add to Home Screen" the brand
 * name and mark instead of a screenshot. Not an installable offline app: there is
 * no service worker, and none is wanted.
 */
export default function manifest() {
  return {
    name: "Samsara Group",
    short_name: "Samsara",
    description:
      "A cultural sanctuary and lifestyle institute preserving Indonesian architectural heritage, artisanal tactility, and contemporary hospitality.",
    start_url: "/",
    display: "browser",
    background_color: "#fdf9f0",
    theme_color: "#000000",
    icons: [
      { src: "/icon.png", sizes: "447x447", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
