import { createFileRoute, Link } from "@tanstack/react-router";
import { WebsitePage } from "@/components/WebsitePage";
import { Button } from "@/components/ui/button";
import { websiteMeta } from "@/lib/website-meta";
export const Route = createFileRoute("/contact")({
  head: () => websiteMeta("Contact", "Contact and school onboarding information for Elimu Bridge."),
  component: Contact,
});
function Contact() {
  return (
    <WebsitePage
      eyebrow="LET’S CONNECT"
      title="Contact Elimu Bridge"
      intro="For school onboarding, partnerships and questions about learning."
    >
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-primary">Contact details are being confirmed.</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          A verified email address, phone number and official social media links have not yet been
          supplied. We’ll publish them here when confirmed. No enquiry form is active yet, so please
          don’t enter children’s personal information.
        </p>
        <Button asChild className="mt-6">
          <Link to="/school-mode">Explore School Mode</Link>
        </Button>
      </div>
    </WebsitePage>
  );
}
