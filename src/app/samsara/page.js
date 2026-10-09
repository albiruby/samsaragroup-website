import { openGraphFor } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import LeafletMap from "@/components/LeafletMap";
import TextClipReveal from "@/components/TextClipReveal";
import MenuSection from "@/components/MenuSection";
import { getWorlds } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import BrandActions from "@/components/BrandActions";

const SAMSARA_LINKS = {
  reservation: "https://wa.me/6285281271988",
  menu: "https://drive.google.com/file/d/1inaLAAXyjMp9XQFk59lVd5VZtc0d75ST/view",
  location: "https://maps.app.goo.gl/GbVqgzQfVfmGQkep7",
  maps: "https://maps.app.goo.gl/GbVqgzQfVfmGQkep7",
  instagram: "https://www.instagram.com/samsara.bogor",
};

const ADDRESS = "Jl. Jalak Harupat No.19, Babakan, Bogor Tengah, Kota Bogor, Jawa Barat 16129";

const COORDS = { lat: -6.5938597, lng: 106.8035144 };

/** The CMS drives these; the literals stay as the fallback and the source of truth for the copy. */
const SAMSARA_ACTIONS = [
  { kind: "reservation", label: "RESERVATION", url: SAMSARA_LINKS.reservation },
  { kind: "instagram", url: SAMSARA_LINKS.instagram },
];

/**
 * Served from the CMS so an editor can change the title and description without a
 * deploy. The literals below stay as the fallback and match what Sanity currently
 * holds, so switching to this function does not alter the served metadata.
 */
export async function generateMetadata() {
  let seo = {};
  try {
    const world = (await getWorlds()).find((w) => w.slug?.current === "samsara");
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
      path: "/samsara",
      title: seo.title,
      description: seo.description,
      image: urlFor(seo.image || seo.card || null)?.url,
      alt: seo.brandName,
    });

  return {
    title: seo.title || "Samsara — Samsara Group",
    description: seo.description || "Bogor's first listening space. A symphony of melody and taste — where vinyl spins, Indo-Kolonial flavors unfold, and every frequency is designed.",
    alternates: { canonical: "/samsara" },
    openGraph: og,
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function SamsaraPage() {
  let world = null;
  try {
    const worlds = await getWorlds();
    world = worlds.find((w) => w.slug?.current === "samsara") || null;
  } catch {
    world = null;
  }

  const specs = world?.specifications?.map((s) => [s.label, s.value]) || [
    ["Concept", "Extra Sensory Perception \u2014 sound, taste, sight"],
    ["Listening Space", "Bogor's first \u2014 vinyl library, play your own records"],
    ["Cuisine", "Indo-Kolonial \u2014 Nasi Campur Madura, Bitterballen, Poffertjes"],
    ["Coffee", "Signature with Mikael Jasin, World Barista Champion 2024"],
    ["Heritage", "Dutch-colonial building, 1,400 m\u00B2, beside Kebun Raya Bogor"],
    ["Live Music", "Melodi Samsara \u2014 presented by Melodi Alam"],
  ];

  const map = world?.sections?.find((s) => s.type === "map");
  const coords =
    typeof map?.mapLat === "number" && typeof map?.mapLng === "number"
      ? { lat: map.mapLat, lng: map.mapLng }
      : COORDS;

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {world?.heroEyebrow || "WORLDS"}
          </span>
          <h1 className="h-12 md:h-16 w-fit">
            <img src="/Black Logo Samsara/blackfullsamping.png" alt="Samsara" className="h-full w-auto" />
          </h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "Sound. Food. Culture. A sanctuary where every frequency is designed."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <HeroCarousel
            images={[
              "/ambiencesamsara/DSC08187.webp",
              "/ambiencesamsara/DSC08177.webp",
              "/ambiencesamsara/DSC08930.webp",
              "/ambiencesamsara/DSC08926.webp",
              "/ambiencesamsara/DSC08913.webp",
              "/ambiencesamsara/DSC09006.webp",
              "/ambiencesamsara/DSC08998.webp",
              "/ambiencesamsara/DSC08568.webp",
              "/ambiencesamsara/DSC08420.webp",
              "/ambiencesamsara/DSC08635.webp",
              "/ambiencesamsara/DSC09003.webp",
              "/ambiencesamsara/DSC09354.webp",
            ]}
            alt="Samsara Sanctuary"
          />
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="space-y-12">
                <div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {world?.description || "Housed in a preserved Dutch-colonial building beside the Bogor Botanical Gardens, Samsara is where culinary flavors and musical melodies come together in effortless harmony. Explore our library of vinyl, play a record yourself, and let the room do the rest \u2014 an experience we call Extra Sensory Perception, crafted for the palate and the soul."}
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-8">
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">AT A GLANCE</h2>
                  <div className="space-y-4">
                    {specs.map(([label, value]) => (
                      <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4">
                        <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">{label}</span>
                        <span className="text-body-md text-on-surface min-w-0">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <BrandActions world={world} fallbacks={SAMSARA_ACTIONS} />
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5">
            <ScrollReveal>
              <div className="space-y-8">
                <div className="img-hover w-full aspect-[4/5]">
                  {world?.image ? (
                    <img src={urlFor(world.image).url()} alt="Samsara Interior" className="h-full w-full object-cover" />
                  ) : (
                    <img src="/ambiencesamsara/DSC08177.webp" alt="Samsara Interior" className="h-full w-full object-cover" />
                  )}
                </div>
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
          <MenuSection />
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">FIND US</h2>
          <div className="w-full h-[300px] md:h-[400px] border border-outline-variant overflow-hidden">
            <LeafletMap lat={coords.lat} lng={coords.lng} zoom={16} className="w-full h-full" label={`Lokasi Samsara, ${ADDRESS}`} />
          </div>
          <p className="mt-4 text-body-sm text-on-surface-variant">
            {world?.address || ADDRESS}
          </p>
        </ScrollReveal>
      </section>

      <Footer />
    </>
  );
}
