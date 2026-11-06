import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, FileText, School, ArrowRight } from "lucide-react";
import { WebsiteShell } from "@/components/WebsiteShell";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Teacher resources and CBE planning | ElimuBridge" },
      {
        name: "description",
        content:
          "Explore curriculum designs, teaching links, exam resources and school portfolios in ElimuBridge.",
      },
      { property: "og:title", content: "For teachers | ElimuBridge" },
      {
        property: "og:description",
        content: "Bring curriculum, assessment and teaching resources into your next lesson.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Teachers,
});
function Teachers() {
  return (
    <WebsiteShell>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-learning-green">
          For the difference-makers
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
          Teacher resources.
          <br />
          More time for bright minds.
        </h1>
        <p className="mt-6 max-w-2xl leading-8 text-muted-foreground">
          Bring CBE learning areas, assessment practice, teaching links, and school materials
          together for your next lesson.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link to="/auth">
            Open your learning account <ArrowRight />
          </Link>
        </Button>
      </section>
      <section className="border-y border-border bg-muted">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Curriculum planning",
              text: "Browse CBE designs, learning areas, and strands from Playgroup to Grade 12.",
              view: "curriculum",
            },
            {
              icon: FileText,
              title: "Assessment resources",
              text: "Explore the exam bank, revision questions, and worked assessment explanations.",
              view: "exambank",
            },
            {
              icon: School,
              title: "Your teaching toolkit",
              text: "Organise teaching notes and links in the school portfolio and resource library.",
              view: "portfolio",
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
        <h2 className="text-2xl font-bold">Take a look around.</h2>
        <p className="mt-4 text-muted-foreground">
          Explore the existing teaching tools with sample school data.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/demo" search={{ view: "resources" }}>
            Explore teacher links <ArrowRight />
          </Link>
        </Button>
      </section>
    </WebsiteShell>
  );
}
