import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { getCmsPage, type PageBlock } from "@/lib/pages.functions";
import { site } from "@/lib/site";

export const Route = createFileRoute("/pages/$slug")({
  validateSearch: z.object({ token: z.string().uuid().optional() }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: async ({ params, deps }) => {
    const result = await getCmsPage({ data: { slug: params.slug, ...(deps.token ? { token: deps.token } : {}) } });
    if (!result.page) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.page) {
      return { meta: [{ title: `Unavailable | ${site.name}` }, { name: "robots", content: "noindex" }] };
    }
    const page = loaderData.page;
    const title = page.meta_title || `${page.title} | ${site.name}`;
    const description = page.meta_description || page.intro || site.tagline;
    const meta: { title?: string; name?: string; property?: string; content?: string }[] = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (page.og_image_url?.startsWith("https://")) {
      meta.push({ property: "og:image", content: page.og_image_url });
      meta.push({ name: "twitter:image", content: page.og_image_url });
    }
    if (loaderData.preview || page.status !== "published") {
      meta.push({ name: "robots", content: "noindex, nofollow" });
    }
    return { meta };
  },
  component: CmsPage,
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6">
      <h1 className="text-2xl uppercase">This page didn't load</h1>
      <p className="mt-3 text-sm text-muted-foreground">Please refresh, or try again shortly.</p>
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6">
      <h1 className="text-2xl uppercase">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This page may have been unpublished or moved.</p>
    </main>
  ),
});

function Block({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="mt-12 font-display text-2xl uppercase tracking-[0.08em]">{block.text}</h2>;
    case "text":
      return (
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {block.text.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      );
    case "list":
      return (
        <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <figure className="mt-8">
          <img
            src={block.url}
            alt={block.alt}
            loading="lazy"
            className="w-full rounded-xl border border-gold-soft object-cover"
          />
          {block.caption && (
            <figcaption className="mt-3 text-xs text-muted-foreground">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "video":
      return (
        <figure className="mt-8">
          <VideoPlayer url={block.url} poster={block.poster ?? null} title={block.caption ?? "Page video"} />
          {block.caption && (
            <figcaption className="mt-3 text-xs text-muted-foreground">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "cta":
      return (
        <div className="mt-8">
          <a
            href={block.href}
            className="inline-flex rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] text-ink uppercase"
          >
            {block.label}
          </a>
        </div>
      );
    default:
      return null;
  }
}

function CmsPage() {
  const { page, preview } = Route.useLoaderData();
  if (!page) return null;
  const blocks = Array.isArray(page.blocks) ? page.blocks : [];

  return (
    <main className="mx-auto max-w-3xl px-4 pt-28 pb-24 sm:px-6">
      {(preview || page.status !== "published") && (
        <p className="mb-8 rounded-full border border-gold-soft px-4 py-2 text-center font-display text-[10px] tracking-[0.22em] text-gold uppercase">
          Preview — {page.status}
          {page.publish_at ? ` · goes live ${new Date(page.publish_at).toLocaleString()}` : ""}
        </p>
      )}
      <header>
        <h1 className="text-3xl uppercase sm:text-4xl">{page.headline || page.title}</h1>
        {page.intro && <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{page.intro}</p>}
      </header>
      <article>
        {blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </article>
    </main>
  );
}
