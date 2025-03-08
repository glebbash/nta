import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "NTA",
        short_name: "NTA",
        description: "Note Taking App",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          {
            src: "/icons/icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/auth/, /^\/api/],
        // https://vite-pwa-org.netlify.app/workbox/generate-sw.html#cache-external-resources
        runtimeCaching: [
          cacheEntry(
            /^https:\/\/fonts\.googleapis\.com\/.*/i,
            "google-fonts-cache"
          ),
          cacheEntry(
            /^https:\/\/fonts\.gstatic\.com\/.*/i,
            "gstatic-fonts-cache"
          ),
        ],
      },
    }),
  ],
});

function cacheEntry(urlPattern: RegExp, cacheName: string) {
  return {
    urlPattern,
    handler: "CacheFirst" as const,
    options: {
      cacheName,
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  };
}
