import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { listServices } from "@/lib/content.functions";
import { coverFor } from "@/lib/service-images";

const title = "Digital Marketing & AI Services in Lagos, Nigeria | JointHeirs DigiWorks";
const description =
  "Website design, branding, logo design, copywriting, Facebook and Instagram ads, AI automation, prompt engineering and consulting from a Lagos digital agency.";

export const Route = createFileRoute("/services/")({
  loader: () => listServices(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  errorComponent: () => (
    <PageShell eyebrow="Services" title="Services Unavailable" intro="Please refresh the page in a moment." />
  ),
  component: Services,
});

function Services() {
  const { services } = Route.useLoaderData();

  return (
    <PageShell
      eyebrow="Services"
      title="Complete Digital Capability"
      intro="Every service below is delivered with the same standard: premium craft, measurable outcomes. Serving Lagos, Nigeria and clients worldwide."
    >
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Link
            key={service.slug}
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="luxe-card group flex flex-col overflow-hidden"
          >
            <img
              src={service.hero_image_url ?? coverFor(service.slug, index)}
              alt={service.hero_image_alt ?? `${service.name} service by JointHeirs DigiWorks Agency`}
              loading="lazy"
              width={800}
              height={450}
              className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="flex flex-1 flex-col p-7">
              {service.category && (
                <p className="font-display text-[10px] tracking-[0.24em] text-gold uppercase">
                  {service.category}
                </p>
              )}
              <h2 className="mt-3 text-lg leading-snug uppercase">{service.name}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.short_description}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-display text-[11px] tracking-[0.2em] text-gold uppercase">
                Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
