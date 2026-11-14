import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import ImageParallax from "@/components/ImageParallax";
import LeafletMap from "@/components/LeafletMap";
import MenuGallery from "@/components/MenuGallery";
import BrandActions from "@/components/BrandActions";
import BrandHours from "@/components/BrandHours";
import { sizedUrl } from "@/sanity/lib/image";

/** Gallery accepts a bare image or a galleryItem wrapper. */
function galleryUrls(gallery) {
  return (gallery || [])
    .map((item) => (item && item._type === "galleryItem" ? item.image : item))
    .filter((image) => image?.asset)
    .map((image) => sizedUrl(image, 1600));
}

/** Panels keep their own dimensions so the menu pager can size them correctly. */
function menuPanels(section) {
  return (section?.menuPanels || [])
    .filter((panel) => panel?.src)
    .map((panel) => ({
      key: panel._key,
      src: panel.src,
      alt: panel.tabLabel,
      tabLabel: panel.tabLabel,
      width: panel.width,
      height: panel.height,
    }));
}

/** Shown only when a brand has no menu section yet, instead of leaving a hole. */
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
 * The layout shared by the five established brands: hero, carousel, an optional
 * feature row, a two-column block (copy + specs next to the portrait photo), menu,
 * then location. Every string, image and coordinate comes from the CMS; `config`
 * only supplies the fallback for a field the Studio has not filled yet.
 */
export default function BrandPageView({ world, config }) {
  const name = world?.name || config.name;
  const tagline = world?.tagline || config.tagline;
  const intro = world?.description || config.intro;
  const logoUrl = world?.logo ? sizedUrl(world.logo, 600) : config.logo;

  const gallery = galleryUrls(world?.gallery);
  const heroImages = gallery.length ? gallery : config.gallery;

  const sections = (world?.sections || []).filter(Boolean);
  const specsSection = sections.find((section) => section.type === "specs");
  const featuresSection = sections.find((section) => section.type === "features");
  const menuSection = sections.find((section) => section.type === "menu");
  const mapSection = sections.find((section) => section.type === "map");

  const specs = world?.specifications?.length
    ? world.specifications.map((row) => [row.label, row.value])
    : config.specs;
  const specsHeading = specsSection?.heading || config.specsHeading;

  const hasCoords =
    typeof mapSection?.mapLat === "number" && typeof mapSection?.mapLng === "number";
  const coords = hasCoords
    ? { lat: mapSection.mapLat, lng: mapSection.mapLng }
    : config.coords;

  const address = world?.address || config.address;
  const whatsapp = world?.whatsapp || config.whatsapp;
  const portraitUrl = world?.image ? sizedUrl(world.image, 1100) : config.image;
  const panels = menuPanels(menuSection);

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {world?.heroEyebrow || "BRANDS"}
          </span>
          {logoUrl ? (
            <h1 className="h-12 md:h-16 w-fit">
              <img src={logoUrl} alt={name} className="h-full w-auto" />
            </h1>
          ) : (
            <TextClipReveal>
              <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">
                {world?.heroTitle || name.toUpperCase()}
              </h1>
            </TextClipReveal>
          )}
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {tagline}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <ImageParallax className="w-full">
            <HeroCarousel images={heroImages} alt={name} />
          </ImageParallax>
        </ScrollReveal>
      </section>

      {featuresSection?.features?.length ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            {featuresSection.heading ? (
              <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
                {featuresSection.heading}
              </span>
            ) : null}
            <div className="grid gap-8 border-t border-outline-variant pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuresSection.features
                .filter((card) => card?.title)
                .map((card) => (
                  <div key={card._key || card.title}>
                    <h2 className="mb-3 font-display text-headline-sm uppercase text-on-surface">
                      {card.title}
                    </h2>
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
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="space-y-12">
                <p className="text-body-md text-on-surface-variant leading-relaxed">{intro}</p>

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

                <BrandActions world={world} fallbacks={config.actions} />
              </div>
            </ScrollReveal>
          </div>

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
        </div>
      </section>

      {panels.length ? (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
          <ScrollReveal>
            <TextClipReveal>
              <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
                {menuSection?.heading || "MENU"}
              </h2>
            </TextClipReveal>
            <MenuGallery panels={panels} heading="" />
          </ScrollReveal>
        </section>
      ) : config.menuPlaceholder ? (
        <MenuPlaceholder heading={menuSection?.heading || "MENU"} />
      ) : null}

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <TextClipReveal>
            <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
              {mapSection?.heading || "FIND US"}
            </h2>
          </TextClipReveal>
          <div className="w-full h-[300px] md:h-[400px] border border-outline-variant overflow-hidden">
            <LeafletMap
              lat={coords.lat}
              lng={coords.lng}
              zoom={mapSection?.mapZoom || 16}
              className="w-full h-full"
              label={`Lokasi ${name}${address ? `, ${address}` : ""}`}
            />
          </div>
          <div className="mt-6">
            <p className="text-body-md text-on-surface font-medium">{name}</p>
            <p className="text-body-sm text-on-surface-variant">{tagline}</p>
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

      <Footer />
    </>
  );
}
