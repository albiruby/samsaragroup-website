import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "About — Samsara Group",
  description: "Vision, philosophy, and the ecosystem behind Samsara Group.",
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">THE GROUP</span>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">ABOUT</h1>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="img-hover h-[400px] lg:h-[520px]">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQmBg4kvXIMCi_ZCe8Le6xMtHoEoiS_hJ_Ht-u4T-nq0FyD1kI-cmljJW86GGLxuLq6dgqn2lTjawXtFboD2uwSdHPpwD8Xz0AbUUbdypcz3dYh4oD2CG5LG9So0nQQHF3cfl_sq-l4n2v8TG7yNjEeyi-7hzJOXsFj58-KV5PptEZ4Xp-4cwA11UxNnZ-WoRbyv7-J94P-fzkVv4uasg7Z2ZTw0USC7oooT6aZR0VJps2HysBnpZ3" alt="Samsara Group" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight mb-6 text-on-surface">
                WE CREATE PLACES<br />TO FEEL SOMETHING.
              </h2>
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

      <section className="bg-surface-container w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">ECOSYSTEM</span>
            <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-12 text-on-surface">
              FOUR WORLDS. ONE PHILOSOPHY.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "SAMSARA", desc: "Sound. Food. Culture.", href: "/samsara" },
              { name: "SVVARA", desc: "Sound. Object. Design.", href: "/svvara" },
              { name: "SVARGA", desc: "Nature. Dining. Escape.", href: "/svarga" },
              { name: "ACASA", desc: "Stay. Move. Play.", href: "/acasa" },
            ].map((world) => (
              <Link key={world.name} href={world.href} className="group border border-outline-variant p-8 hover:bg-surface-lowest transition-colors">
                <h3 className="font-display text-headline-sm uppercase mb-3 text-on-surface group-hover:text-terracotta transition-colors">{world.name}</h3>
                <p className="text-body-sm text-on-surface-variant">{world.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-container w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-24 lg:py-40 text-center">
          <h2 className="font-display text-headline-md lg:text-display-lg uppercase leading-[0.95] tracking-tight mb-8 text-on-primary-container">
            JOIN US
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers" className="inline-flex items-center gap-3 bg-primary px-10 py-4 font-label text-body-sm uppercase tracking-[0.15em] text-on-primary hover:bg-primary/90 transition-colors">
              CAREERS
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-3 border border-on-primary-container/30 px-10 py-4 font-label text-body-sm uppercase tracking-[0.15em] text-on-primary-container hover:bg-on-primary-container hover:text-primary-container transition-colors">
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
