import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type SearchResult = {
  kind: "Page" | "Service" | "Case Study" | "Insight" | "Product" | "Book";
  title: string;
  excerpt: string;
  path: string;
};

const querySchema = (input: unknown) =>
  z.object({ q: z.string().trim().max(120).default("") }).parse(input ?? {});

export const searchSite = createServerFn({ method: "GET" })
  .inputValidator(querySchema)
  .handler(async ({ data }): Promise<{ query: string; results: SearchResult[] }> => {
    const q = data.q.trim();
    if (q.length < 2) return { query: q, results: [] };

    const { publicDb } = await import("./public-db.server");
    const { STATIC_PAGES, rankResults } = await import("./search-index");
    const db = publicDb();
    const like = `%${q.replace(/[%_,]/g, " ")}%`;

    const [services, studies, posts, products] = await Promise.all([
      db
        .from("services")
        .select("slug, name, short_description")
        .eq("active", true)
        .or(`name.ilike.${like},short_description.ilike.${like},full_description.ilike.${like}`)
        .limit(12),
      db
        .from("case_studies")
        .select("slug, title, client_name, result_summary")
        .eq("published", true)
        .or(`title.ilike.${like},client_name.ilike.${like},result_summary.ilike.${like}`)
        .limit(12),
      db
        .from("blog_posts")
        .select("slug, title, excerpt")
        .eq("published", true)
        .or(`title.ilike.${like},excerpt.ilike.${like},body.ilike.${like}`)
        .limit(12),
      db
        .from("products")
        .select("slug, title, short_description, category")
        .eq("published", true)
        .or(`title.ilike.${like},short_description.ilike.${like},category.ilike.${like}`)
        .limit(12),
    ]);

    const results: SearchResult[] = [
      ...STATIC_PAGES.filter((page) =>
        `${page.title} ${page.excerpt} ${page.keywords}`.toLowerCase().includes(q.toLowerCase()),
      ).map((page) => ({ kind: "Page" as const, title: page.title, excerpt: page.excerpt, path: page.path })),
      ...(services.data ?? []).map((row) => ({
        kind: "Service" as const,
        title: row.name,
        excerpt: row.short_description ?? "",
        path: `/services/${row.slug}`,
      })),
      ...(studies.data ?? []).map((row) => ({
        kind: "Case Study" as const,
        title: row.title,
        excerpt: row.result_summary ?? row.client_name ?? "",
        path: `/portfolio/${row.slug}`,
      })),
      ...(posts.data ?? []).map((row) => ({
        kind: "Insight" as const,
        title: row.title,
        excerpt: row.excerpt ?? "",
        path: `/insights/${row.slug}`,
      })),
      ...(products.data ?? []).map((row) => ({
        kind: row.category === "Books" ? ("Book" as const) : ("Product" as const),
        title: row.title,
        excerpt: row.short_description ?? "",
        path: `/shop/${row.slug}`,
      })),
    ];

    return { query: q, results: rankResults(results, q).slice(0, 30) };
  });
