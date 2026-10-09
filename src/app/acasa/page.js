import { openGraphFor } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ImageParallax from "@/components/ImageParallax";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import LeafletMap from "@/components/LeafletMap";
import ZoomableImage from "@/components/ZoomableImage";
import { getWorlds } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import BrandActions from "@/components/BrandActions";

export const dynamic = "force-dynamic";

const ACASA_COORDS = { lat: -6.6167, lng: 106.8500 };

const ACASA_INSTAGRAM = "https://www.instagram.com/acasa.samsara";
const ACASA_CONTACT = {
  whatsapp: "0811-8888-7828",
  padelWa: "0853-8507-4709",
  address: "Jl. Raya Pertanian, Bendungan, Kec. Ciawi, Kab. Bogor, Jawa Barat 16720",
};

/** The CMS drives these; the literals stay as the fallback and the source of truth for the copy. */
const ACASA_ACTIONS = [
  { kind: "padel", label: "RESERVE PADEL", url: "https://ayo.co.id/v/acasa-padel" },
  {
    kind: "receptionist",
    label: "RECEPTIONIST",
    url: "https://api.whatsapp.com/send/?phone=6281188887828&type=phone_number&app_absent=0",
  },
  {
    kind: "roomrate",
    label: "ROOM RATE",
    url: "https://drive.google.com/drive/folders/1pqOn9pi5vwqoGfx_6SWjTt8TE_1H4ASi",
  },
  { kind: "instagram", url: ACASA_INSTAGRAM },
];

/**
 * Served from the CMS so an editor can change the title and description without a
 * deploy. The literals below stay as the fallback and match what Sanity currently
 * holds, so switching to this function does not alter the served metadata.
 */
export async function generateMetadata() {
  let seo = {};
  try {
    const world = (await getWorlds()).find((w) => w.slug?.current === "acasa");
    seo = {
      title: world?.seoTitle,
      description: world?.seoDescription,
      image: world?.socialImage,
        card: world?.image,
        brandName: world?.name,
      noIndex: world?.noIndex === true,
    };
  } catch {
    seo = {};
  }

const og = openGraphFor({
      path: "/acasa",
      title: seo.title,
      description: seo.description,
      image: urlFor(seo.image || seo.card || null)?.url,
      alt: seo.brandName,
    });

  return {
    title: seo.title || "Acasa — Samsara Group",
    description: seo.description || "A Sanctuary of Refined Living. Resto, Cottages, and Padel — one place, many moments, in the hills of Ciawi, Bogor.",
    alternates: { canonical: "/acasa" },
    openGraph: og,
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function AcasaPage() {
  const worlds = await getWorlds();
  const world = worlds.find((w) => w.slug?.current === "acasa");

  const offerings = world?.specifications?.map((s) => [s.label, s.value]) || [
    ["Cottages", "20 rooms — pool, WiFi, 24hr reception, smart TV"],
    ["Acasa Padel", "2 courts — Rp200,000/session, hot shower, locker rooms"],
    ["Restaurant", "Rp25k–95k — Weekdays 09–23, Weekend 08–23"],
    ["Event Space", "Ballroom & garden — from intimate gatherings to grand celebrations"],
    ["Location", "Ciawi, Bogor — 5 min from Vimala Hills, 6 min from Kuntum Farmfield"],
    ["Rating", "Google Hotels 4.9 (169 reviews) · tiket.com 5.0"],
  ];

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">WORLDS</span>
          <h1 className="h-12 md:h-16 w-fit">
            <img src="/assetacasa/logoacasahitam.webp" alt="Acasa" className="h-full w-auto" />
          </h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "A Sanctuary of Refined Living — Resto, Cottages, Padel."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <ImageParallax className="w-full">
            <HeroCarousel
            images={
              world?.gallery?.length
                ? world.gallery.map((g) => urlFor(g).url())
                : [
                    "/assetacasa/ADR-06545.webp",
                    "/assetacasa/ADR-06529.webp",
                    "/assetacasa/ADR-06507.webp",
                    "/assetacasa/ADR-06480.webp",
                    "/assetacasa/ADR-06474.webp",
                    "/assetacasa/ADR-06468.webp",
                    "/assetacasa/ADR-06368.webp",
                    "/assetacasa/ADR-06325.webp",
                    "/assetacasa/ADR-06293.webp",
                    "/assetacasa/ADR-06254.webp",
                    "/assetacasa/ADR-06504.webp",
                    "/assetacasa/ADR-06514.webp",
                  ]
            }
            alt="Acasa Resort"
          />
          </ImageParallax>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="space-y-12">
                <div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {world?.description || "Where architecture holds stories, where every table gathers laughter, where mornings begin softly and evenings glow with warmth. From quiet stays to meaningful celebrations, every detail is thoughtfully crafted — from comfortable cottages and refreshing pool days to padel games and family meals at the restaurant. Welcome to Acasa."}
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-8">
                  <TextClipReveal>
                    <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">OFFERINGS</h2>
                  </TextClipReveal>
                  <div className="space-y-4">
                    {offerings.map(([label, value]) => (
                      <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4">
                        <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">{label}</span>
                        <span className="text-body-md text-on-surface min-w-0">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <BrandActions world={world} fallbacks={ACASA_ACTIONS} />
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5">
            <ScrollReveal>
              <div className="space-y-8">
                <ImageParallax className="img-hover w-full aspect-[4/5]">
                  <img
                    src="/assetacasa/open-hour-acasa.webp"
                    alt="Acasa opening hours"
                    className="h-full w-full object-cover"
                  />
                </ImageParallax>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <TextClipReveal>
            <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">MENU</h2>
          </TextClipReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1100px] mx-auto">
            <div>
              <p className="mb-3 text-label-caps-sm uppercase tracking-widest text-on-surface-variant">Food</p>
              <div className="border border-outline-variant overflow-hidden">
                <ZoomableImage src="/assetacasa/acasamenufood.webp" alt="Acasa Food Menu" className="w-full h-auto" />
              </div>
            </div>
            <div>
              <p className="mb-3 text-label-caps-sm uppercase tracking-widest text-on-surface-variant">Beverages</p>
              <div className="border border-outline-variant overflow-hidden">
                <ZoomableImage src="/assetacasa/acasamenubeverages.webp" alt="Acasa Beverages Menu" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <TextClipReveal>
            <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">FIND US</h2>
          </TextClipReveal>
          <div className="w-full h-[300px] md:h-[400px] border border-outline-variant overflow-hidden">
            <LeafletMap lat={ACASA_COORDS.lat} lng={ACASA_COORDS.lng} zoom={16} className="w-full h-full" label="Lokasi Acasa, Ciawi, Bogor" />
          </div>
          <div className="mt-6">
            <p className="text-body-md text-on-surface font-medium">Acasa by Samsara</p>
            <p className="text-body-sm text-on-surface-variant">{world?.address || ACASA_CONTACT.address}</p>
            <p className="text-body-sm text-on-surface-variant">Cottage & Stay: {ACASA_CONTACT.whatsapp}</p>
            <p className="text-body-sm text-on-surface-variant">Padel: {ACASA_CONTACT.padelWa}</p>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </>
  );
}
