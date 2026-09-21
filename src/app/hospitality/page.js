import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Hospitality — Samsara Group",
  description:
    "Boutique stays, highland retreats, and leisure rituals across Java and Bali. Quiet luxury rooted in local culture and material truth.",
};

const concepts = [
  {
    name: "Acasa Stays",
    description:
      "Intimate boutique properties rooted in local culture. Every Acasa stay is designed as a living space, not a hotel room. Curated art, raw materials, and quiet luxury define the experience.",
  },
  {
    name: "Samsara Retreats",
    description:
      "Full-body wellness destinations set in nature. Samsara Retreats combine traditional healing practices with contemporary design. Silence is the standard. The landscape does the rest.",
  },
  {
    name: "Svarga Residences",
    description:
      "Private residential hospitality for extended stays. Svarga Residences offer the comforts of home with the service of a sanctuary. Live in spaces that feel permanent and personal.",
  },
];

export default function HospitalityPage() {
  return (
    <>
      <Header />
      <main className="bg-surface text-on-surface pt-28">
        <section className="max-w-[1520px] mx-auto px-6 lg:px-10 pb-24">
          <ScrollReveal>
            <p className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Worlds
              </Link>{" "}
              <span className="mx-2 opacity-40">/</span> Hospitality
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[7.5rem] leading-none tracking-tight mb-8">
              HOSPITALITY
            </h1>
          </ScrollReveal>

          <ScrollReveal>
            <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              More than a place to stay. A way to be held. Our hospitality
              spaces are designed around the human need for rest, belonging,
              and gentle attention.
            </p>
          </ScrollReveal>
        </section>

        <section className="bg-surface-container-low py-24 md:py-32">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <p className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-8">
                Philosophy
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="font-display text-4xl md:text-6xl lg:text-[5rem] leading-[1.05] tracking-tight max-w-5xl">
                STAY. CARE. BELONG.
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl">
                <p className="font-body text-on-surface-variant leading-relaxed">
                  Every hospitality concept we build starts from a single
                  question: what does it feel like to be truly received? Not
                  checked in, but welcomed. Not serviced, but understood.
                </p>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  We design spaces that hold silence. That let the material
                  speak. That trust the guest to find their own rhythm. The
                  best hospitality is the kind you barely notice.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <p className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-16">
                Three Worlds Within
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {concepts.map((concept) => (
                <ScrollReveal key={concept.name}>
                  <article className="group">
                    <div className="aspect-[4/3] bg-surface-container-low mb-6 overflow-hidden">
                      <img
                        src={concept.name === "Acasa Stays" ? "/ambiencesamsara/DSC08409.jpg" : concept.name === "Samsara Retreats" ? "/ambiencesamsara/DSC08401.jpg" : "/ambiencesamsara/DSC08397.jpg"}
                        alt={concept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-4">
                      {concept.name}
                    </h3>
                    <p className="font-body text-on-surface-variant leading-relaxed text-sm md:text-base">
                      {concept.description}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-outline-variant py-24 md:py-32">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 text-center">
            <ScrollReveal>
              <p className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-8">
                Begin Your Stay
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-12">
                LET US WELCOME YOU
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <Link
                href="/contact"
                className="inline-block bg-primary text-on-primary font-label text-sm tracking-[0.15em] uppercase px-10 py-5 hover:bg-primary/80 transition-colors duration-300"
              >
                Get in Touch
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
