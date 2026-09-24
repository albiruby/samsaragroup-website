import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { jsonLdHtml } from "@/lib/jsonld";

export const metadata = {
  title: "About — Samsara Group",
  description: "Samsara Group is a multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.",
};

export default async function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Samsara Group",
            url: "https://samsaragroup.co.id/about",
            mainEntity: {
              "@type": "Organization",
              name: "Samsara Group",
              url: "https://samsaragroup.co.id",
              description:
                "A multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.",
            },
          }),
        }}
      />
      <Header />

      {/* ── About Hero ── */}
      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="img-hover h-[400px] lg:h-[520px]">
              <img src="/ambiencesamsara/DSC08913.webp" alt="Samsara Group" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">ABOUT US</span>
              <h1 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight mb-6 text-on-surface">
                WE CREATE PLACES<br />TO FEEL SOMETHING.
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-6">
                Samsara Group is a multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.
              </p>
              <p className="font-body text-body-lg text-on-surface-variant leading-relaxed">
                Four distinct worlds — each a curated expression of craft, sound, taste, and stillness — together forming a single philosophy of intentional living.
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
            <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-8 text-on-surface max-w-3xl">
              WHERE EVERY MOMENT MATTERS
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
              We believe that places have the power to transform how people feel, connect, and live. Our vision is to create destinations that honor craft, silence, and the beauty of intentional design.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="bg-surface w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">PHILOSOPHY</span>
            <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-12 text-on-surface">
              APPROACH & PRINCIPLES
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant">
            {[
              { title: "CRAFT", desc: "Every detail matters. We pursue mastery in what we make and how we serve." },
              { title: "SILENCE", desc: "We design for stillness. Space, sound, and absence are as important as presence." },
              { title: "TERRITORY", desc: "Every place begins with its landscape. We build from the land, not on it." },
              { title: "COMMUNITY", desc: "We create spaces where people connect, belong, and grow together." },
              { title: "TIME", desc: "We design for longevity. Materials, objects, and experiences built to endure." },
              { title: "RITUAL", desc: "Daily practice as architecture. Fire, sound, food, and movement as structure." },
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
