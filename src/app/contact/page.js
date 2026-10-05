import { openGraphFor } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getContactInfo } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact — Samsara Group",
  description: "Get in touch with Samsara Group for inquiries, reservations, and partnerships.",
  alternates: {
    canonical: "/contact",
  },
openGraph: openGraphFor({ path: "/contact" }),
};

const WHATSAPP_FALLBACK = [
  { label: "Samsara", city: "Bogor", display: "0812-8127-1988", phone: "6285281271988" },
  { label: "Svarga", city: "Sukabumi", display: "0813-2148-132", phone: "628132148132" },
  { label: "Acasa", city: "Bogor", display: "0811-8888-7828", phone: "6281188887828" },
];

const ADDRESSES_FALLBACK = [
  { name: "Samsara — Bogor", address: "Jl. Jalak Harupat No.19, Babakan, Bogor Tengah, Kota Bogor, Jawa Barat 16129" },
  { name: "Svarga — Sukabumi", address: "Jl. Raya Nagrak, Cisarua, Sukabumi, Jawa Barat" },
  { name: "Acasa — Ciawi, Bogor", address: "Jl. Raya Pertanian, Bendungan, Kec. Ciawi, Kab. Bogor, Jawa Barat 16720" },
];

export default async function ContactPage() {
  const contact = await getContactInfo();

  const cmsWhatsapp = (contact?.whatsapp ?? []).filter(
    (w) => w?.label && w?.display && w?.phone
  );
  const whatsapp = cmsWhatsapp.length ? cmsWhatsapp : WHATSAPP_FALLBACK;

  const cmsAddresses = (contact?.addresses ?? []).filter((a) => a?.address);
  const addresses = cmsAddresses.length ? cmsAddresses : ADDRESSES_FALLBACK;

  const hours = contact?.hours || "Mon–Sat: 09:00–18:00 · Sun: By appointment";

  return (
    <>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">CONTACT</h1>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div className="space-y-8">
              {whatsapp.map((item) => (
                <div key={item.phone}>
                  <h3 className="mb-2 text-title-lg font-medium uppercase tracking-wide text-on-surface">
                    {item.label}
                    <span className="text-body-sm font-normal normal-case tracking-normal text-on-surface-variant/70"> · {item.city}</span>
                  </h3>
                  <a
                    href={`https://wa.me/${item.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="VIEW"
                    className="group inline-flex min-h-[44px] items-center gap-3 text-body-md text-terracotta underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    {item.display}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:translate-x-1">
                      <path d="M1 7h12M8 2l5 5-5 5" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-8">
              <div>
                <h3 className="mb-2 text-title-lg font-medium uppercase tracking-wide text-on-surface">Visit Us</h3>
                <div className="space-y-3 text-body-md text-on-surface-variant">
                  {addresses.map((addr, i) => (
                    <div key={addr.label || addr.name || i}>
                      <p className="font-medium text-on-surface">{addr.label || addr.name}</p>
                      <p>{addr.address}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-title-lg font-medium uppercase tracking-wide text-on-surface">Hours</h3>
                <p className="text-body-md text-on-surface-variant">{hours}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
