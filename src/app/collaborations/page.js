import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

import { getCollaborations } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata = {
  title: "Partnerships — Samsara Group",
  description: "Collaborate with makers, growers, and visionaries across the Samsara Group network.",
};

export default async function CollaborationsPage() {
  let collaborations = [];
  try {
    collaborations = await getCollaborations();
  } catch {
    collaborations = [];
  }

  const defaultCollabs = [
    {
      category: "Acoustic Partners",
      title: "CUSTOM HORN ACOUSTICS",
      description: "Bespoke listening instruments hand-carved from reclaimed teak, tuned to our volcanic stone chambers.",
      image: "/ambiencesamsara/DSC08635.jpg",
    },
    {
      category: "Culinary Alliance",
      title: "HIGHLAND FARM COLLECTIVE",
      description: "Direct partnership with highland farmers across Java and Bali. Heirloom varietals, seasonal produce.",
      image: "/ambiencesamsara/DSC08575.jpg",
    },
    {
      category: "Craft Residency",
      title: "VISITING ARTISANS",
      description: "Hosted residencies bringing weavers, ceramicists, and metalworkers into our spaces.",
      image: "/ambiencesamsara/DSC08568.jpg",
    },
  ];

  const displayCollabs = collaborations.length > 0 ? collaborations : defaultCollabs;

  return (
    <div>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">COLLABORATIONS</h1>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="space-y-8">
          {displayCollabs.map((collab, i) => (
            <ScrollReveal key={collab._id || collab.title}>
              <article className="border border-outline-variant bg-surface-container-low overflow-hidden">
                <div className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                  <div className="img-hover w-full md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[400px]">
                    {collab.image ? (
                      <img src={collab.image?.asset ? urlFor(collab.image).url() : collab.image} alt={collab.title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex w-full md:w-1/2 flex-col justify-center p-8 md:p-12">
                    <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-terracotta">{collab.category}</span>
                    <h2 className="mb-4 text-headline-md md:text-headline-lg font-display uppercase leading-tight text-on-surface">{collab.title}</h2>
                    <p className="text-body-sm text-on-surface-variant">{collab.description}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-surface border-t border-outline-variant px-6 lg:px-10 py-16 lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-8 text-headline-md md:text-headline-lg font-display uppercase leading-tight text-on-surface">
              INTERESTED IN<br />COLLABORATING?
            </h2>
            <Link href="/contact" className="inline-flex items-center gap-3 border border-outline px-10 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-surface">
              GET IN TOUCH
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
