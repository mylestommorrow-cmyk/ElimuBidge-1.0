import { ClientOnly, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { lazy, Suspense, useCallback } from "react";
import { getAccountProfiles, saveAccountProfiles } from "@/lib/profile.functions";
import { makeAccountLearner } from "@/lib/account-profile";
import { PortalLoading } from "@/components/PortalLoading";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, ExternalLink } from "lucide-react";
import { useAccount } from "@/components/account/AccountProvider";
import { toast } from "sonner";
import type { LearnerProfile } from "@/elimu/types";
import type { AppView } from "@/lib/app-navigation";

const ElimuApp = lazy(() => import("@/elimu/App"));
export const accountProfilesOptions = {
  queryKey: ["account-profiles"],
  queryFn: () => getAccountProfiles(),
};
export function AccountPortal({ view }: { view: AppView }) {
  const { data } = useSuspenseQuery(accountProfilesOptions);
  const save = useServerFn(saveAccountProfiles);
  const navigate = useNavigate();
  const { user, signOut } = useAccount();
  const queryClient = useQueryClient();
  const saveProfiles = useCallback(
    async (updated: LearnerProfile[]) => {
      await save({ data: { profiles: updated } });
      if (user?.uid) {
        try {
          const { syncUserProfileToFirestore } = await import("@/lib/firestore-sync");
          const primary = updated[0];
          if (primary) {
            await syncUserProfileToFirestore(user.uid, {
              displayName: primary.name,
              tokensBalance: primary.tokensBalance,
              quizzesTaken: primary.quizzesTaken,
              averageScore: primary.averageScore,
              completedTopicsCount: primary.completedTopicsCount,
            });
          }
        } catch (err) {
          console.warn("Firestore sync note:", err);
        }
      }
      queryClient.setQueryData(
        accountProfilesOptions.queryKey,
        (previous: typeof data | undefined) =>
          previous ? { ...previous, profiles: updated } : previous,
      );
    },
    [save, queryClient, user],
  );
  const effectiveDisplayName = user?.displayName || data.displayName;
  const profiles = data.profiles.length
    ? (data.profiles as unknown as LearnerProfile[])
    : [makeAccountLearner(effectiveDisplayName)];

  return (
    <>
      <div className="fixed right-4 top-2 z-[45] flex items-center gap-1.5 rounded-md border border-border bg-background/95 backdrop-blur-sm p-1 shadow-sm text-xs">
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
          {data.role === "teacher"
            ? "👩‍🏫 Teacher"
            : data.role === "school_admin"
              ? "🏫 School Admin"
              : data.role === "platform_admin"
                ? "🛡️ Admin"
                : "🎓 CBE Learner"}
        </span>
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ExternalLink className="size-3.5" />
            Website
          </Link>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            void signOut().catch(() => toast.error("Unable to sign out. Please try again."))
          }
        >
          <LogOut className="size-3.5" />
          Sign out
        </Button>
      </div>
      <ClientOnly fallback={<PortalLoading />}>
        <Suspense fallback={<PortalLoading />}>
          <ElimuApp
            key={data.ownerId}
            initialView={view}
            onNavigate={(next: AppView) =>
              void navigate({ to: "/app/$view", params: { view: next } })
            }
            initialProfiles={profiles}
            profileStorageKey={`elimubridge_account_${data.ownerId}`}
            onSaveProfiles={saveProfiles}
          />
        </Suspense>
      </ClientOnly>
    </>
  );
}
