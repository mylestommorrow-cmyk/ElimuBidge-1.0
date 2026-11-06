import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Award, Sparkles, ArrowRight } from "lucide-react";
import { WebsiteShell } from "@/components/WebsiteShell";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "CBE learning for every stage | ElimuBridge" },
      {
        name: "description",
        content:
          "Explore CBE lessons, revision quizzes, games and Mwalimu AI for Playgroup through Grade 12.",
      },
      { property: "og:title", content: "Learning for every stage | ElimuBridge" },
      {
        property: "og:description",
        content: "Find your next lesson and build confidence through CBE revision.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Learning,
});
function Learning() {
  return (
    <WebsiteShell>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-learning-green">
          For every curious mind
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
          CBE learning.
          <br />
          Your pace. Your possibilities.
        </h1>
        <p className="mt-6 max-w-2xl leading-8 text-muted-foreground">
          From your first discoveries in Playgroup to your Grade 12 pathway, find a place to learn,
          practise, and grow.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link to="/auth">
            Start learning <ArrowRight />
          </Link>
        </Button>
      </section>
      <section className="border-y border-border bg-muted">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Understand the lesson",
              text: "Explore course notes, key terms, and worked examples by grade and subject.",
              view: "library",
            },
            {
              icon: Award,
              title: "Practise with purpose",
              text: "Work through revision quizzes, explore the exam bank, and revisit the topics that need another look.",
              view: "quizzes",
            },
            {
              icon: Sparkles,
              title: "Keep asking questions",
              text: "Ask Mwalimu AI in English or Kiswahili, or take a playful detour into the games arcade.",
              view: "tutor",
            },
          ].map(({ icon: Icon, title, text, view }) => (
            <div key={title}>
              <Icon className="mb-4 size-7 text-primary" />
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="my-4 text-sm leading-7 text-muted-foreground">{text}</p>
              <Button asChild variant="link" className="px-0">
                <Link to="/app/$view" params={{ view }}>
                  Explore <ArrowRight />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <h2 className="text-2xl font-bold">A pathway for every stage</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Playgroup & Pre-primary",
            "Lower & Upper Primary",
            "Junior School",
            "Senior School",
          ].map((stage) => (
            <div key={stage} className="border-b-2 border-learning-green py-5 text-sm font-bold">
              {stage}
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-8">
          <Link to="/demo" search={{ view: "curriculum" }}>
            Explore the curriculum first <ArrowRight />
          </Link>
        </Button>
      </section>
    </WebsiteShell>
  );
}
