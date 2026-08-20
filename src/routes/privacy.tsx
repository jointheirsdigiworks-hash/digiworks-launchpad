import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

const title = "Privacy Policy | JointHeirs DigiWorks Agency";
const description = "How JointHeirs DigiWorks Agency collects, uses and protects personal data.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell eyebrow="Legal" title="Privacy Policy" intro="Placeholder policy text — replace with your reviewed legal copy.">
      <Placeholder label="Data collected, lawful basis, cookies, retention, third parties and contact for data requests." />
    </PageShell>
  );
}
