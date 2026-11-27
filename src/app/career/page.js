import { openGraphFor, siteUrl, SITE_URL } from "@/lib/site";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import CareerList from "@/components/CareerList.jsx";
import { getBrandNav } from "@/sanity/lib/brands";
import BrandMarquee from "@/components/BrandMarquee";
import { getCareers, getCareerPage } from "@/sanity/lib/queries";
import { jsonLdHtml } from "@/lib/jsonld";

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
  showBrandStrip: true,
  positionsHeading: "Currently open positions",
  emptyEyebrow: "",
  emptyHeadline: "No open positions right now",
  emptyMessage: "Tidak ada lowongan terbuka di departemen ini saat ini.",
  emptyCtaLabel: "Send us a note",
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
    showBrandStrip: page?.showBrandStrip !== false,
    positionsHeading: page?.positionsHeading || DEFAULT.positionsHeading,
    emptyEyebrow: page?.emptyEyebrow || "",
    emptyHeadline: page?.emptyHeadline || DEFAULT.emptyHeadline,
    emptyMessage: page?.emptyMessage || DEFAULT.emptyMessage,
    emptyCtaLabel: page?.emptyCtaLabel || DEFAULT.emptyCtaLabel,
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
              filter.
            */}
            <div className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-low py-8 lg:py-10">
              <BrandMarquee
                brands={brandNav.all}
                logoClassName="h-8 w-auto object-contain lg:h-10"
                nameClassName="font-display text-lg uppercase tracking-wide text-on-surface lg:text-xl"
                data-cursor="DRAG"
              />
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      {unavailable ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
          <p className="border border-outline-variant p-6 text-body-md text-on-surface-variant">
            Daftar lowongan sedang tidak dapat dimuat. Silakan hubungi kami langsung untuk
            informasi posisi yang terbuka.
          </p>
        </section>
      ) : noOpenPositions ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
          <ScrollReveal>
            <div className="border border-outline-variant bg-surface-container-low px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
              {copy.emptyEyebrow ? (
                <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
                  {copy.emptyEyebrow}
                </span>
              ) : null}
              <h2 className="max-w-3xl font-display text-headline-lg-mobile uppercase leading-[0.95] text-on-surface md:text-headline-lg">
                {copy.emptyHeadline}
              </h2>
              {copy.emptyMessage ? (
                <p className="mt-6 max-w-2xl text-body-md leading-relaxed text-on-surface-variant">
                  {copy.emptyMessage}
                </p>
              ) : null}
              {applyUrl ? (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex items-center justify-center gap-3 rounded-md border border-on-surface px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-on-surface hover:text-surface"
                >
                  {copy.emptyCtaLabel || "Send us a note"}
                </a>
              ) : null}
              {copy.applyNote ? (
                <p className="mt-8 text-body-sm text-on-surface-variant">{copy.applyNote}</p>
              ) : null}
            </div>
          </ScrollReveal>
        </section>
      ) : (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
          <ScrollReveal>
            <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">
              {copy.positionsHeading}
            </h2>
          </ScrollReveal>

          <CareerList
            jobs={jobs}
            applyUrl={applyUrl}
            emptyMessage={copy.emptyMessage}
            applyNote={copy.applyNote}
            defaultPostedAt={defaultPostedAt}
          />
        </section>
      )}

      <Footer />
    </>
  );
}