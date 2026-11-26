import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import HeroCarousel from "@/components/HeroCarousel";
import ImageParallax from "@/components/ImageParallax";
import LeafletMap from "@/components/LeafletMap";
import MenuGallery from "@/components/MenuGallery";
import BrandActions from "@/components/BrandActions";
import BrandHours from "@/components/BrandHours";
import { ogImageUrl, sizedUrl } from "@/sanity/lib/image";
import { jsonLdHtml } from "@/lib/jsonld";
import { siteUrl } from "@/lib/site";

/**
 * Gallery accepts a bare image or a galleryItem wrapper. The wrapper's alt text
 * is kept, because a slide is an image and needs its own description; the old
 * code collapsed both shapes to a URL and lost it.
 */
function galleryItems(gallery) {
  return (gallery || [])
    .map((item) => {
      if (item && item._type === "galleryItem") {
        return item.image?.asset
          ? { src: sizedUrl(item.image, 1600), alt: item.alt || null }
          : null;
      }
      return item?.asset ? { src: sizedUrl(item, 1600), alt: null } : null;
    })
    .filter(Boolean);
}

/** Panels keep their own dimensions so the menu pager can size them correctly. */
function menuPanels(panels) {
  return (panels || [])
    .filter((panel) => panel?.src)
    .map((panel) => ({
      key: panel._key,
      src: panel.src,
      alt: panel.tabLabel,
      tabLabel: panel.tabLabel,
    }));
}

/** Shown only when a brand has no menu yet, instead of leaving a hole. */
function MenuPlaceholder({ heading }) {
  return (
    <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
      <ScrollReveal>
        <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
          {heading}
        </h2>
        <div className="flex min-h-[180px] items-center justify-center border border-dashed border-outline-variant bg-surface-container-low">
          <p className="text-body-sm uppercase tracking-[0.15em] text-on-surface-variant">
            Menu coming soon
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

/**
 * Structured data type. The CMS field is authoritative; the slug map is only a
 * fallback for a document saved before that field existed. An explicit "none"
 * is respected so an editor can switch LocalBusiness off.
 */
const LOCAL_BUSINESS_TYPES = {
  samsara: "Restaurant",
  svarga: "Restaurant",
  acasa: "Resort",
};

function localBusinessSchema({ world, config, name, address, whatsapp, coords }) {
  const slug = config?.slug || world?.slug?.current;
  const configured = world?.localBusinessType;
  const type =
    configured === undefined || configured === null || configured === ""
      ? LOCAL_BUSINESS_TYPES[slug]
      : configured === "none"
        ? null
        : configured;
  if (!type || (!address && !whatsapp)) return null;

  const url = siteUrl(`/${slug}`);
  const image =
    ogImageUrl(world?.socialImage || world?.image) ||
    (config?.image ? siteUrl(config.image) : undefined);

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#business`,
    name,
    url,
    ...(image ? { image } : {}),
    ...(whatsapp ? { telephone: whatsapp } : {}),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address,
            addressCountry: "ID",
          },
        }
      : {}),
    ...(coords
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: coords.lat,
            longitude: coords.lng,
          },
        }
      : {}),
    ...(world?.instagramUrl ? { sameAs: [world.instagramUrl] } : {}),
    parentOrganization: {
      "@type": "Organization",
      name: "Samsara Group",
      url: siteUrl("/"),
    },
  };
}

/**
 * The layout shared by every brand page: hero, carousel, an optional feature row,
 * a two-column block (copy + specs next to the portrait photo), menu, then
 * location. Every string, image and coordinate comes from the CMS. `config` only
 * supplies the fallback for a field the Studio has not filled yet, and is
 * optional so a brand created purely from the CMS can use the same layout.
 */
