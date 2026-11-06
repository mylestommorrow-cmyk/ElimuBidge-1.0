import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Mail, LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { useAccount } from "@/components/account/AccountProvider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account | ElimuBridge" },
      {
        name: "description",
        content:
          "Sign in to your ElimuBridge learning account and save learner profiles across devices.",
      },
      { property: "og:title", content: "Your ElimuBridge account" },
      { property: "og:description", content: "Sign in and continue your CBE learning journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});
function Auth() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user, loading } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) void navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage("If an account exists, a password reset link has been sent to your email.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } },
        });
        if (error) throw error;
        if (!data.session) setMessage("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function social(provider: "google" | "lovable") {
    setBusy(true);
    setError("");
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: `${window.location.origin}/auth`,
      });
      if (result.error) throw result.error;
      if (!result.redirected) await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-muted px-5 py-8">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back to ElimuBridge
        </Link>
        <div className="rounded-lg border border-border bg-background p-6 sm:p-8">
          <img
            src="/elimu-bridge-logo.png"
            alt="ElimuBridge"
            className="mb-6 size-14 object-contain"
          />
          <h1 className="text-2xl font-extrabold">
            {mode === "signup"
              ? "Your learning journey starts here."
              : mode === "forgot"
                ? "Reset your password."
                : "Welcome back."}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {mode === "forgot"
              ? "We’ll email you a secure reset link."
              : "A little progress, every day. Together."}
          </p>
          {mode !== "forgot" && (
            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="google-signin h-11 w-full"
                disabled={busy}
                onClick={() => void social("google")}
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button
                className="lovable-auth-button h-11 w-full"
                disabled={busy}
                onClick={() => void social("lovable")}
              >
                Continue with Lovable
              </Button>
              <div className="py-2 text-center text-xs text-muted-foreground">
                or continue with email
              </div>
            </div>
          )}
          <form onSubmit={submit} className="mt-5 space-y-4">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="text-sm font-semibold">
                  Display name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="account-input"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="account-input"
              />
            </div>
            {mode !== "forgot" && (
              <div>
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="account-input"
                />
              </div>
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
            <Button disabled={busy} className="h-11 w-full" type="submit">
              {busy ? <LoaderCircle className="animate-spin" /> : <Mail />}
              {mode === "signup"
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Sign in"}
            </Button>
          </form>
          <div className="mt-5 flex flex-wrap justify-between gap-2">
            <Button
              size="sm"
              variant="link"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setMessage("");
                setError("");
              }}
            >
              {mode === "signup" ? "Already have an account?" : "Create an account"}
            </Button>
            <Button
              size="sm"
              variant="link"
              onClick={() => {
                setMode(mode === "forgot" ? "signin" : "forgot");
                setMessage("");
                setError("");
              }}
            >
              {mode === "forgot" ? "Back to sign in" : "Forgot password?"}
            </Button>
          </div>
        </div>
        <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
          Want to look around first?{" "}
          <Link
            to="/demo"
            search={{ view: "dashboard" }}
            className="font-semibold text-primary underline"
          >
            Explore the demo
          </Link>
        </p>
      </div>
    </main>
  );
}
