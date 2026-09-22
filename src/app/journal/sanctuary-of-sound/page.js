import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "The Sanctuary of Sound — Samsara Group Journal",
  description: "Exploring the intersection of acoustic architecture, deep listening, and the analog revival.",
};

export default function SanctuaryOfSoundPage() {
  return (
    <>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Link
            href="/journal"
            className="mb-8 inline-flex items-center gap-2 text-label-caps-sm uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface"
          >
            &larr; JOURNAL
          </Link>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-terracotta">
            SOUND & ARCHITECTURE
          </span>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface max-w-4xl">
            THE SANCTUARY
            <br />
            OF SOUND
          </h1>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-8">
        <ScrollReveal>
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <img
              src="/ambiencesamsara/DSC08482.webp"
              alt="The Sanctuary of Sound"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 py-16 pb-28">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-8 text-body-lg leading-relaxed text-on-surface-variant">
              Architecture has always been a vessel for sound. From the resonant chambers of ancient temples to the
              vaulted acoustics of cathedrals, the built environment shapes how we hear, and therefore how we
              feel. At Samsara Group, we asked a simple question: what happens when a space is designed not
              for the eye, but for the ear?
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mb-8 text-body-lg leading-relaxed text-on-surface-variant">
              The Sanctuary of Sound began as a speculative project — a listening room carved into the volcanic
              stone of the Kintamani highlands. Every surface was calculated for diffusion: hand-finished basalt
              walls, staggered timber baffles, and a suspended ceiling of woven rattan that softens reflections
              without dulling them. The result is a room that feels alive. A whisper carries. A note lingers.
              Silence itself becomes audible.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <blockquote className="my-16 border-l-2 border-terracotta pl-8">
              <p className="text-headline-sm font-display leading-relaxed text-on-surface">
                &ldquo;Sound is architecture in motion — and architecture is sound made still.&rdquo;
              </p>
            </blockquote>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mb-8 text-body-lg leading-relaxed text-on-surface-variant">
              Within the sanctuary sits our vinyl archive — a curated collection of over three thousand pressings
              spanning Javanese gamelan field recordings, Brazilian tropicalia, Japanese ambient, and forgotten
              European jazz. Each record is played on a custom-built direct-drive system, routed through vacuum
              tube amplification and period-correct horn speakers. The experience is not nostalgia. It is
              precision. It is the sound of sound, unmediated by compression or convenience.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
