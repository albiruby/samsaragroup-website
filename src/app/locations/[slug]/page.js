import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import FadeInImage from "@/components/FadeInImage";
import ThemeSetter from "@/components/ThemeSetter";

const locations = {
  canggu: {
    title: "CANGGU",
    tagline: "Coastal living at the edge of the break. Where surf culture meets community, and every evening ends at the fire.",
    image: "/ambiencesamsara/DSC08558.jpg",
    description: "Steps from Batu Bolong. A gathering space for those who ride early and stay late. Open-air, unstructured, alive with salt air and conversation. The center of gravity for our community.",
    details: [
      ["Address", "Jl. Pantai Batu Bolong No. 18, Canggu, Bali"],
      ["Hours", "07:00 – 23:00"],
      ["Phone", "+62 361 844 221"],
      ["Concept", "Coastal community space"],
      ["Focus", "Community, surf, gathering"],
    ],
    atmosphere: "Open walls, salt wind, the hum of a shared table. Day transitions into night without pause. A space built for the community that gathers here. Salt-stained, sun-worn, always open.",
  },
  ubud: {
    title: "UBUD",
    tagline: "Highland refuge among rice terraces and ancient banyan groves. Where nature sets the rhythm.",
    image: "/ambiencesamsara/DSC08527.jpg",
    description: "Nestled in the cultural heart of Bali. A sanctuary for those who seek stillness, surrounded by terraced gardens and open-air pavilions. Every morning begins with ceremony.",
    details: [
      ["Address", "Jl. Raya Ubud No. 88, Ubud, Bali"],
      ["Hours", "06:00 – 22:00"],
      ["Phone", "+62 361 978 888"],
      ["Concept", "Highland cultural retreat"],
      ["Focus", "Nature, ceremony, stillness"],
    ],
    atmosphere: "Morning mist over rice paddies, the sound of gamelan at dusk. Stone pathways wind through tropical gardens. A space where time moves differently.",
  },
  jakarta: {
    title: "JAKARTA",
    tagline: "Urban pulse in the capital. Where the city's energy meets curated calm.",
    image: "/ambiencesamsara/DSC08494.jpg",
    description: "In the heart of the metropolis. A refuge from the urban rush, designed for those who move between ambition and intention. The intersection of culture and commerce.",
    details: [
      ["Address", "Jl. Sudirman No. 123, Jakarta Selatan"],
      ["Hours", "08:00 – 24:00"],
      ["Phone", "+62 21 555 0123"],
      ["Concept", "Urban cultural hub"],
      ["Focus", "Design, music, community"],
    ],
    atmosphere: "Glass and steel softened by warm light. Vinyl spinning in the corner, the murmur of conversation. A space that feels like home in the center of everything.",
  },
};

export function generateStaticParams() {
  return Object.keys(locations).map((slug) => ({ slug }));
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const location = locations[slug];

  if (!location) {
    return (
      <>
        <Header />
        <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
          <h1 className="text-display-md font-display uppercase">Location Not Found</h1>
          <Link href="/locations" className="mt-4 inline-flex items-center gap-2 text-terracotta hover:underline">← Back to Locations</Link>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ThemeSetter theme="light" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Link href="/locations" className="mb-8 inline-flex items-center gap-2 text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-terracotta transition-colors">LOCATIONS</Link>
          <span className="text-on-surface-variant mx-3">/</span>
          <span className="text-label-caps-sm uppercase tracking-[0.2em] text-on-surface">{location.title}</span>
          <h1 className="mt-4 text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">{location.title}</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {location.tagline}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <FadeInImage src={location.image} alt={`${location.title} Location`} className="h-full w-full object-cover" />
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="space-y-12">
                <div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {location.description}
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-8">
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">DETAILS</h2>
                  <div className="space-y-4">
                    {location.details.map(([label, value]) => (
                      <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4">
                        <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">{label}</span>
                        <span className="text-body-md text-on-surface text-right min-w-0">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5">
            <ScrollReveal>
              <div className="space-y-8">
                <div className="border border-outline-variant bg-surface-container-low p-8">
                  <h2 className="mb-4 text-headline-sm font-display uppercase tracking-wide text-on-surface">THE ATMOSPHERE</h2>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {location.atmosphere}
                  </p>
                </div>
                <Link href="/contact" className="inline-flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
                  GET IN TOUCH
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
