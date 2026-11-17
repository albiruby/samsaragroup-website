/**
 * One list of navigation links, shared by the header, the mobile menu and the
 * footer. Labels and hrefs are identical to what each component rendered before;
 * only the location of the definition changed.
 */
export const nav = {
  home: { label: "HOME", href: "/" },
  brands: { label: "BRANDS", href: "/brands" },
  events: { label: "EVENTS", href: "/events" },
  career: { label: "CAREER", href: "/career" },
  about: { label: "ABOUT", href: "/about" },
  contact: { label: "CONTACT", href: "/contact" },
};

/** Desktop order: HOME, BRANDS (dropdown), EVENTS, CAREER, ABOUT. */
export const primaryNav = [nav.home, nav.brands, nav.events, nav.career, nav.about];

/** Mobile order: HOME, BRANDS (accordion), EVENTS, CAREER, ABOUT, CONTACT. */
export const mobileNav = [nav.home, nav.brands, nav.events, nav.career, nav.about, nav.contact];

/** Footer columns other than the dynamic BRANDS list. */
export const footerNav = {
  connect: [
    { label: "General Inquiry", href: "/contact" },
    { label: "Events", href: "/events" },
  ],
  explore: [
    { label: "About", href: "/about" },
    { label: "Career", href: "/career" },
  ],
};
