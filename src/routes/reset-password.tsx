import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset your password | ElimuBridge" },
      {
        name: "description",
        content: "Choose a new password for your ElimuBridge account using a secure recovery link.",
      },
      { property: "og:title", content: "Reset your ElimuBridge password" },
      { property: "og:description", content: "Secure account recovery for ElimuBridge learners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPassword,
});
function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setValid(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery");
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirmation) {
      setError("Passwords must match.");
      return;
    }
    setBusy(true);
    const { data } = await supabase.auth.getUser();
    if (!data.user || !valid) {
      setError("This reset link is invalid or expired. Request a new one.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else setDone(true);
  }
  return (
    <main className="grid min-h-screen place-items-center bg-muted px-5">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8">
        <h1 className="text-2xl font-bold">Choose a new password</h1>
        {done ? (
          <>
            <p role="status" className="my-6 text-learning-green">
              Your password has been updated.
            </p>
            <Button asChild>
              <Link to="/dashboard">Continue learning</Link>
            </Button>
          </>
        ) : valid ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              className="account-input"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="block text-sm font-semibold" htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              className="account-input"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button className="w-full" disabled={busy}>
              Update password
            </Button>
          </form>
        ) : (
          <p className="my-6 text-sm text-muted-foreground">
            Open the reset link from your email to choose a new password.
          </p>
        )}
        <Link to="/auth" className="mt-5 block text-sm text-primary underline">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
