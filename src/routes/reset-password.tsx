import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { confirmPasswordReset, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("oobCode");
      if (code) {
        setOobCode(code);
      }
    }
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (oobCode) {
      if (password !== confirmation) {
        setError("Passwords must match.");
        return;
      }
      setBusy(true);
      try {
        await confirmPasswordReset(auth, oobCode, password);
        setDone(true);
      } catch (err: any) {
        setError(err?.message || "This password reset code has expired or is invalid.");
      } finally {
        setBusy(false);
      }
    } else if (auth.currentUser) {
      if (password !== confirmation) {
        setError("Passwords must match.");
        return;
      }
      setBusy(true);
      try {
        await updatePassword(auth.currentUser, password);
        setDone(true);
      } catch (err: any) {
        setError(err?.message || "Failed to update password.");
      } finally {
        setBusy(false);
      }
    } else {
      // Send reset link
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      setBusy(true);
      try {
        await sendPasswordResetEmail(auth, email.trim());
        setMessage("A password reset link has been dispatched to your email by Firebase Auth.");
      } catch (err: any) {
        setError(err?.message || "Could not send reset email. Please verify your email address.");
      } finally {
        setBusy(false);
      }
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted px-5">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        {done ? (
          <>
            <p role="status" className="my-6 text-learning-green">
              Your password has been successfully updated in Firebase Auth.
            </p>
            <Button asChild>
              <Link to="/auth">Sign in with your new password</Link>
            </Button>
          </>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {oobCode || auth.currentUser ? (
              <>
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
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  Enter your account email to receive a password recovery link.
                </p>
                <label className="block text-sm font-semibold" htmlFor="reset-email">
                  Account Email
                </label>
                <input
                  id="reset-email"
                  className="account-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. learner@elimubridge.ke"
                />
              </>
            )}

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {message && (
              <p role="status" className="text-sm text-learning-green">
                {message}
              </p>
            )}

            <Button className="w-full" disabled={busy}>
              {oobCode || auth.currentUser ? "Update password" : "Send reset link"}
            </Button>
          </form>
        )}
        <Link to="/auth" className="mt-5 block text-sm text-primary underline">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
