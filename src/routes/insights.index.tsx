import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";

const title = "Insights & Blog | JointHeirs DigiWorks Agency";
const description = "Practical writing on AI, digital growth, branding and conversion for African businesses.";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: Insights,
});

function Insights() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageShell eyebrow="Insights" title="Ideas That Compound" intro="Articles are published dynamically from the admin dashboard.">
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {isLoading && [0, 1, 2].map((n) => <div key={n} className="luxe-card h-44 animate-pulse" />)}
        {posts?.map((post) => (
          <Link key={post.id} to="/insights/$slug" params={{ slug: post.slug }} className="luxe-card p-8">
            {post.published_at && (
              <p className="font-display text-[11px] tracking-[0.24em] text-gold uppercase">
                {new Date(post.published_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
            <h2 className="mt-4 text-xl leading-snug uppercase">{post.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
        {!isLoading && !posts?.length && <p className="text-sm text-muted-foreground">No articles yet.</p>}
      </div>
    </PageShell>
  );
}
