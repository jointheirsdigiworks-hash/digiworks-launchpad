import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/insights/$slug")({
  head: ({ params }) => {
    const title = "Article | JointHeirs DigiWorks Agency";
    const description = "Insights on AI powered digital growth from JointHeirs DigiWorks Agency.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/insights/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/insights/${params.slug}` }],
    };
  },
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("title, excerpt, body, published_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageShell
      eyebrow="Insights"
      title={isLoading ? "Loading…" : (post?.title ?? "Article not found")}
      intro={post?.excerpt ?? undefined}
    >
      <article className="mt-10 max-w-2xl text-muted-foreground whitespace-pre-line">
        {post?.body ?? (isLoading ? "" : "This article is not available.")}
      </article>
    </PageShell>
  );
}
