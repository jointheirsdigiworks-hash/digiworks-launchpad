import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { PageShell } from "@/components/PageShell";
import { getPostBySlug } from "@/lib/content.functions";
import { coverFor } from "@/lib/service-images";

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const result = await getPostBySlug({ data: { slug: params.slug } });
    if (!result.post) throw notFound();
    return result;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article Unavailable | JointHeirs DigiWorks Agency" }, { name: "robots", content: "noindex" }],
      };
    }
    const post = loaderData.post!;
    const title = `${post.title} | JointHeirs DigiWorks Agency`;
    const description = post.excerpt || "Insights on AI powered digital growth from JointHeirs DigiWorks Agency.";
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `/insights/${params.slug}` },
    ];
    const image = post.cover_image_url ?? post.video_poster_url;
    if (image?.startsWith("https://")) {
      meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
    }
    return { meta, links: [{ rel: "canonical", href: `/insights/${params.slug}` }] };
  },
  notFoundComponent: () => (
    <PageShell eyebrow="Insights" title="Article Not Found" intro="This article is no longer published.">
      <Link to="/insights" className="mt-8 inline-block font-display text-[12px] tracking-[0.2em] text-gold uppercase">
        Read other insights
      </Link>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell eyebrow="Insights" title="Article Unavailable" intro="Please refresh the page in a moment." />
  ),
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();
  const { post, related } = Route.useLoaderData();
  if (!post) return null;

  const published = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    author: { "@type": "Organization", name: post.author },
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    articleSection: post.category,
  };

  const videoSettings = post.video_url
    ? {
        url: post.video_url,
        kind: post.video_kind,
        poster: post.video_poster_url,
        captions: post.video_captions_url,
        autoplay: post.video_autoplay,
        muted: post.video_muted,
        loop: post.video_loop,
        controls: post.video_controls,
        title: post.title,
      }
    : null;

  return (
    <main className="pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="font-display text-[11px] tracking-[0.32em] text-gold uppercase">{post.category}</p>
        <h1 className="mt-4 text-3xl leading-tight uppercase sm:text-4xl">{post.title}</h1>
        <div className="gold-rule mt-6" />
        <p className="mt-5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
          {post.author}
          {published ? ` · ${published}` : ""} · {post.reading_minutes} min read
        </p>

        {videoSettings && post.video_is_featured ? (
          <div className="mt-10">
            <VideoPlayer {...videoSettings} />
            {post.video_transcript && (
              <details className="luxe-card mt-4 p-4 text-sm">
                <summary className="cursor-pointer font-display text-[11px] tracking-[0.2em] uppercase">
                  Video transcript
                </summary>
                <p className="mt-3 whitespace-pre-line text-muted-foreground">{post.video_transcript}</p>
              </details>
            )}
          </div>
        ) : (
          <img
            src={post.cover_image_url ?? coverFor(slug)}
            alt={post.cover_image_alt ?? `${post.title} article cover image`}
            width={1200}
            height={675}
            className="mt-10 aspect-[16/9] w-full rounded-md object-cover shadow-[var(--shadow-luxe)]"
          />
        )}

        {post.excerpt && <p className="mt-10 text-lg text-foreground/90">{post.excerpt}</p>}

        <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
          {(post.body ?? "").split(/\n{2,}/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {videoSettings && !post.video_is_featured && (
          <div className="mt-12">
            <h2 className="text-xl uppercase">Watch</h2>
            <div className="mt-5">
              <VideoPlayer {...videoSettings} />
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <h2 className="text-2xl uppercase">Keep Reading</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-3">
            {related.map((item, index) => (
              <Link
                key={item.slug}
                to="/insights/$slug"
                params={{ slug: item.slug }}
                className="luxe-card overflow-hidden"
              >
                <img
                  src={item.cover_image_url ?? coverFor(item.slug, index)}
                  alt={item.cover_image_alt ?? `${item.title} article cover image`}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-base leading-snug uppercase">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
