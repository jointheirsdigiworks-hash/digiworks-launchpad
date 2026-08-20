import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/forms/BookingForm";
import { PageShell } from "@/components/PageShell";

const title = "Book a Free Strategy Session | JointHeirs DigiWorks Agency";
const description =
  "Book a complimentary strategy session with our Lagos team and map your digital growth plan for the next quarter.";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      intro="A focused conversation about where you are, where you want to be, and the fastest route there. Pick a date and an available slot (West Africa Time)."
    >
      <BookingForm />
    </PageShell>
  );
}
