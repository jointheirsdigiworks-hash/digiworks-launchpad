import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { listCaseStudies } from "@/lib/content.functions";
import { coverFor } from "@/lib/service-images";

const title = "Portfolio & Case Studies | Lagos Digital Agency | JointHeirs DigiWorks";
const description =
  "See measurable results from web design, branding, paid social and AI automation projects delivered in Nigeria and beyond.";

export const Route = createFileRoute("/portfolio/")({
  loader: () => listCaseStudies(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  errorComponent: () => (
    <PageShell eyebrow="Portfolio" title="Portfolio Unavailable" intro="Please refresh the page in a moment." />
  ),
  component: Portfolio,
});

function Portfolio() {
  const { studies } = Route.useLoaderData();
  const [filter, setFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(studies.map((study) => study.category)))],
    [studies],
  );
  const visible = filter === "All" ? studies : studies.filter((study) => study.category === filter);

  return (
    <PageShell
      eyebrow="Portfolio"
      title="Case Studies"
      intro="Selected client work and the measurable outcomes behind it."
    >
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter case studies by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
            className={`rounded-full border px-5 py-2 font-display text-[11px] tracking-[0.18em] uppercase transition ${
              filter === category
                ? "border-gold bg-gold text-ink"
                : "border-gold-soft text-muted-foreground hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {visible.map((study, index) => (
          <Link
            key={study.slug}
            to="/portfolio/$slug"
            params={{ slug: study.slug }}
            className="luxe-card group block break-inside-avoid overflow-hidden"
          >
            <img
              src={study.cover_image_url ?? coverFor(study.slug, index)}
              alt={study.cover_image_alt ?? `${study.title} case study cover image`}
              loading="lazy"
              width={900}
              height={index % 3 === 1 ? 1200 : 700}
              className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                index % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]"
              }`}
            />
            <div className="p-7">
              <p className="font-display text-[10px] tracking-[0.24em] text-gold uppercase">{study.category}</p>
              <h2 className="mt-3 text-xl leading-snug uppercase">{study.title}</h2>
              <p className="mt-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
                {study.client_name} · {study.industry}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{study.result_summary}</p>
            </div>
          </Link>
        ))}
        {visible.length === 0 && <p className="text-sm text-muted-foreground">No case studies in this category yet.</p>}
      </div>
    </PageShell>
  );
}
