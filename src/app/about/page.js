import { openGraphFor, siteUrl, SITE_URL } from "@/lib/site";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ImageParallax from "@/components/ImageParallax";
import { jsonLdHtml } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About — Samsara Group",
  description: "Samsara Group is a lifestyle and hospitality group developing and operating distinct destination concepts across Indonesia — from full-service dining and heritage restaurants to resort stays, wellness cafes, and neighborhood coffee.",
  alternates: {
canonical: "/about",
    },
    openGraph: openGraphFor({ path: "/about" }),
  };

export default async function AboutPage() {
  const nonce = (await headers()).get("x-nonce");

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Samsara Group",
url: siteUrl("/about"),
              mainEntity: {
              "@type": "Organization",
              name: "Samsara Group",
              url: SITE_URL,
              description:
                "A lifestyle and hospitality group developing and operating distinct destination concepts across Indonesia.",
            },
          }),
        }}
      />
      <Header />

      {/* ── About Hero ── */}
      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ImageParallax className="img-hover h-[400px] lg:h-[520px]">
              <img src="/ambiencesamsara/DSC08913.webp" alt="Samsara Group" className="h-full w-full object-cover" />
            </ImageParallax>
            <div>
              <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">ABOUT US</span>
              <TextClipReveal>
                <h1 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight mb-6 text-on-surface">
                  MANY IDENTITIES,<br />ONE STANDARD.
                </h1>
              </TextClipReveal>
              <p className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-6">
                Samsara Group is a lifestyle and hospitality group that develops and operates distinct destination concepts across Indonesia, from full-service dining and heritage restaurants to resort stays, wellness cafés, and neighborhood coffee.
              </p>
              <p className="font-body text-body-lg text-on-surface-variant leading-relaxed">
                Each concept carries its own name, its own character, and its own standard — together forming a single philosophy of intentional living.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Vision ── */}
      <section className="bg-surface-container-low w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">VISION</span>
            <TextClipReveal>
              <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-8 text-on-surface max-w-3xl">
                A PLACE FOR EVERY TURN OF LIFE
              </h2>
            </TextClipReveal>
            <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Life moves in cycles, and so do the places we return to. Our vision is to build distinctly Indonesian destinations for every moment along the way, each with its own character, all made with the same care.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="bg-surface w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">PHILOSOPHY</span>
            <TextClipReveal>
              <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-12 text-on-surface">
                APPROACH & PRINCIPLES
              </h2>
            </TextClipReveal>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant">
            {[
              { title: "ROOTS", desc: "Same concept, local accent. Every location keeps its brand's soul while drawing from the city it calls home." },
              { title: "CHARACTER", desc: "No two of our places are alike. Each concept is given its own identity, its own voice, and its own reason to exist." },
              { title: "CRAFT", desc: "Every detail matters, from the cup to the ceiling. We pursue mastery in what we make and how we serve." },
              { title: "RITUAL", desc: "We design around the moments people repeat: the morning run, the long dinner, the weekend away, the family gathering." },
              { title: "COLLABORATION", desc: "We open our places to chefs, artists, musicians, baristas, makers, even fellow F&B brands. The best experiences we create are rarely made alone." },
              { title: "RETURN", desc: "True to the cycle our name comes from, we build for the second visit, not just the first. Places made to last, and to come back to." },
            ].map((item) => (
              <div key={item.title} className="bg-surface p-8 lg:p-10">
                <h3 className="mb-3 text-title-lg font-display uppercase tracking-wide text-on-surface">{item.title}</h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
