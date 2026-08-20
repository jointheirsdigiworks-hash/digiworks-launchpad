import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

const title = "About Us | JointHeirs DigiWorks Agency";
const description =
  "Who we are: a Lagos-based AI powered digital growth agency building premium brands and systems.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <PageShell
      eyebrow="About Us"
      title="Your Growth Partner in the Age of AI"
      intro="Placeholder company story, mission and values. Editable from the admin dashboard in a later phase."
    >
      <Placeholder label="Company story, mission, values, team names and statistics — all placeholders until you provide the final content." />
    </PageShell>
  );
}
