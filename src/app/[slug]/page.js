import { openGraphFor, ctaLabel, safeUrl } from "@/lib/site";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import LeafletMap from "@/components/LeafletMap";
import ImageParallax from "@/components/ImageParallax";
import InstagramLink from "@/components/InstagramLink";
import MenuGallery from "@/components/MenuGallery";
import { getWorldBySlug } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

const SITE = "Samsara Group";

/**
 * Renders one brand from CMS data alone. The five established brands keep their
 * hand-tuned pages; this template covers every brand created from here on, so a
 * new brand needs content in Sanity and nothing else.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const world = await getWorldBySlug(slug);
  if (!world) return { title: SITE };

  const name = world.name || slug;
  return {
    title: world.seoTitle || `${name} — ${SITE}`,
    description: world.seoDescription || world.tagline || world.description || "",
    alternates: { canonical: `/${slug}` },
    openGraph: openGraphFor({
      path: `/${slug}`,
        title: world.seoTitle || `${name} — ${SITE}`,
        description: world.seoDescription || world.tagline || world.description || "",
        image: urlFor(world.socialImage || world.image || null)?.url,
        alt: world.name,
      }),
    ...(world.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

function galleryUrls(world) {
  return (world.gallery || [])
    .map((item) => {
      // gallery accepts a bare image or a galleryItem object
      const ref = item && item._type === "galleryItem" ? item.image : item;
      if (!ref?.asset) return null;
      return { src: urlFor(ref).url(), alt: item?.alt || world.name || "" };
    })
    .filter(Boolean);
}

function panelsOf(section, world) {
  return (section.menuPanels || [])
    .filter((p) => p.src)
    .map((p) => ({
      key: p._key,
      src: p.src,
      alt: p.tabLabel || `${world.name} menu`,
      tabLabel: p.tabLabel,
      width: p.width,
      height: p.height,
    }));
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const world = await getWorldBySlug(slug);

  if (!world || world.status !== "active" || world.featured === false) notFound();

  const name = world.name || slug;
  const heroImages = galleryUrls(world);
  const sections = (world.sections || []).filter(Boolean);

  const ctaByKind = Object.fromEntries((world.ctas || []).map((c) => [c.kind, c]));

  return (
    <>
      <ThemeSetter theme={world.theme === "light" ? "light" : "dark"} />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {world.heroEyebrow || "WORLDS"}
          </span>
          {world.logo ? (
            <h1 className="h-12 md:h-16 w-fit">
              <img src={urlFor(world.logo).url()} alt={name} className="h-full w-auto" />
            </h1>
          ) : (
            <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">
              {world.heroTitle || name}
            </h1>
          )}
          {world.tagline ? (
            <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
              {world.tagline}
            </p>
          ) : null}
          {world.heroIntro ? (
            <p className="mt-4 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
              {world.heroIntro}
            </p>
          ) : null}
        </ScrollReveal>
      </section>

      {heroImages.length > 0 ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            <ImageParallax className="w-full">
              <HeroCarousel images={heroImages.map((i) => i.src)} alt={name} />
            </ImageParallax>
          </ScrollReveal>
        </section>
      ) : null}

      {sections.map((section) => {
        const key = section._key || section.type;

        if (section.type === "text") {
          if (!section.body) return null;
          return (
            <section key={key} className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
              <ScrollReveal>
                <div className="max-w-3xl">
                  {section.heading ? (
                    <TextClipReveal>
                      <h2 className="mb-4 text-headline-sm font-display uppercase tracking-wide text-on-surface">
                        {section.heading}
                      </h2>
                    </TextClipReveal>
                  ) : null}
                  <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>
                </div>
              </ScrollReveal>
            </section>
          );
        }

        if (section.type === "specs") {
          const rows = (section.specifications || []).filter((r) => r?.label);
          if (!rows.length) return null;
          return (
            <section key={key} className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
              <ScrollReveal>
                <div className="border-t border-outline-variant pt-8 max-w-3xl">
                  {section.heading ? (
                    <TextClipReveal>
                      <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
                        {section.heading}
                      </h2>
                    </TextClipReveal>
                  ) : null}
                  <div className="space-y-4">
                    {rows.map((row) => (
                      <div
                        key={row._key || row.label}
                        className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4"
                      >
                        <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">
                          {row.label}
                        </span>
                        <span className="text-body-md text-on-surface min-w-0">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </section>
          );
        }

        if (section.type === "features") {
          const cards = (section.features || []).filter((f) => f?.title);
          if (!cards.length) return null;
          return (
            <section key={key} className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
              <ScrollReveal>
                {section.heading ? (
                  <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
                    {section.heading}
                  </span>
                ) : null}
                <div className="grid gap-8 border-t border-outline-variant pt-8 sm:grid-cols-2 lg:grid-cols-4">
                  {cards.map((card) => (
                    <div key={card._key || card.title}>
                      <h2 className="mb-3 font-display text-headline-sm uppercase text-on-surface">
                        {card.title}
                      </h2>
                      {card.copy ? (
                        <p className="text-body-sm text-on-surface-variant leading-relaxed">{card.copy}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          );
        }

        if (section.type === "menu") {
          const panels = panelsOf(section, world);
          if (!panels.length) return null;
          return (
            <section key={key} className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
              <ScrollReveal>
                <MenuGallery panels={panels} heading={section.heading || world.menuHeading || "MENU"} />
              </ScrollReveal>
            </section>
          );
        }

        if (section.type === "map") {
          const hasCoords = typeof section.mapLat === "number" && typeof section.mapLng === "number";
          if (!hasCoords) return null;
          return (
            <section key={key} className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
              <ScrollReveal>
                {section.heading ? (
                  <TextClipReveal>
                    <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
                      {section.heading}
                    </h2>
                  </TextClipReveal>
                ) : null}
                <div className="w-full h-[300px] md:h-[400px] border border-outline-variant overflow-hidden">
                  <LeafletMap
                    lat={section.mapLat}
                    lng={section.mapLng}
                    zoom={section.mapZoom || 16}
                    className="w-full h-full"
                    label={`Lokasi ${world.name}`}
                  />
                </div>
                {world.address ? (
                  <p className="mt-4 text-body-sm text-on-surface-variant">{world.address}</p>
                ) : null}
              </ScrollReveal>
            </section>
          );
        }

        return null;
      })}

      {world.image ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            <div className="img-hover w-full max-w-2xl aspect-[4/5]">
              <img
                src={urlFor(world.image).url()}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      {(Object.keys(ctaByKind).length > 0 || world.instagramUrl) && (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {(world.ctas || [])
                .filter((cta) => safeUrl(cta.url))
                .map((cta) => (
                <a
                  key={cta._key || cta.kind}
                  href={safeUrl(cta.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
                >
                  {ctaLabel(cta)}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 6h10M7 2l4 4-4 4" />
                  </svg>
                </a>
              ))}
            </div>
            {world.instagramUrl ? (
              <div className="mt-3">
                <InstagramLink href={world.instagramUrl} full />
              </div>
            ) : null}
          </ScrollReveal>
        </section>
      )}

      <Footer />
    </>
  );
}