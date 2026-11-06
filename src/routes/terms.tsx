import { createFileRoute } from "@tanstack/react-router";
import { WebsitePage } from "@/components/WebsitePage";
import { websiteMeta } from "@/lib/website-meta";
export const Route = createFileRoute("/terms")({
  head: () =>
    websiteMeta("Terms and Conditions", "Responsible use and learning guidance for Elimu Bridge."),
  component: Terms,
});
function Terms() {
  return (
    <WebsitePage
      eyebrow="LEARNING RESPONSIBLY"
      title="Terms and Conditions"
      intro="Draft learning service terms · pending operator and legal review."
    >
      <div className="max-w-3xl space-y-6 text-sm leading-8 text-muted-foreground">
        <h2 className="text-xl font-bold text-primary">Use the platform respectfully</h2>
        <p>
          Use resources for learning. Keep account access private, respect copyright and do not
          upload personal information about other learners. Children should use accounts with
          appropriate adult guidance.
        </p>
        <h2 className="text-xl font-bold text-primary">
          Learning support, not official certification
        </h2>
        <p>
          AI answers and practice quiz reports support revision; they may contain errors and are not
          official school results, KNEC certification or professional advice. Check important
          information with a teacher.
        </p>
        <h2 className="text-xl font-bold text-primary">School access</h2>
        <p>
          Creating an account, selecting a role label or entering a school code does not grant
          verified teacher or administrator permissions. School account administration and private
          shared resources require a separate verified setup.
        </p>
        <h2 className="text-xl font-bold text-primary">Before a final policy</h2>
        <p>
          Operator identity, contact details, service commitments, governing terms and any future
          fees must be supplied and reviewed before final terms are published.
        </p>
      </div>
    </WebsitePage>
  );
}
