// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    plugins: [
      VitePWA({
        strategies: "generateSW",
        filename: "sw.js",
        registerType: "autoUpdate",
        injectRegister: null,
        manifest: false,
        devOptions: { enabled: false },
        workbox: {
          globPatterns: ["**/*.{js,css,png,jpg,webmanifest}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          navigateFallback: null,
          runtimeCaching: [
            {
              urlPattern: ({ request, url }: { request: Request; url: URL }) =>
                request.mode === "navigate" &&
                !["/~oauth", "/api", "/auth", "/app", "/dashboard", "/reset-password"].some(
                  (path) => url.pathname.startsWith(path),
                ),
              handler: "NetworkFirst",
              options: {
                cacheName: "elimu-public-pages",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 20, maxAgeSeconds: 604800 },
              },
            },
            {
              urlPattern: ({ url }: { url: URL }) =>
                url.origin === self.location.origin &&
                /\/assets\/.*-[\w-]+\.(js|css)$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "elimu-hashed-assets",
                expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
              },
            },
          ],
        },
      }),
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
