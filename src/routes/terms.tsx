import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

const title = "Terms & Conditions | JointHeirs DigiWorks Agency";
const description = "The terms that govern the use of our website and services.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PageShell eyebrow="Legal" title="Terms & Conditions" intro="Placeholder terms — replace with your reviewed legal copy.">
      <Placeholder label="Scope of services, payment terms, revisions, IP ownership, liability and governing law." />
    </PageShell>
  );
}
