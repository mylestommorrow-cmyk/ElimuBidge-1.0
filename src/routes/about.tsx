import { createFileRoute, Link } from "@tanstack/react-router";
import { WebsitePage } from "@/components/WebsitePage";
import { Button } from "@/components/ui/button";
import { websiteMeta } from "@/lib/website-meta";
export const Route = createFileRoute("/about")({
  head: () =>
    websiteMeta(
      "About Us",
      "Our mission is to make quality education accessible to every learner in Kenya.",
    ),
  component: About,
});
function About() {
  return (
    <WebsitePage
      eyebrow="OUR PURPOSE"
      title="Every learner deserves a way forward."
      intro="Elimu Bridge exists to bridge learning gaps and make quality education accessible to every learner in Kenya."
    >
      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="section-heading">Opportunity, not circumstance.</h2>
          <p className="mt-5 leading-8 text-muted-foreground">
            We bring learning resources, practice assessments and guided AI support together for
            learners, teachers and schools. Our focus is confidence, curiosity and steady progress
            through Kenya’s CBE learning journey.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary">Built around the learner</h2>
          <ul className="my-5 space-y-4 text-muted-foreground">
            <li>Accessible resources for underserved communities.</li>
            <li>English and Kiswahili learning support.</li>
            <li>Learning at school and at your own pace.</li>
            <li>Children’s privacy before public numbers.</li>
          </ul>
          <Button asChild>
            <Link to="/independent-learning">Find your learning path</Link>
          </Button>
        </section>
      </div>
    </WebsitePage>
  );
}
