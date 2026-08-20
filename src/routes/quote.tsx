import { createFileRoute } from "@tanstack/react-router";
import { QuoteWizard } from "@/components/forms/QuoteWizard";
import { PageShell } from "@/components/PageShell";

const title = "Request a Free Quote | JointHeirs DigiWorks Agency Lagos";
const description =
  "Tell us about your project in four quick steps and receive a tailored quote from our Lagos-based digital growth team.";

export const Route = createFileRoute("/quote")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search["service"] === "string" ? search["service"].slice(0, 160) : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/quote" },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: Quote,
});

function Quote() {
  const { service } = Route.useSearch();
  return (
    <PageShell
      eyebrow="Request a Quote"
      title="Get a Free Quote"
      intro="Share your goals, timeline and budget range. We respond with a clear scope and price."
    >
      <QuoteWizard {...(service ? { presetService: service } : {})} />
    </PageShell>
  );
}
