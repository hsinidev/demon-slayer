import type { NextConfig } from "next";

// next-pwa is generally used as a commonjs module
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Precache the offline fallback page
  fallbacks: {
    document: '/offline',
  },
  runtimeCaching: [
    // ─── 1. Google Fonts: Cache First (long TTL) ──────────────────────────────
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'ds-google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'ds-google-fonts-webfonts',
        cacheableResponse: { statuses: [0, 200] },
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },

    // ─── 2. Next.js Static JS/CSS Chunks: Cache First ─────────────────────────
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'ds-next-static',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },

    // ─── 3. Next.js Image Optimization endpoint: Stale-While-Revalidate ───────
    {
      urlPattern: /\/_next\/image\?.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'ds-next-image',
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },

    // ─── 4. Manga Panel Images: StaleWhileRevalidate → ds-chapters-cache ──────
    //    Matches /manga/**/*.{jpg,jpeg,png,webp} paths (CDN or local)
    {
      urlPattern: /\/manga\/.*\.(jpe?g|png|webp|avif|gif)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'ds-chapters-cache',
        cacheableResponse: { statuses: [0, 200] },
        expiration: {
          maxEntries: 2000,          // Up to 2000 panel images offline
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        rangeRequests: true,         // Support range requests for large images
      },
    },

    // ─── 5. External CDN Artwork/Thumbnails: StaleWhileRevalidate ─────────────
    {
      urlPattern: /^https:\/\/via\.placeholder\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'ds-placeholder-images',
        cacheableResponse: { statuses: [0, 200] },
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },

    // ─── 6. HTML Pages (App Shell): NetworkFirst with offline fallback ─────────
    {
      urlPattern: /^https:\/\/demonnslayer\.com(\/.*)?$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'ds-pages',
        networkTimeoutSeconds: 5,    // Fall back to cache after 5s
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // ─── 7. Broad fallback for everything else: NetworkFirst ──────────────────
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'ds-catchall',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
      },
    },
  ],
});

const nextConfig: NextConfig = withPWA({
  // Allow <img> tags to load local relative images without the optimizer
  images: {
    unoptimized: true,
  },

  // Required for Next.js 16 Turbopack – keeps webpack plugins happy
  turbopack: {},
});

export default nextConfig;
