import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getLocations } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata = {
  title: "Locations — Samsara Group",
  description: "Our destinations across Bali and Jakarta.",
};

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">LOCATIONS</h1>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        {locations.length === 0 ? (
          <ScrollReveal>
            <p className="text-body-md text-on-surface-variant">No locations yet.</p>
          </ScrollReveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {locations.map((location) => (
              <ScrollReveal key={location._id}>
                <article className="border border-outline-variant bg-surface-container-low overflow-hidden h-full flex flex-col">
                  <div className="img-hover aspect-[16/10]">
                    {location.image && (
                      <img src={urlFor(location.image).url()} alt={location.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <span className="text-label-caps-sm uppercase tracking-[0.2em] text-terracotta">{location.region}</span>
                      <h2 className="mt-2 text-headline-sm font-display uppercase leading-tight text-on-surface">{location.name}</h2>
                    </div>
                    <div className="space-y-1 text-body-sm text-on-surface-variant border-t border-outline-variant pt-4 mb-4 flex-1">
                      <p>{location.address}</p>
                      {location.phone && <p>{location.phone}</p>}
                      {location.hours && <p>{location.hours}</p>}
                    </div>
                    {location.slug?.current ? (
                      <Link href={`/${location.slug.current}`} className="inline-flex w-full items-center justify-center gap-3 border border-on-surface/20 px-6 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-on-primary">
                        EXPLORE
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                      </Link>
                    ) : (
                      <span className="inline-flex w-full items-center justify-center gap-3 border border-on-surface/20 px-6 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface-variant">COMING SOON</span>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
