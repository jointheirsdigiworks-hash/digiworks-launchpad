import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Portfolio & Case Studies | JointHeirs DigiWorks Agency";
const description = "Selected client work and measurable outcomes across web, brand, ads and AI automation.";

const studies = ["case-study-one", "case-study-two", "case-study-three", "case-study-four"];

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  return (
    <PageShell eyebrow="Portfolio" title="Case Studies" intro="Placeholder case studies until real projects are published from the admin dashboard.">
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {studies.map((slug, i) => (
          <Link key={slug} to="/portfolio/$slug" params={{ slug }} className="luxe-card p-8">
            <p className="font-display text-[11px] tracking-[0.24em] text-gold uppercase">Placeholder Sector</p>
            <h2 className="mt-4 text-2xl uppercase">Case Study {i + 1}</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Placeholder summary: scope, approach and outcome.
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
