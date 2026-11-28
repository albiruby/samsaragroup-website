/** @type {import('next').NextConfig} */
const isPreview = process.env.VERCEL_ENV === "preview";

const nextConfig = {
  poweredByHeader: false,
  // No next/image usage anywhere in src/, so the optimizer has no legitimate
  // remote host to serve. Leaving remotePatterns here would keep /_next/image
  // open for anyone to proxy those hosts at our quota's expense.
  headers: async () => [
    ...(isPreview
      ? [
          {
            source: '/(.*)',
            headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
          },
        ]
      : []),
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
      ],
    },
  ],
  // The brand asset folders were renamed to ASSETS-<BRAND> (uppercase). These keep
  // any already-indexed or externally hotlinked image URL working. Order matters:
  // /menusamsara/thumbs/ is covered by the /menusamsara/:path* rule below it.
  redirects: async () => [
    { source: '/ambiencesamsara/:path*', destination: '/ASSETS-SAMSARA/ambience/:path*', permanent: true },
    { source: '/menusamsara/:path*', destination: '/ASSETS-SAMSARA/menu/:path*', permanent: true },
    { source: '/assetacasa/:path*', destination: '/ASSETS-ACASA/:path*', permanent: true },
    { source: '/assetsvarga/:path*', destination: '/ASSETS-SVARGA/:path*', permanent: true },
    // The old folder names contained spaces. Next matches redirect sources against
    // the still-encoded pathname, so the space has to be written as %20.
    { source: '/Black%20Logo%20Samsara/:path*', destination: '/ASSETS-SAMSARA/logo/:path*', permanent: true },
    { source: '/White%20Logo%20Samsara/:path*', destination: '/ASSETS-SAMSARA/logo/:path*', permanent: true },
    // Logo filenames were normalised to ASSETS-<BRAND>/logo/<brand>-{black|white}.webp.
    // Keep old URLs working for cached HTML and external hotlinks.
    { source: '/ASSETS-SAMSARA/logo/blackfullsamping.png', destination: '/ASSETS-SAMSARA/logo/samsara-black.webp', permanent: true },
    { source: '/ASSETS-SAMSARA/logo/blackfullsamping-480.webp', destination: '/ASSETS-SAMSARA/logo/samsara-black-480.webp', permanent: true },
    { source: '/ASSETS-SAMSARA/logo/whitefullsamping-480.webp', destination: '/ASSETS-SAMSARA/logo/samsara-white-480.webp', permanent: true },
    { source: '/ASSETS-SVARGA/Svarga%20logo%20black.webp', destination: '/ASSETS-SVARGA/logo/svarga-black.webp', permanent: true },
    { source: '/ASSETS-SVARGA/Svarga%20logo%20black-480.webp', destination: '/ASSETS-SVARGA/logo/svarga-black-480.webp', permanent: true },
    { source: '/ASSETS-ACASA/logoacasahitam.webp', destination: '/ASSETS-ACASA/logo/acasa-black.webp', permanent: true },
    { source: '/ASSETS-ACASA/logoacasahitam-480.webp', destination: '/ASSETS-ACASA/logo/acasa-black-480.webp', permanent: true },
    { source: '/ASSETS-ACASA/Main%20Logo3-480.webp', destination: '/ASSETS-ACASA/logo/acasa-white-480.webp', permanent: true },
  ],
};

export default nextConfig;
