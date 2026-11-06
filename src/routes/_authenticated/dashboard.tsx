import { createFileRoute } from "@tanstack/react-router";
import { AccountPortal, accountProfilesOptions } from "@/components/AccountPortal";
export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(accountProfilesOptions),
  head: () => ({
    meta: [
      { title: "Your learning dashboard | ElimuBridge" },
      {
        name: "description",
        content:
          "Your lessons, revision quizzes, study progress and Mwalimu AI in one learning dashboard.",
      },
      { property: "og:title", content: "Your learning dashboard | ElimuBridge" },
      {
        property: "og:description",
        content: "Continue your CBE learning journey with ElimuBridge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AccountPortal view="dashboard" />,
});
