import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/lib/firebase";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      await auth.authStateReady();
      if (!auth.currentUser) throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
