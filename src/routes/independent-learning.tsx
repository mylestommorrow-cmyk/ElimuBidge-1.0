import { createFileRoute, Link } from "@tanstack/react-router";
import { WebsitePage } from "@/components/WebsitePage";
import { Button } from "@/components/ui/button";
import { websiteMeta } from "@/lib/website-meta";
import { BookOpen, Award, TrendingUp, Sparkles } from "lucide-react";
export const Route = createFileRoute("/independent-learning")({
  head: () =>
    websiteMeta(
      "Independent Learning",
      "Study CBE resources, practise assessments and get Gemini-powered learning support.",
    ),
  component: Independent,
});
function Independent() {
  return (
    <WebsitePage
      eyebrow="YOUR PACE. YOUR PATH."
      title="Independent Learning"
      intro="Learn wherever curiosity takes you, with resources and support for your next step."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {[
          [
            BookOpen,
            "Public revision materials",
            "Explore learning areas and study notes from Playgroup to Grade 12.",
            "library",
          ],
          [
            Award,
            "Quizzes and exam practice",
            "Practise revision quizzes with worked explanations and feedback.",
            "quizzes",
          ],
          [
            TrendingUp,
            "Your progress",
            "Keep learner profiles online and follow your assessment progress.",
            "progress",
          ],
          [
            Sparkles,
            "Mwalimu AI",
            "Ask questions in English or Kiswahili and get guided Gemini-powered support.",
            "tutor",
          ],
        ].map(([Icon, title, text, view]) => {
          const I = Icon as typeof BookOpen;
          return (
            <article key={String(view)} className="rounded-lg border border-border p-6">
              <I className="mb-5 size-6 text-learning-teal" />
              <h2 className="text-xl font-bold text-primary">{String(title)}</h2>
              <p className="my-4 text-sm leading-7 text-muted-foreground">{String(text)}</p>
              <Button asChild variant="link" className="px-0">
                <Link to="/app/$view" params={{ view: String(view) }}>
                  Explore
                </Link>
              </Button>
            </article>
          );
        })}
      </div>
      <Button asChild className="mt-8">
        <Link to="/auth">Start Independent Learning</Link>
      </Button>
    </WebsitePage>
  );
}
