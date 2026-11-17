import { openGraphFor, siteUrl, SITE_URL } from "@/lib/site";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ThemeSetter from "@/components/ThemeSetter";
import CareerList from "@/components/CareerList.jsx";
import { getBrandNav } from "@/sanity/lib/brands";
import ScrollMarquee from "@/components/ScrollMarquee";
import { getCareers, getCareerPage } from "@/sanity/lib/queries";
import { jsonLdHtml } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

const SITE = "Samsara Group";

/**
 * Fallbacks for every editable string. They hold the values the page shipped with, so
 * an unreachable or empty CMS renders exactly what it always did.
 */
const DEFAULT = {
  eyebrow: "We're hiring",
  title: "Be part of our mission",
  intro:
    "We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership and responsibility.",
  theme: "light",
  showBrandStrip: true,
  positionsHeading: "Currently open positions",
  emptyHeadline: "No open positions right now",
  emptyMessage: "Tidak ada lowongan terbuka di departemen ini saat ini.",
  applyUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSfQUzrgPkm-u9dDYTFzgoWrS-W3R2rslWyAFVo18abRDsFneg/viewform?usp=sf_link",
  applyNote: "Don't see the right role? Send us a note and we'll keep you in mind.",
  seoTitle: `Career — ${SITE}`,
  seoDescription:
    "We're looking for passionate people to join our mission. Open positions across Samsara, Svarga, Acasa, Outpace and Grove.",
};

/** Only http(s) survives, so a CMS value can never turn Apply into a javascript: link. */
function safeUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

/**
 * One logo tile for the rolling brand strip. The marks come from the CMS (black
 * artwork on a light surface) and fall back to the brand name when missing.
 */
function brandLogo(brand) {
  return (
    <div key={brand.slug} className="logo-marquee-item">
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.label}
          className="h-8 w-auto object-contain lg:h-10"
          loading="lazy"
        />
      ) : (
        <span className="font-display text-lg uppercase tracking-wide text-on-surface lg:text-xl">
          {brand.label}
        </span>
      )}
    </div>
  );
}

export async function generateMetadata() {
  const page = await getCareerPage();
  return {
    title: page?.seoTitle || DEFAULT.seoTitle,
    description: page?.seoDescription || DEFAULT.seoDescription,
    alternates: { canonical: "/career" },
    openGraph: openGraphFor({
        path: "/career",
        title: page?.seoTitle || DEFAULT.seoTitle,
        description: page?.seoDescription || DEFAULT.seoDescription,
      }),
  };
}

export default async function CareerPageRoute() {
  const [page, { jobs, unavailable }, brandNav] = await Promise.all([
    getCareerPage(),
    getCareers(),
    getBrandNav(),
  ]);
  const nonce = (await headers()).get("x-nonce");

  const copy = {
    eyebrow: page?.eyebrow || DEFAULT.eyebrow,
    title: page?.title || DEFAULT.title,
    intro: page?.intro || DEFAULT.intro,
    theme: page?.theme === "dark" ? "dark" : DEFAULT.theme,
    showBrandStrip: page?.showBrandStrip !== false,
    positionsHeading: page?.positionsHeading || DEFAULT.positionsHeading,
    emptyHeadline: page?.emptyHeadline || DEFAULT.emptyHeadline,
    emptyMessage: page?.emptyMessage || DEFAULT.emptyMessage,
    applyNote: page?.applyNote ?? "",
  };

  const applyUrl = safeUrl(page?.applyUrl) || DEFAULT.applyUrl;

  /**
   * The CMS field description says an empty Posted At means "use today's date", so we
   * resolve that here rather than in the client component. This route renders once on
   * the server and the value travels down as a prop, which keeps the date identical
   * across both passes — the component itself never calls Date.
   */
  const defaultPostedAt = new Date().toISOString().slice(0, 10);

  /**
   * True only when the CMS answered and there is genuinely no active vacancy.
   * An unreachable CMS keeps the normal heading so we never claim "no jobs"
   * when we simply could not load them.
   */
  const noOpenPositions = !unavailable && jobs.length === 0;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: copy.positionsHeading,
            url: siteUrl("/career"),
            numberOfItems: jobs.length,
            itemListElement: jobs.map((job, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "JobPosting",
                title: job.title,
                description: job.description || job.summary || "",
                employmentType: job.employmentType?.toUpperCase(),
                ...(job.postedAt ? { datePosted: job.postedAt } : {}),
                hiringOrganization: {
                  "@type": "Organization",
                  name:
                    job.brand && job.brand !== "group"
                      ? `${job.brand.charAt(0).toUpperCase()}${job.brand.slice(1)}`
                      : SITE,
                  sameAs: SITE_URL,
                },
                ...(job.location ? { jobLocationType: job.location } : {}),
                url: safeUrl(job.applyUrl) || applyUrl,
              },
            })),
          }),
        }}
      />
      <ThemeSetter theme={copy.theme} />
      <Header />

      <section className="bg-surface pt-28 pb-12 max-w-[1520px] mx-auto px-6 lg:px-10 lg:pt-36">
        <ScrollReveal>
          {copy.eyebrow ? (
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
              {copy.eyebrow}
            </span>
          ) : null}
          <TextClipReveal>
            <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">
              {copy.title}
            </h1>
          </TextClipReveal>
          {copy.intro ? (
            <p className="mt-6 max-w-2xl text-body-md text-on-surface-variant leading-relaxed">
              {copy.intro}
            </p>
          ) : null}
        </ScrollReveal>
      </section>

      {copy.showBrandStrip && brandNav.all.length ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            {/*
              Same rolling logo band as the footer, on a rounded light panel: the CMS
              logos are the black artwork, so they sit directly on the surface with no
              filter. The second copy exists only to make the loop seamless.
            */}
            <div className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-low py-8 lg:py-10">
              <ScrollMarquee className="logo-marquee-track" baseSpeed={50} data-cursor="DRAG">
                <div className="logo-marquee-content">{brandNav.all.map(brandLogo)}</div>
                <div className="logo-marquee-content" aria-hidden="true">
                  {brandNav.all.map(brandLogo)}
                </div>
              </ScrollMarquee>
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">
            {noOpenPositions ? copy.emptyHeadline : copy.positionsHeading}
          </h2>
        </ScrollReveal>

        <CareerList
          jobs={jobs}
          applyUrl={applyUrl}
          unavailable={unavailable}
          emptyMessage={copy.emptyMessage}
          applyNote={copy.applyNote}
          defaultPostedAt={defaultPostedAt}
        />
      </section>

      <Footer />
    </>
  );
}