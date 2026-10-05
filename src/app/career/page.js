import { openGraphFor, siteUrl } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ThemeSetter from "@/components/ThemeSetter";
import CareerList from "@/components/CareerList.jsx";
import { getBrandNav } from "@/sanity/lib/brands";
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

  const copy = {
    eyebrow: page?.eyebrow || DEFAULT.eyebrow,
    title: page?.title || DEFAULT.title,
    intro: page?.intro || DEFAULT.intro,
    theme: page?.theme === "dark" ? "dark" : DEFAULT.theme,
    showBrandStrip: page?.showBrandStrip !== false,
    positionsHeading: page?.positionsHeading || DEFAULT.positionsHeading,
    emptyMessage: page?.emptyMessage || DEFAULT.emptyMessage,
    applyNote: page?.applyNote ?? "",
  };

  const applyUrl = safeUrl(page?.applyUrl) || DEFAULT.applyUrl;

  return (
    <>
      <script
        type="application/ld+json"
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

      {copy.showBrandStrip ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            {/*
              The brand marks are the light/white artwork, so the band is dark. It uses
              the same primary/on-primary tokens as the header so the strip and the nav
              read as one surface.
            */}
            <div className="grid grid-cols-2 gap-6 bg-primary px-6 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
              {brandNav.all.map((brand) => (
                <div key={brand.slug} className="flex flex-col items-center gap-4">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.label}
                      className="h-8 w-auto object-contain brightness-0 invert lg:h-10"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-display text-lg uppercase tracking-wide text-on-primary lg:text-xl">
                      {brand.label}
                    </span>
                  )}
                  {brand.speciality ? (
                    <span className="text-center text-body-sm italic text-on-primary/70">
                      {brand.speciality}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">
            {copy.positionsHeading}
          </h2>
        </ScrollReveal>

        <CareerList
          jobs={jobs}
          applyUrl={applyUrl}
          unavailable={unavailable}
          emptyMessage={copy.emptyMessage}
          applyNote={copy.applyNote}
        />
      </section>

      <Footer />
    </>
  );
}