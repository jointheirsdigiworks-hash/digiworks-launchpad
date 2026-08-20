import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { getServiceBySlug } from "@/lib/content.functions";
import { coverFor } from "@/lib/service-images";

type Step = { title?: string; detail?: string };
type Faq = { q?: string; a?: string };

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const result = await getServiceBySlug({ data: { slug: params.slug } });
    if (!result.service) throw notFound();
    return result;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service Unavailable | JointHeirs DigiWorks Agency" }, { name: "robots", content: "noindex" }],
      };
    }
    const service = loaderData.service!;
    const title = `${service.name} in Lagos, Nigeria | JointHeirs DigiWorks Agency`;
    const description = service.short_description || "Premium digital services from JointHeirs DigiWorks Agency.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `/services/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <PageShell eyebrow="Service" title="Service Not Found" intro="This service is no longer listed.">
      <Link to="/services" className="mt-8 inline-block font-display text-[12px] tracking-[0.2em] text-gold uppercase">
        View all services
      </Link>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell eyebrow="Service" title="Service Unavailable" intro="Please refresh the page in a moment." />
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { service, related } = Route.useLoaderData();
  if (!service) return null;

  const features = (Array.isArray(service.features) ? service.features : []) as string[];
  const process = (Array.isArray(service.process) ? service.process : []) as Step[];
  const faqs = (Array.isArray(service.faqs) ? service.faqs : []) as Faq[];

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }
      : null;

  return (
    <main className="pt-28">
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-display text-[11px] tracking-[0.32em] text-gold uppercase">
              {service.category ?? "Service"}
            </p>
            <h1 className="mt-4 text-4xl uppercase sm:text-5xl">{service.name}</h1>
            <div className="gold-rule mt-6" />
            <p className="mt-6 text-muted-foreground">{service.short_description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/quote"
                search={{ service: service.name }}
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
          </div>
          <img
            src={service.hero_image_url ?? coverFor(slug)}
            alt={service.hero_image_alt ?? `${service.name} delivered by JointHeirs DigiWorks Agency in Lagos`}
            width={1600}
            height={900}
            className="aspect-[16/10] w-full rounded-md object-cover shadow-[var(--shadow-luxe)]"
          />
        </div>
      </section>

      {service.long_description && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl uppercase">Overview</h2>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-muted-foreground">{service.long_description}</p>
        </section>
      )}

      {features.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl uppercase">What's Included</h2>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature} className="luxe-card flex items-start gap-3 p-5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {process.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl uppercase">Our Process</h2>
          <ol className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((step, index) => (
              <li key={`${step.title}-${index}`} className="luxe-card p-6">
                <span className="font-display text-3xl text-gold-soft">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-base uppercase">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl uppercase">Frequently Asked</h2>
          <div className="mt-7 max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <details key={`${faq.q}-${index}`} className="luxe-card p-6">
                <summary className="cursor-pointer font-display text-sm tracking-[0.08em] uppercase">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <h2 className="text-2xl uppercase">Related Services</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/services/$slug"
                params={{ slug: item.slug }}
                className="luxe-card p-6"
              >
                <h3 className="text-base uppercase">{item.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.short_description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
