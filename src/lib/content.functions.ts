import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const slugInput = (input: unknown) => z.object({ slug: z.string().trim().min(1).max(200) }).parse(input);

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator(slugInput)
  .handler(async ({ data }) => {
    const { publicDb } = await import("./public-db.server");
    const { data: service } = await publicDb()
      .from("services")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (!service) return { service: null, related: [] };
    const { data: related } = await publicDb()
      .from("services")
      .select("slug, name, short_description")
      .eq("active", true)
      .neq("slug", data.slug)
      .eq("category", service.category ?? "")
      .order("sort_order")
      .limit(3);
    return { service, related: related ?? [] };
  });

export const getCaseStudyBySlug = createServerFn({ method: "GET" })
  .inputValidator(slugInput)
  .handler(async ({ data }) => {
    const { publicDb } = await import("./public-db.server");
    const { data: study } = await publicDb()
      .from("case_studies")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!study) return { study: null, related: [] };
    const { data: related } = await publicDb()
      .from("case_studies")
      .select("slug, title, client_name, cover_image_url, cover_image_alt, result_summary")
      .eq("published", true)
      .eq("category", study.category)
      .neq("slug", data.slug)
      .order("sort_order")
      .limit(3);
    return { study, related: related ?? [] };
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator(slugInput)
  .handler(async ({ data }) => {
    const { publicDb } = await import("./public-db.server");
    const nowIso = new Date().toISOString();
    const { data: post } = await publicDb()
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!post) return { post: null, related: [] };
    const { data: related } = await publicDb()
      .from("blog_posts")
      .select("slug, title, excerpt, cover_image_url, cover_image_alt, published_at, video_url")
      .eq("published", true)
      .lte("published_at", nowIso)
      .neq("slug", data.slug)
      .order("published_at", { ascending: false })
      .limit(3);
    return { post, related: related ?? [] };
  });

export const getSitemapEntries = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const db = publicDb();
  const [services, studies, posts] = await Promise.all([
    db.from("services").select("slug, updated_at").eq("active", true),
    db.from("case_studies").select("slug, updated_at").eq("published", true),
    db.from("blog_posts").select("slug, updated_at").eq("published", true),
  ]);
  return {
    services: services.data ?? [],
    studies: studies.data ?? [],
    posts: posts.data ?? [],
  };
});

export const getRobotsContent = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb().from("site_settings").select("value").eq("key", "robots").maybeSingle();
  const value = (data?.value ?? {}) as { content?: string };
  return { content: value.content ?? "User-agent: *\nAllow: /\nDisallow: /admin\n" };
});

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb()
    .from("services")
    .select("slug, name, short_description, category, hero_image_url, hero_image_alt")
    .eq("active", true)
    .order("sort_order");
  return { services: data ?? [] };
});

export const listCaseStudies = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb()
    .from("case_studies")
    .select("slug, title, client_name, industry, category, cover_image_url, cover_image_alt, result_summary")
    .eq("published", true)
    .order("sort_order");
  return { studies: data ?? [] };
});

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb()
    .from("blog_posts")
    .select(
      "slug, title, excerpt, category, author, cover_image_url, cover_image_alt, published_at, reading_minutes, featured, video_url, video_kind, video_poster_url, video_is_featured",
    )
    .eq("published", true)
    .order("published_at", { ascending: false });
  return { posts: data ?? [] };
});

export const getFounderPage = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const db = publicDb();
  const [settings, team] = await Promise.all([
    db.from("site_settings").select("value").eq("key", "founder").maybeSingle(),
    db
      .from("team_members")
      .select("id, name, designation, bio, photo_url, photo_alt, social_url")
      .eq("active", true)
      .order("sort_order"),
  ]);
  return {
    founder: (settings.data?.value ?? {}) as {
      title?: string;
      intro?: string;
      name?: string;
      role?: string;
      story?: string[];
      quote?: string;
      portrait_url?: string;
      portrait_alt?: string;
      socials?: { label?: string; url?: string }[];
    },
    team: team.data ?? [],
  };
});