export default function BrandPageView({ world, config = {} }) {
  const name = world?.name || config.name || "Brand";
  const h1Text = world?.heroTitle || name;
  const tagline = world?.tagline || config.tagline || "";
  const intro = world?.description || config.intro || "";
  const logoUrl = world?.logo ? sizedUrl(world.logo, 600) : config.logo || null;

  const gallery = galleryItems(world?.gallery);
  const heroImages = gallery.length ? gallery : config.gallery || [];

  const specs = world?.specifications?.length
    ? world.specifications.map((row) => [row.label, row.value])
    : config.specs || [];
  const specsHeading = world?.specsHeading || config.specsHeading || "SPECIFICATIONS";
  const features = (world?.features || []).filter((card) => card?.title);
  const featuresHeading = world?.featuresHeading || "";

  const hasCoords =
    typeof world?.mapLat === "number" && typeof world?.mapLng === "number";
  const coords = hasCoords
    ? { lat: world.mapLat, lng: world.mapLng }
    : config.coords || null;

  const address = world?.address || config.address || null;
  const whatsapp = world?.whatsapp || config.whatsapp || null;
  const portraitUrl = world?.image ? sizedUrl(world.image, 1100) : config.image || null;
  const panels = menuPanels(world?.menuPanels);
  const businessSchema = localBusinessSchema({
    world,
    config,
    name,
    address,
    whatsapp,
    coords,
  });

  const hasLocation = Boolean(coords || address || whatsapp || (world?.hours || []).length);

  return (
    <>
      {businessSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(businessSchema) }}
        />
      ) : null}
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {world?.heroEyebrow || "BRANDS"}
          </span>
          {logoUrl ? (
            <h1 className="h-12 md:h-16 w-fit">
              <span className="sr-only">{h1Text}</span>
              <img src={logoUrl} alt="" aria-hidden="true" className="h-full w-auto" />
            </h1>
          ) : (
            <TextClipReveal>
              <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">
                {world?.heroTitle || name.toUpperCase()}
              </h1>
            </TextClipReveal>
          )}
          {tagline ? (
            <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
              {tagline}
            </p>
          ) : null}
        </ScrollReveal>
      </section>

      {heroImages.length ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            <ImageParallax className="w-full">
              <HeroCarousel images={heroImages} alt={name} />
            </ImageParallax>
          </ScrollReveal>
        </section>
      ) : null}

      {features.length ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            {featuresHeading ? (
              <h2 className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
                {featuresHeading}
              </h2>
            ) : null}
            <div className="grid gap-8 border-t border-outline-variant pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((card) => (
                <div key={card._key || card.title}>
                  <h3 className="mb-3 font-display text-headline-sm uppercase text-on-surface">
                    {card.title}
                  </h3>
                  {card.copy ? (
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {card.copy}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className={`grid gap-8 lg:gap-16 ${portraitUrl ? "lg:grid-cols-12" : ""}`}>
          <div className={portraitUrl ? "lg:col-span-7" : ""}>
            <ScrollReveal>
              <div className="space-y-12">
                {intro ? (
                  <p className="text-body-md text-on-surface-variant leading-relaxed">{intro}</p>
                ) : null}

                {specs.length ? (
                  <div className="border-t border-outline-variant pt-8">
                    <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
                      {specsHeading}
                    </h2>
                    <div className="space-y-4">
                      {specs.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4"
                        >
                          <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">
                            {label}
                          </span>
                          <span className="text-body-md text-on-surface min-w-0">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <BrandActions world={world} fallbacks={config.actions || []} />
              </div>
            </ScrollReveal>
          </div>

          {portraitUrl ? (
            <div className="lg:col-span-5">
              <ScrollReveal>
                <div className="img-hover w-full aspect-[4/5]">
                  <img
                    src={portraitUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </ScrollReveal>
            </div>
          ) : null}
        </div>
      </section>

      {panels.length ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
          <ScrollReveal>
            <TextClipReveal>
              <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
                {world?.menuHeading || "MENU"}
              </h2>
            </TextClipReveal>
            <MenuGallery panels={panels} heading="" />
          </ScrollReveal>
        </section>
      ) : config.menuPlaceholder ? (
        <MenuPlaceholder heading={world?.menuHeading || "MENU"} />
      ) : null}

      {hasLocation ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
          <ScrollReveal>
            <TextClipReveal>
              <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
                {world?.mapHeading || "FIND US"}
              </h2>
            </TextClipReveal>
            {coords ? (
              <div className="w-full h-[300px] md:h-[400px] border border-outline-variant overflow-hidden">
                <LeafletMap
                  lat={coords.lat}
                  lng={coords.lng}
                  zoom={world?.mapZoom || 16}
                  className="w-full h-full"
                  label={`Lokasi ${name}${address ? `, ${address}` : ""}`}
                />
              </div>
            ) : null}
            <div className="mt-6">
              <p className="text-body-md text-on-surface font-medium">{name}</p>
              {tagline ? <p className="text-body-sm text-on-surface-variant">{tagline}</p> : null}
              {address ? (
                <p className="text-body-sm text-on-surface-variant">{address}</p>
              ) : null}
              {whatsapp ? (
                <p className="text-body-sm text-on-surface-variant">WhatsApp: {whatsapp}</p>
              ) : null}
              <BrandHours hours={world?.hours} className="mt-4" />
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      <Footer />
    </>
  );
}
