import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";
import { services } from "@/lib/site";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    const title = `${service?.name ?? "Service"} | JointHeirs DigiWorks Agency`;
    const description = service?.blurb ?? "Premium digital services from JointHeirs DigiWorks Agency.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/services/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = services.find((s) => s.slug === slug);

  return (
    <PageShell
      eyebrow="Service"
      title={service?.name ?? "Service Detail"}
      intro={service?.blurb ?? "This service detail page is dynamic and will be admin-managed."}
    >
      <Placeholder label="Deliverables, process, pricing tiers, FAQs and related case studies — dynamic content managed from the admin dashboard." />
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/quote"
          className="rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink"
        >
          Get a Free Quote
        </Link>
        <Link
          to="/book"
          className="rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase"
        >
          Book a Strategy Session
        </Link>
      </div>
    </PageShell>
  );
}
