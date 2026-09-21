import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getContactInfo } from "@/sanity/lib/queries";

export const metadata = {
  title: "Contact — Samsara Group",
  description: "Get in touch with Samsara Group for inquiries, reservations, and partnerships.",
};

export default async function ContactPage() {
  const contact = await getContactInfo();

  const emails = contact?.emails || [
    { label: "Private Sanctuary", email: "concierge@samsaragroup.com" },
    { label: "Curatorial", email: "curatorial@samsaragroup.com" },
    { label: "Press", email: "press@samsaragroup.com" },
  ];

  const addresses = contact?.addresses || [
    { name: "Svarga Estate — Bali", address: "Jl. Raya Sanggingan, Ubud, Gianyar 80561" },
    { name: "Acasa — Jakarta", address: "Jl. Senopati No. 42, Kebayoran Baru" },
  ];

  const hours = contact?.hours || "Mon–Sat: 09:00–18:00 · Sun: By appointment";

  const inquiryTypes = contact?.inquiryTypes || [
    { value: "reservation", label: "Reservation & Stay" },
    { value: "dining", label: "Dining" },
    { value: "music", label: "Music & Listening" },
    { value: "design", label: "Design & Objects" },
    { value: "community", label: "Community" },
    { value: "press", label: "Press" },
    { value: "partnership", label: "Partnership" },
  ];

  return (
    <>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">CONTACT</h1>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-12">
        <div className="grid gap-12 lg:grid-cols-2 border-b border-outline-variant pb-16">
          <ScrollReveal>
            <div className="space-y-8">
              {emails.map((item) => (
                <div key={item.label}>
                  <h3 className="mb-2 text-title-lg font-medium uppercase tracking-wide text-on-surface">{item.label}</h3>
                  <a href={`mailto:${item.email}`} className="text-body-md text-terracotta underline underline-offset-4 hover:text-primary transition-colors">{item.email}</a>
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
                    <div key={addr.name || i}>
                      <p className="font-medium text-on-surface">{addr.name}</p>
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

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <h2 className="mb-10 text-headline-sm font-display uppercase tracking-wide text-on-surface">SEND AN INQUIRY</h2>
        </ScrollReveal>
        <ScrollReveal>
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-label-md uppercase tracking-wider text-on-surface-variant">First Name</label>
                <input type="text" required className="w-full border-b border-outline bg-transparent py-3 text-body-md text-on-surface outline-none transition-colors focus:border-terracotta" />
              </div>
              <div>
                <label className="mb-2 block text-label-md uppercase tracking-wider text-on-surface-variant">Last Name</label>
                <input type="text" required className="w-full border-b border-outline bg-transparent py-3 text-body-md text-on-surface outline-none transition-colors focus:border-terracotta" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-label-md uppercase tracking-wider text-on-surface-variant">Email</label>
              <input type="email" required className="w-full border-b border-outline bg-transparent py-3 text-body-md text-on-surface outline-none transition-colors focus:border-terracotta" />
            </div>
            <div>
              <label className="mb-2 block text-label-md uppercase tracking-wider text-on-surface-variant">Inquiry Type</label>
              <select required className="w-full border-b border-outline bg-transparent py-3 text-body-md text-on-surface outline-none transition-colors focus:border-terracotta">
                <option value="">Select</option>
                {inquiryTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-label-md uppercase tracking-wider text-on-surface-variant">Message</label>
              <textarea rows={5} required className="w-full border-b border-outline bg-transparent py-3 text-body-md text-on-surface outline-none transition-colors focus:border-terracotta resize-none" />
            </div>
            <button type="submit" className="mt-4 inline-flex items-center gap-3 bg-primary px-10 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
              SUBMIT
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
            </button>
          </form>
        </ScrollReveal>
      </section>

      <Footer />
    </>
  );
}
