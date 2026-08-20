import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { listPosts } from "@/lib/content.functions";
import { coverFor } from "@/lib/service-images";

const title = "Insights on AI & Digital Growth | JointHeirs DigiWorks Agency";
const description =
  "Practical articles and videos on AI, digital marketing, branding and conversion for Nigerian businesses.";

export const Route = createFileRoute("/insights/")({
  loader: () => listPosts(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  errorComponent: () => (
    <PageShell eyebrow="Insights" title="Insights Unavailable" intro="Please refresh the page in a moment." />
  ),
  component: Insights,
});

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function Insights() {
  const { posts } = Route.useLoaderData();
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((post) => post.category)))], [posts]);
  const visible = filter === "All" ? posts : posts.filter((post) => post.category === filter);
  const featured = posts.find((post) => post.featured) ?? null;

  return (
    <PageShell
      eyebrow="Insights"
      title="Ideas That Compound"
      intro="Writing and video from the JointHeirs DigiWorks team on AI, growth and premium brand building."
    >
      {featured && (
        <Link
          to="/insights/$slug"
          params={{ slug: featured.slug }}
          className="luxe-card group mt-12 grid overflow-hidden lg:grid-cols-2"
        >
          <img
            src={featured.cover_image_url ?? featured.video_poster_url ?? coverFor(featured.slug)}
            alt={featured.cover_image_alt ?? `${featured.title} article cover image`}
            width={1200}
            height={800}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="p-9">
            <p className="font-display text-[10px] tracking-[0.24em] text-gold uppercase">
              Featured · {featured.category}
            </p>
            <h2 className="mt-4 text-2xl leading-snug uppercase">{featured.title}</h2>
            <p className="mt-4 text-sm text-muted-foreground">{featured.excerpt}</p>
            <p className="mt-6 text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {formatDate(featured.published_at)} · {featured.reading_minutes} min read
            </p>
            {featured.video_url && (
              <span className="mt-5 inline-flex items-center gap-2 font-display text-[11px] tracking-[0.2em] text-gold uppercase">
                <PlayCircle className="h-4 w-4" aria-hidden /> Watch
              </span>
            )}
          </div>
        </Link>
      )}

      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
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

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {visible.map((post, index) => (
          <Link
            key={post.slug}
            to="/insights/$slug"
            params={{ slug: post.slug }}
            className="luxe-card group flex flex-col overflow-hidden"
          >
            <div className="relative">
              <img
                src={post.cover_image_url ?? post.video_poster_url ?? coverFor(post.slug, index)}
                alt={post.cover_image_alt ?? `${post.title} article cover image`}
                loading="lazy"
                width={800}
                height={500}
                className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              {post.video_url && (
                <PlayCircle
                  className="absolute bottom-4 left-4 h-9 w-9 text-gold drop-shadow"
                  aria-label="Contains video"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col p-7">
              <p className="font-display text-[10px] tracking-[0.24em] text-gold uppercase">{post.category}</p>
              <h2 className="mt-3 text-lg leading-snug uppercase">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {formatDate(post.published_at)} · {post.reading_minutes} min read
              </p>
            </div>
          </Link>
        ))}
        {visible.length === 0 && <p className="text-sm text-muted-foreground">No articles in this category yet.</p>}
      </div>
    </PageShell>
  );
}
