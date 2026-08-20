import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageShell } from "@/components/PageShell";

const title = "Request a Free Quote | JointHeirs DigiWorks Agency";
const description = "Tell us about your project and receive a tailored quote from our team.";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/quote" },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: Quote,
});

function Quote() {
  return (
    <PageShell
      eyebrow="Request a Quote"
      title="Get a Free Quote"
      intro="Share your goals, timeline and budget range. We respond with a clear scope and price."
    >
      <EnquiryForm submitLabel="Request Quote" />
    </PageShell>
  );
}
