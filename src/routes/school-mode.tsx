import { createFileRoute, Link } from "@tanstack/react-router";
import { WebsitePage } from "@/components/WebsitePage";
import { Button } from "@/components/ui/button";
import { websiteMeta } from "@/lib/website-meta";
export const Route = createFileRoute("/school-mode")({
  head: () =>
    websiteMeta(
      "School Mode",
      "Explore school portfolios, teacher materials and assessments with Elimu Bridge.",
    ),
  component: School,
});
function School() {
  return (
    <WebsitePage
      eyebrow="STRONGER TOGETHER"
      title="School Mode"
      intro="A connected learning space for Kenyan schools, their teachers and their learners."
    >
      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="section-heading">Support the people behind every lesson.</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
            <li>School portfolios, curriculum designs and teacher links.</li>
            <li>Learning materials and assessments through verified teacher access.</li>
            <li>School-specific resources in the existing learning portal.</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/auth">Register Your School</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/demo" search={{ view: "portfolio" }}>
                Explore school demo
              </Link>
            </Button>
          </div>
        </section>
        <section className="border-l-4 border-learning-gold pl-6">
          <h2 className="text-xl font-bold text-primary">School onboarding</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Start by creating an account for your school representative. An account or school code
            does not grant teacher or administrator privileges. Verified access must be provisioned
            before sharing private school materials.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Learner, teacher and class administration is not yet available as a self-service school
            service. The demo’s local school records are not a secure private school workspace.
          </p>
          <Button asChild variant="link" className="mt-4 px-0">
            <Link to="/contact">Contact and onboarding information</Link>
          </Button>
        </section>
      </div>
    </WebsitePage>
  );
}
