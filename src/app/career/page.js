import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ThemeSetter from "@/components/ThemeSetter";
import CareerList from "@/components/CareerList.jsx";
import { getBrandNav } from "@/sanity/lib/brands";
import { getCareers } from "@/sanity/lib/queries";
import { jsonLdHtml } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

const SITE = "Samsara Group";
const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfQUzrgPkm-u9dDYTFzgoWrS-W3R2rslWyAFVo18abRDsFneg/viewform?usp=sf_link";

export const metadata = {
  title: `Career — ${SITE}`,
  description:
    "We're looking for passionate people to join our mission. Open positions across Samsara, Svarga, Acasa, Outpace and Grove.",
  alternates: {
    canonical: "/career",
  },
  openGraph: {
    url: "https://samsaragroup.co.id/career",
  },
};

export default async function CareerPage() {
  const [{ jobs, unavailable }, brandNav] = await Promise.all([getCareers(), getBrandNav()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Open positions",
            url: "https://samsaragroup.co.id/career",
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
                  name: job.brand && job.brand !== "group"
                    ? `${job.brand.charAt(0).toUpperCase()}${job.brand.slice(1)}`
                    : "Samsara Group",
                  sameAs: "https://samsaragroup.co.id",
                },
                ...(job.location ? { jobLocationType: job.location } : {}),
                ...(job.applyUrl || APPLY_URL ? { url: job.applyUrl || APPLY_URL } : {}),
              },
            })),
          }),
        }}
      />
      <ThemeSetter theme="light" />
      <Header />

      <section className="bg-surface pt-28 pb-12 max-w-[1520px] mx-auto px-6 lg:px-10 lg:pt-36">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
            We're hiring
          </span>
          <TextClipReveal>
            <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">
              Be part of our mission
            </h1>
          </TextClipReveal>
          <p className="mt-6 max-w-2xl text-body-md text-on-surface-variant leading-relaxed">
            We&apos;re looking for passionate people to join us on our mission. We value flat
            hierarchies, clear communication, and full ownership and responsibility.
          </p>
        </ScrollReveal>
      </section>

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

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">
            Currently open positions
          </h2>
        </ScrollReveal>

        <CareerList jobs={jobs} applyUrl={APPLY_URL} unavailable={unavailable} />
      </section>

      <Footer />
    </>
  );
}