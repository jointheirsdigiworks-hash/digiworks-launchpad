import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageShell } from "@/components/PageShell";

const title = "Book a Free Strategy Session | JointHeirs DigiWorks Agency";
const description = "Book a complimentary strategy session to map your digital growth plan.";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: Book,
});

function Book() {
  return (
    <PageShell
      eyebrow="Strategy Session"
      title="Book a Free Strategy Session"
      intro="A focused conversation about where you are, where you want to be, and the fastest route there."
    >
      <EnquiryForm submitLabel="Request Session" />
    </PageShell>
  );
}
