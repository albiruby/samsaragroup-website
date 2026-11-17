import { openGraphFor, siteUrl, SITE_URL } from "@/lib/site";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ImageParallax from "@/components/ImageParallax";
import { jsonLdHtml } from "@/lib/jsonld";
import { getAboutPage } from "@/sanity/lib/queries";
import { sizedUrl } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

/**
 * Fallbacks for every string and image the About page renders. An empty field in
 * the Studio, or a CMS that cannot be reached, falls back to these rather than
 * leaving a gap in the page.
 */
const ABOUT_DEFAULTS = {
  eyebrow: "ABOUT US",
  titleLine1: "MANY IDENTITIES,",
  titleLine2: "ONE STANDARD.",
  intro: [
    "Samsara Group is a lifestyle and hospitality group that develops and operates distinct destination concepts across Indonesia, from full-service dining and heritage restaurants to resort stays, wellness cafés, and neighborhood coffee.",
    "Each concept carries its own name, its own character, and its own standard — together forming a single philosophy of intentional living.",
  ],
  heroImageUrl: "/ASSETS-SAMSARA/ambience/DSC08913.webp",
  heroImageAlt: "Samsara Group",
  visionEyebrow: "VISION",
  visionHeading: "A PLACE FOR EVERY TURN OF LIFE",
  visionBody:
    "Life moves in cycles, and so do the places we return to. Our vision is to build distinctly Indonesian destinations for every moment along the way, each with its own character, all made with the same care.",
  philosophyEyebrow: "PHILOSOPHY",
  philosophyHeading: "APPROACH & PRINCIPLES",
  philosophy: [
    {
      title: "ROOTS",
      body: "Same concept, local accent. Every location keeps its brand's soul while drawing from the city it calls home.",
    },
    {
      title: "CHARACTER",
      body: "No two of our places are alike. Each concept is given its own identity, its own voice, and its own reason to exist.",
    },
    {
      title: "CRAFT",
      body: "Every detail matters, from the cup to the ceiling. We pursue mastery in what we make and how we serve.",
    },
    {
      title: "RITUAL",
      body: "We design around the moments people repeat: the morning run, the long dinner, the weekend away, the family gathering.",
    },
    {
      title: "COLLABORATION",
      body: "We open our places to chefs, artists, musicians, baristas, makers, even fellow F&B brands. The best experiences we create are rarely made alone.",
    },
    {
      title: "RETURN",
      body: "True to the cycle our name comes from, we build for the second visit, not just the first. Places made to last, and to come back to.",
    },
  ],
};

import { pick as isi } from "@/lib/pick";
const isiArray = (nilai, bawaan) =>
  Array.isArray(nilai) && nilai.filter((x) => typeof x === "string" && x.trim()).length
    ? nilai.filter((x) => typeof x === "string" && x.trim())
    : bawaan;

/** Exactly six cards, because the Studio validates `philosophy.length == 6`. */
const isiPhilosophy = (nilai, bawaan) => {
  const cleaned = Array.isArray(nilai)
    ? nilai.filter((c) => c?.title && c?.body)
    : [];
  return cleaned.length === 6 ? cleaned : bawaan;
};

export async function generateMetadata() {
  const doc = await getAboutPage();
  const title = isi(doc?.seoTitle, "About — Samsara Group");
  const description = isi(
    doc?.seoDescription,
    "Samsara Group is a lifestyle and hospitality group developing and operating distinct destination concepts across Indonesia — from full-service dining and heritage restaurants to resort stays, wellness cafes, and neighborhood coffee."
  );
  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: openGraphFor({ path: "/about", title, description }),
  };
}

export default async function AboutPage() {
  const nonce = (await headers()).get("x-nonce");
  const doc = await getAboutPage();

  const eyebrow = isi(doc?.eyebrow, ABOUT_DEFAULTS.eyebrow);
  const titleLine1 = isi(doc?.titleLine1, ABOUT_DEFAULTS.titleLine1);
  const titleLine2 = isi(doc?.titleLine2, ABOUT_DEFAULTS.titleLine2);
  const intro = isiArray(doc?.intro, ABOUT_DEFAULTS.intro);
  const heroImageUrl = doc?.heroImage
    ? sizedUrl(doc.heroImage, 1600)
    : ABOUT_DEFAULTS.heroImageUrl;
  const heroImageAlt = isi(doc?.heroImageAlt, ABOUT_DEFAULTS.heroImageAlt);

  const visionEyebrow = isi(doc?.visionEyebrow, ABOUT_DEFAULTS.visionEyebrow);
  const visionHeading = isi(doc?.visionHeading, ABOUT_DEFAULTS.visionHeading);
  const visionBody = isi(doc?.visionBody, ABOUT_DEFAULTS.visionBody);

  const philosophyEyebrow = isi(doc?.philosophyEyebrow, ABOUT_DEFAULTS.philosophyEyebrow);
  const philosophyHeading = isi(doc?.philosophyHeading, ABOUT_DEFAULTS.philosophyHeading);
  const philosophy = isiPhilosophy(doc?.philosophy, ABOUT_DEFAULTS.philosophy);

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Samsara Group",
            "url": siteUrl("/about"),
            mainEntity: {
              "@type": "Organization",
              name: "Samsara Group",
              "url": SITE_URL,
              description:
                "A lifestyle and hospitality group developing and operating distinct destination concepts across Indonesia.",
            },
          }),
        }}
      />
      <Header />

      {/* ── About Hero ── */}
      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ImageParallax className="img-hover h-[400px] lg:h-[520px]">
              <img src={heroImageUrl} alt={heroImageAlt} className="h-full w-full object-cover" />
            </ImageParallax>
            <div>
              <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">{eyebrow}</span>
              <TextClipReveal>
                <h1 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight mb-6 text-on-surface">
                  {titleLine1}<br />{titleLine2}
                </h1>
              </TextClipReveal>
              {intro.map((paragraph, i) => (
                <p key={i} className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Vision ── */}
      <section className="bg-surface-container-low w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">{visionEyebrow}</span>
            <TextClipReveal>
              <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-8 text-on-surface max-w-3xl">
                {visionHeading}
              </h2>
            </TextClipReveal>
            <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
              {visionBody}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="bg-surface w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">{philosophyEyebrow}</span>
            <TextClipReveal>
              <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-12 text-on-surface">
                {philosophyHeading}
              </h2>
            </TextClipReveal>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant">
            {philosophy.map((item) => (
              <div
                key={item.title}
                className="group card-hover bg-surface-container-low p-5 lg:p-6 hover:bg-surface transition-colors"
              >
                <h3 className="mb-2 font-display text-headline-sm uppercase text-on-surface group-hover:text-terracotta transition-colors">
                  {item.title}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
