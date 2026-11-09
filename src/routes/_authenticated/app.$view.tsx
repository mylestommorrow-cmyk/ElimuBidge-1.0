import { createFileRoute, notFound } from "@tanstack/react-router";
import { AccountPortal, accountProfilesOptions } from "@/components/AccountPortal";
import { isAppView, normalizeAppView, VIEW_LABELS } from "@/lib/app-navigation";
export const Route = createFileRoute("/_authenticated/app/$view")({
  loader: async ({ params, context }) => {
    const view = normalizeAppView(params.view);
    if (!view) throw notFound();
    await context.queryClient.ensureQueryData(accountProfilesOptions);
    return { view };
  },
  head: ({ loaderData }) => {
    const title = `${loaderData ? VIEW_LABELS[loaderData.view] : "Learning space"} | ElimuBridge`;
    const description = `Explore ${loaderData ? VIEW_LABELS[loaderData.view].toLowerCase() : "your learning space"} for Kenya’s CBE curriculum, Playgroup to Grade 12.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: AppPage,
});
function AppPage() {
  const { view } = Route.useLoaderData();
  return <AccountPortal view={view} />;
}
