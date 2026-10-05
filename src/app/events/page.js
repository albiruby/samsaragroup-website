import { openGraphFor, siteUrl } from "@/lib/site";
import Link from "next/link";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import { getEvents } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { jsonLdHtml } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events — Samsara Group",
  description: "Upcoming gatherings, performances, and curated experiences by Samsara Group.",
  alternates: {
canonical: "/events",
    },
    openGraph: openGraphFor({ path: "/events" }),
  };

export default async function EventsPage() {
  const events = await getEvents();
  const nonce = (await headers()).get("x-nonce");

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Samsara Group Events",
url: siteUrl("/events"),
              itemListElement: events.map((event, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Event",
                name: event.title,
                startDate: event.date,
                location: {
                  "@type": "Place",
                  name: event.location,
                },
                organizer: {
                  "@type": "Organization",
                  name: "Samsara Group",
                },
              },
            })),
          }),
        }}
      />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">UPCOMING</span>
          <TextClipReveal>
            <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">EVENTS</h1>
          </TextClipReveal>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        {events.length === 0 ? (
          <ScrollReveal>
            <p className="text-body-md text-on-surface-variant">No upcoming events at this time.</p>
          </ScrollReveal>
        ) : (
          <div className="space-y-8">
            {events.map((event) => {
              const href = event.link || null;
              const isExternal = Boolean(href);
              const Wrapper = href ? Link : "div";
              const wrapperProps = href
                ? { href, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <ScrollReveal key={event._id}>
                  <Wrapper {...wrapperProps} data-cursor="VIEW" className="block group">
                    <article className="relative overflow-hidden bg-surface-container-low border border-outline-variant transition-colors hover:border-outline">
                      <div className="flex flex-col md:flex-row">
                        <div className="img-hover-strong w-full md:w-2/5 aspect-[16/10] md:aspect-auto md:min-h-[360px]">
                          {event.image && (
                            <img src={urlFor(event.image).url()} alt={event.title} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex w-full md:w-3/5 flex-col justify-center p-8 md:p-12">
                          <div className="mb-4 flex flex-wrap items-center gap-4">
                            <span className="text-label-caps-sm uppercase tracking-[0.2em] text-terracotta">{event.category}</span>
                            {event.date && (
                              <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant">{event.date}</span>
                            )}
                            {event.time && (
                              <span className="text-body-sm text-on-surface-variant/70">{event.time}</span>
                            )}
                          </div>
                          <h2 className="mb-3 text-headline-md md:text-headline-lg font-display uppercase leading-tight text-on-surface">{event.title}</h2>
                          {event.location && (
                            <p className="text-body-sm text-on-surface-variant/70 mb-4">{event.location}</p>
                          )}
                          {event.description && (
                            <p className="text-body-sm text-on-surface-variant leading-relaxed mb-6 max-w-xl">{event.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 mb-6 text-body-sm text-on-surface-variant/70">
                            {event.capacity && (
                              <span>Capacity: {event.capacity}</span>
                            )}
                            {event.entry && (
                              <span>Entry: {event.entry}</span>
                            )}
                          </div>
                          {isExternal && (
                            <div className="flex flex-wrap gap-3">
                              <span className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
                                VISIT
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </Wrapper>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
