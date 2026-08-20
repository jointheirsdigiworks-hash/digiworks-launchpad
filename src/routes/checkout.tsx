import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

const title = "Checkout | JointHeirs DigiWorks Agency";
const description = "Complete your order securely.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: Checkout,
});

function Checkout() {
  return (
    <PageShell eyebrow="Checkout" title="Secure Checkout" intro="Payment integration is scheduled for a later phase.">
      <Placeholder label="Billing details, order summary and payment provider." />
    </PageShell>
  );
}
