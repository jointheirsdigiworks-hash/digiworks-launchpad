import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { getCaseStudyBySlug } from "@/lib/content.functions";
import { coverFor } from "@/lib/service-images";

type Result = { label?: string; value?: string };
type GalleryItem = { url?: string; alt?: string };

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const result = await getCaseStudyBySlug({ data: { slug: params.slug } });
    if (!result.study) throw notFound();
    return result;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Case Study Unavailable | JointHeirs DigiWorks Agency" }, { name: "robots", content: "noindex" }],
      };
    }
    const study = loaderData.study!;
    const title = `${study.title} | Case Study | JointHeirs DigiWorks Agency`;
    const description = study.result_summary || "A detailed look at the brief, approach and measurable outcome.";
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `/portfolio/${params.slug}` },
    ];
    if (study.cover_image_url?.startsWith("https://")) {
      meta.push(
        { property: "og:image", content: study.cover_image_url },
        { name: "twitter:image", content: study.cover_image_url },
      );
    }
    return { meta, links: [{ rel: "canonical", href: `/portfolio/${params.slug}` }] };
  },
  notFoundComponent: () => (
    <PageShell eyebrow="Case Study" title="Case Study Not Found" intro="This project is no longer published.">
      <Link to="/portfolio" className="mt-8 inline-block font-display text-[12px] tracking-[0.2em] text-gold uppercase">
        View all case studies
      </Link>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell eyebrow="Case Study" title="Case Study Unavailable" intro="Please refresh the page in a moment." />
  ),
  component: CaseStudyDetail,
});

function CaseStudyDetail() {
  const { slug } = Route.useParams();
  const { study, related } = Route.useLoaderData();
  if (!study) return null;

  const results = (Array.isArray(study.results) ? study.results : []) as Result[];
  const gallery = (Array.isArray(study.gallery) ? study.gallery : []) as GalleryItem[];

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="font-display text-[11px] tracking-[0.32em] text-gold uppercase">{study.category}</p>
        <h1 className="mt-4 max-w-3xl text-4xl uppercase sm:text-5xl">{study.title}</h1>
        <div className="gold-rule mt-6" />
        <p className="mt-6 text-xs tracking-[0.16em] text-muted-foreground uppercase">
          {study.client_name} · {study.industry}
        </p>
        <img
          src={study.cover_image_url ?? coverFor(slug)}
          alt={study.cover_image_alt ?? `${study.title} project cover image`}
          width={1600}
          height={900}
          className="mt-10 aspect-[16/9] w-full rounded-md object-cover shadow-[var(--shadow-luxe)]"
        />
      </section>

      {results.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            {results.map((result, index) => (
              <div key={`${result.label}-${index}`} className="luxe-card p-7 text-center">
                <p className="font-display text-3xl text-gold">{result.value}</p>
                <p className="mt-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">{result.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-2xl uppercase">The Challenge</h2>
          <p className="mt-4 whitespace-pre-line text-muted-foreground">{study.challenge}</p>
        </div>
        <div>
          <h2 className="text-2xl uppercase">The Solution</h2>
          <p className="mt-4 whitespace-pre-line text-muted-foreground">{study.solution}</p>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl uppercase">Gallery</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <img
                key={`${item.url}-${index}`}
                src={item.url}
                alt={item.alt ?? `${study.title} gallery image ${index + 1}`}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {study.testimonial_quote && (
        <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6">
          <blockquote className="luxe-card p-9">
            <p className="text-lg italic">“{study.testimonial_quote}”</p>
            {study.testimonial_author && (
              <footer className="mt-5 font-display text-[11px] tracking-[0.22em] text-gold uppercase">
                {study.testimonial_author}
              </footer>
            )}
          </blockquote>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/quote"
            className="rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink"
            search={{}}
          >
            Start a Project
          </Link>
          <Link
            to="/portfolio"
            className="rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase"
          >
            All Case Studies
          </Link>
        </div>

        {related.length > 0 && (
          <>
            <h2 className="mt-16 text-2xl uppercase">Related Work</h2>
            <div className="mt-7 grid gap-6 sm:grid-cols-3">
              {related.map((item, index) => (
                <Link
                  key={item.slug}
                  to="/portfolio/$slug"
                  params={{ slug: item.slug }}
                  className="luxe-card overflow-hidden"
                >
                  <img
                    src={item.cover_image_url ?? coverFor(item.slug, index)}
                    alt={item.cover_image_alt ?? `${item.title} case study cover image`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-base uppercase">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.result_summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
