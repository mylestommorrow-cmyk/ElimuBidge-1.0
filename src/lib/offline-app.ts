export function isPreviewHostname(host: string) {
  const hostname = host.toLowerCase();
  const label = hostname.split(".")[0] ?? "";
  const platform = /\.(preview\.app|gpt-eng\.com|gptengineer\.run|run\.app)$/.test(hostname);
  return (
    (platform &&
      (/^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/.test(label) ||
        /^project--.+-dev$/.test(label))) ||
    /(^|\.)(preview-project\.com|preview-dev\.com|beta\.preview\.dev)$/.test(hostname)
  );
}
export async function registerOfflineApp() {
  if (!("serviceWorker" in navigator)) return;
  const refused =
    !import.meta.env.PROD ||
    window.self !== window.top ||
    isPreviewHostname(window.location.hostname) ||
    new URLSearchParams(window.location.search).get("sw") === "off";
  try {
    if (refused) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter((reg) =>
            [reg.active, reg.waiting, reg.installing].some(
              (worker) => worker && new URL(worker.scriptURL).pathname === "/sw.js",
            ),
          )
          .map((reg) => reg.unregister()),
      );
      return;
    }
    await navigator.serviceWorker.register("/sw.js");
  } catch {
    /* Network restrictions must not prevent the application from opening. */
  }
}
