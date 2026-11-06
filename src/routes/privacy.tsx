import { createFileRoute } from "@tanstack/react-router";
import { WebsitePage } from "@/components/WebsitePage";
import { websiteMeta } from "@/lib/website-meta";
export const Route = createFileRoute("/privacy")({
  head: () =>
    websiteMeta(
      "Privacy Policy",
      "How Elimu Bridge protects accounts and anonymous community learning activity.",
    ),
  component: Privacy,
});
function Privacy() {
  return (
    <WebsitePage
      eyebrow="PRIVACY FIRST"
      title="Privacy Policy"
      intro="Current privacy information · draft pending operator and legal review."
    >
      <div className="max-w-3xl space-y-8 text-sm leading-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-bold text-primary">Accounts and learning profiles</h2>
          <p>
            Your account and learner profiles are stored online and restricted to your account. Demo
            data stays on the device. Do not add assessment numbers, birth certificate numbers or
            unnecessary children’s contact information.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary">Optional community activity</h2>
          <p>
            Sharing is off by default. An adult or responsible parent/guardian must authorise
            sharing for every learner on the account. Only general subject categories, completed
            lesson or quiz events, and recent online activity contribute to public totals. No names,
            scores, exact event timestamps, school details or contacts are publicly returned. Groups
            need at least five participants. Turning sharing off removes your shared activity and
            online presence.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary">AI learning support</h2>
          <p>
            Mwalimu uses Google Gemini for signed-in learning questions, with curated fallbacks.
            Questions are sent to the AI service for an explanation; avoid names, personal
            identifiers and sensitive information. AI can make mistakes. Ask a trusted teacher or
            adult to check important answers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-primary">Your choices and requests</h2>
          <p>
            Use Privacy choices in the signed-in learning portal to withdraw community sharing.
            Operator contact details, retention periods and the full account deletion process still
            need to be confirmed before this draft becomes a final policy.
          </p>
        </section>
      </div>
    </WebsitePage>
  );
}
