import { createFileRoute, ClientOnly, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { PortalLoading } from "@/components/PortalLoading";
import { isAppView, type AppView } from "@/lib/app-navigation";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
const ElimuApp = lazy(() => import("@/elimu/App"));
export const Route = createFileRoute("/demo")({
  validateSearch: (search: Record<string, unknown>): { view: AppView } => ({
    view:
      typeof search["view"] === "string" && isAppView(search["view"])
        ? search["view"]
        : "dashboard",
  }),
  head: () => ({
    meta: [
      { title: "Explore the learning portal | ElimuBridge" },
      {
        name: "description",
        content:
          "Explore ElimuBridge with sample learner profiles and your existing on-device learning data.",
      },
      { property: "og:title", content: "Explore ElimuBridge" },
      { property: "og:description", content: "Try the CBE learning portal, quizzes and games." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Demo,
});
function Demo() {
  const { view } = Route.useSearch();
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed right-4 top-2 z-[45] rounded-md bg-background px-2 py-1">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth">Create your account</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">Website</Link>
        </Button>
      </div>
      <ClientOnly fallback={<PortalLoading />}>
        <Suspense fallback={<PortalLoading />}>
          <ElimuApp
            initialView={view}
            onNavigate={(next: AppView) => void navigate({ to: "/demo", search: { view: next } })}
          />
        </Suspense>
      </ClientOnly>
    </>
  );
}
