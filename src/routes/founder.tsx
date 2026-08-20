import { createFileRoute } from "@tanstack/react-router";
import founderPortrait from "@/assets/founder-portrait.jpg";
import { PageShell, Placeholder } from "@/components/PageShell";
import { site } from "@/lib/site";

const title = "Founder & Leadership | JointHeirs DigiWorks Agency";
const description =
  "Ulrich Archie-Bong, Founder, President & CEO of JointHeirs DigiWorks Agency.";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/founder" },
    ],
    links: [{ rel: "canonical", href: "/founder" }],
  }),
  component: Founder,
});

function Founder() {
  return (
    <PageShell eyebrow="Leadership" title={site.founder} intro="Founder, President & Chief Executive Officer.">
      <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rounded-lg border border-gold" aria-hidden />
          <img
            src={founderPortrait}
            alt={`Portrait of ${site.founder}, Founder, President and CEO of ${site.name}`}
            width={1024}
            height={1280}
            loading="lazy"
            className="relative w-full rounded-md object-cover shadow-[var(--shadow-luxe)]"
          />
        </div>
        <Placeholder label="Founder biography, leadership philosophy, speaking topics and career milestones — placeholders until final copy is provided." />
      </div>
    </PageShell>
  );
}
