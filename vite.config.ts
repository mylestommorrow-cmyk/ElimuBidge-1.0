import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const isBuild = command === "build";

  return {
    define: envDefine,
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    plugins: [
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart({
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      react(),
      ...(isBuild
        ? [
            nitro({
              preset: "cloudflare-module",
              output: {
                dir: "dist",
                serverDir: "dist/server",
                publicDir: "dist/client",
              },
              cloudflare: {
                nodeCompat: true,
                deployConfig: true,
              },
            }),
          ]
        : []),
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
                !["/~oauth", "/api", "/auth", "/app", "/dashboard", "/reset-password"].some((p) =>
                  url.pathname.startsWith(p),
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
  };
});
