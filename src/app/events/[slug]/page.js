import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getEventBySlug, getEvents } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";

function decodeSlug(raw) {
  let value;
  try {
    value = decodeURIComponent(raw);
  } catch {
    value = raw;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : value.replace(/[^a-z0-9-]/gi, "");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(decodeSlug(slug));
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} — Samsara Group Events`,
    description: event.description,
  };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug?.current })).filter(Boolean);
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(decodeSlug(slug));
  if (!event) notFound();

  return (
    <>
      <Header />
      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Link href="/events" className="mb-8 inline-flex items-center gap-2 text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-terracotta transition-colors">← ALL EVENTS</Link>
          <span className="mt-4 mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">{event.date} {event.location && `– ${event.location}`}</span>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">{event.title}</h1>
          {event.category && <p className="mt-4 text-headline-sm font-display uppercase tracking-wide text-on-surface-variant">{event.category}</p>}
        </ScrollReveal>
      </section>

      {event.image && (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            <div className="img-hover w-full aspect-[21/9]">
              <img src={urlFor(event.image).url()} alt={event.title} className="h-full w-full object-cover" />
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ScrollReveal>
              <div className="space-y-12">
                {event.description && (
                  <div>
                    <p className="text-body-md text-on-surface-variant leading-relaxed">{event.description}</p>
                  </div>
                )}
                <div className="border-t border-outline-variant pt-8">
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">DETAILS</h2>
                  <div className="space-y-4">
                    {[
                      ["Date", event.date],
                      ["Time", event.time],
                      ["Location", event.location],
                      ["Capacity", event.capacity],
                      ["Entry", event.entry],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <div key={label} className="flex justify-between border-b border-outline-variant pb-4">
                        <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant">{label}</span>
                        <span className="text-body-md text-on-surface">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-4">
            <ScrollReveal>
              <div className="sticky top-32 bg-primary p-8 text-on-primary">
                <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-primary">RESERVE</h2>
                <form className="space-y-6">
                  <div>
                    <label className="mb-2 block text-label-md uppercase tracking-wider text-on-primary/70">Full Name</label>
                    <input type="text" required className="w-full border-b border-on-primary/30 bg-transparent py-3 text-body-md text-on-primary placeholder:text-on-primary/40 outline-none transition-colors focus:border-on-primary" />
                  </div>
                  <div>
                    <label className="mb-2 block text-label-md uppercase tracking-wider text-on-primary/70">Email</label>
                    <input type="email" required className="w-full border-b border-on-primary/30 bg-transparent py-3 text-body-md text-on-primary placeholder:text-on-primary/40 outline-none transition-colors focus:border-on-primary" />
                  </div>
                  <button type="submit" className="w-full mt-4 bg-on-primary px-8 py-4 text-label-caps-sm uppercase tracking-widest text-primary transition-colors hover:bg-warm-sand">REQUEST INVITATION</button>
                </form>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-3 border border-on-primary/40 px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-on-primary/10"
                  >
                    VISIT
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
