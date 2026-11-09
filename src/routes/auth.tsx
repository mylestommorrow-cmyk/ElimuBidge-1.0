import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Mail, LoaderCircle } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleAuthProvider, signInWithPopup } from "@/lib/firebase";
import { syncUserProfileToFirestore } from "@/lib/firestore-sync";
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
  const [role, setRole] = useState<"student" | "teacher" | "school_admin" | "platform_admin">(
    "student",
  );
  const [learningMode, setLearningMode] = useState<"independent" | "school">("independent");
  const [grade, setGrade] = useState("Grade 7");
  const [pathway, setPathway] = useState<"STEM" | "Social Sciences" | "Arts and Sports Science">(
    "STEM",
  );
  const [schoolCode, setSchoolCode] = useState("");
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
        await sendPasswordResetEmail(auth, email);
        setMessage("A password reset link has been sent to your email from Firebase Auth.");
      } else if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        if (name.trim()) {
          await updateProfile(fbUser, { displayName: name.trim() });
        }
        // Save local session state for instant personalized onboarding
        try {
          localStorage.setItem("elimubridge_user_role", role);
          localStorage.setItem(
            "elimubridge_learning_mode",
            role === "student" ? learningMode : "school",
          );
          localStorage.setItem("elimubridge_selected_grade", grade);
          if (schoolCode.trim()) {
            localStorage.setItem("elimubridge_school_code", schoolCode.trim().toUpperCase());
          }
          localStorage.setItem(
            "elimubridge_active_profile",
            JSON.stringify({
              id: fbUser.uid,
              name: name.trim() || "Elimu Learner",
              grade,
              role,
              mode: learningMode,
              seniorPathway: grade.includes("Grade 1") ? pathway : undefined,
            }),
          );
        } catch {
          // ignore localStorage error
        }
        try {
          await syncUserProfileToFirestore(fbUser.uid, {
            displayName: name.trim() || "Elimu Learner",
            email,
            role: role as any,
            gradeLevel: grade,
            mode: learningMode as any,
          });
        } catch (fsErr) {
          console.warn("Firestore profile sync warning:", fsErr);
        }
        await navigate({ to: "/dashboard" });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        try {
          await syncUserProfileToFirestore(fbUser.uid, {
            displayName: fbUser.displayName || name || "Elimu Learner",
            email: fbUser.email || email,
            role: role as any,
            gradeLevel: grade,
            mode: learningMode as any,
          });
        } catch (fsErr) {
          console.warn("Firestore profile sync warning:", fsErr);
        }
        await navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      const errMsg = err?.message || "Please check your credentials and try again.";
      setError(errMsg);
    } finally {
      setBusy(false);
    }
  }
  async function signInWithGoogle() {
    setBusy(true);
    setError("");
    try {
      // 1. Google Sign-in with Firebase Auth popup
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;

      // 2. Persist profile to Firestore
      await syncUserProfileToFirestore(fbUser.uid, {
        displayName: fbUser.displayName || name || "Elimu Learner",
        email: fbUser.email || undefined,
        role: (role as any) || "student",
        gradeLevel: grade || "Grade 7",
        mode: (learningMode as any) || "independent",
        photoURL: fbUser.photoURL || undefined,
      });

      // 3. Store active profile locally
      try {
        localStorage.setItem(
          "elimubridge_active_profile",
          JSON.stringify({
            id: fbUser.uid,
            name: fbUser.displayName || name || "Elimu Learner",
            grade,
            role,
            mode: learningMode,
            seniorPathway: grade.includes("Grade 1") ? pathway : undefined,
          }),
        );
      } catch {
        // ignore
      }

      await navigate({ to: "/dashboard" });
    } catch (err: any) {
      console.error("Firebase Google Auth error:", err);
      setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
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
                onClick={() => void signInWithGoogle()}
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
              <div className="py-2 text-center text-xs text-muted-foreground">
                or continue with email
              </div>
            </div>
          )}
          <form onSubmit={submit} className="mt-5 space-y-4">
            {mode === "signup" && (
              <>
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
                    placeholder="e.g. Amani Mwangi"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">User Role</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {[
                      { id: "student", label: "Student", icon: "🎓" },
                      { id: "teacher", label: "Teacher", icon: "👩‍🏫" },
                      { id: "school_admin", label: "School Admin", icon: "🏫" },
                      { id: "platform_admin", label: "Platform Admin", icon: "🛡️" },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as any)}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition ${
                          role === r.id
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {role === "student" && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      Learning Access Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLearningMode("independent")}
                        className={`rounded-md p-2 text-left text-xs transition ${
                          learningMode === "independent"
                            ? "border border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold"
                            : "border border-border bg-background text-muted-foreground"
                        }`}
                      >
                        <div className="font-semibold flex items-center gap-1">🌟 Independent</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Self-study & AI tutor
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLearningMode("school")}
                        className={`rounded-md p-2 text-left text-xs transition ${
                          learningMode === "school"
                            ? "border border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-bold"
                            : "border border-border bg-background text-muted-foreground"
                        }`}
                      >
                        <div className="font-semibold flex items-center gap-1">🏫 School Mode</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Teacher notes & tests
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {(role === "student" || role === "teacher") && (
                  <div>
                    <label htmlFor="grade-select" className="text-sm font-semibold">
                      Curriculum Grade (CBE)
                    </label>
                    <select
                      id="grade-select"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="account-input mt-1"
                    >
                      <optgroup label="Early Years">
                        <option value="Playgroup">Playgroup</option>
                        <option value="PP1">PP1 (Pre-Primary 1)</option>
                        <option value="PP2">PP2 (Pre-Primary 2)</option>
                      </optgroup>
                      <optgroup label="Lower Primary">
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                      </optgroup>
                      <optgroup label="Upper Primary">
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                      </optgroup>
                      <optgroup label="Junior School">
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                      </optgroup>
                      <optgroup label="Senior School">
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </optgroup>
                    </select>
                  </div>
                )}

                {(grade.startsWith("Grade 10") ||
                  grade.startsWith("Grade 11") ||
                  grade.startsWith("Grade 12")) && (
                  <div>
                    <label className="text-sm font-semibold">Senior School Pathway</label>
                    <select
                      value={pathway}
                      onChange={(e) => setPathway(e.target.value as any)}
                      className="account-input mt-1"
                    >
                      <option value="STEM">🔬 STEM (Science, Tech, Eng, Math)</option>
                      <option value="Social Sciences">🌍 Social Sciences & Humanities</option>
                      <option value="Arts and Sports Science">🎨 Arts & Sports Science</option>
                    </select>
                  </div>
                )}

                {(role === "teacher" ||
                  role === "school_admin" ||
                  (role === "student" && learningMode === "school")) && (
                  <div>
                    <label
                      htmlFor="school-code"
                      className="text-sm font-semibold flex items-center justify-between"
                    >
                      <span>School Code</span>
                      <span className="text-[11px] font-normal text-muted-foreground">
                        e.g. ELIMU-001
                      </span>
                    </label>
                    <input
                      id="school-code"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value)}
                      placeholder="e.g. ELIMU-001 (Nairobi Pioneer Academy)"
                      className="account-input uppercase mt-1"
                    />
                  </div>
                )}
              </>
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
