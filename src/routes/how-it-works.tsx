import { createFileRoute, Link } from "@tanstack/react-router";
import { WebsitePage } from "@/components/WebsitePage";
import { Button } from "@/components/ui/button";
import { websiteMeta } from "@/lib/website-meta";
export const Route = createFileRoute("/how-it-works")({
  head: () =>
    websiteMeta(
      "How It Works",
      "Create an account, choose your learning path and grow with Elimu Bridge.",
    ),
  component: How,
});
function How() {
  return (
    <WebsitePage
      eyebrow="ONE STEP AT A TIME"
      title="A simple start. A world of possibility."
      intro="Choose the path that fits your learning, and take the next step with confidence."
    >
      <div className="grid gap-8 md:grid-cols-3">
        {[
          [
            "01",
            "Create an account",
            "Create your account and learner profiles. Teachers and school representatives can use the same account and request verified school access.",
          ],
          [
            "02",
            "Choose your learning path",
            "Explore independent learning or the existing school learning space. School permissions are verified separately.",
          ],
          [
            "03",
            "Learn and grow",
            "Access resources, complete assessments, ask Mwalimu AI and follow your personal progress.",
          ],
        ].map(([n, title, text]) => (
          <section key={n} className="border-t-2 border-learning-teal pt-5">
            <span className="text-sm font-bold text-learning-teal">{n}</span>
            <h2 className="my-4 text-xl font-bold text-primary">{title}</h2>
            <p className="text-sm leading-7 text-muted-foreground">{text}</p>
          </section>
        ))}
      </div>
      <Button asChild className="mt-10">
        <Link to="/auth">Get Started</Link>
      </Button>
    </WebsitePage>
  );
}
