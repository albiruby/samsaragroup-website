/** @type {import('next').NextConfig} */
const isPreview = process.env.VERCEL_ENV === "preview";

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
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
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
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
  ],
};

export default nextConfig;
