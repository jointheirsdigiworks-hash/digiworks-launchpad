import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { services } from "@/lib/site";

const title = "Services | JointHeirs DigiWorks Agency";
const description =
  "Websites, funnels, branding, graphic design, copywriting, paid social, AI automation, consulting and more.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  return (
    <PageShell
      eyebrow="Services"
      title="Complete Digital Capability"
      intro="Every service below is delivered with the same standard: premium craft, measurable outcomes."
    >
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.slug}
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="luxe-card group flex flex-col p-7"
          >
            <h2 className="text-lg leading-snug uppercase">{service.name}</h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.blurb}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-[11px] tracking-[0.2em] text-gold uppercase">
              Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
