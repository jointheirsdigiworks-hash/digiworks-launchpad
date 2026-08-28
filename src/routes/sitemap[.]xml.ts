import { createFileRoute } from "@tanstack/react-router";

const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/insights",
  "/shop",
  "/founder",
  "/contact",
  "/quote",
  "/book",
  "/privacy",
  "/terms",
];

function urlEntry(origin: string, path: string, lastmod?: string | null) {
  return [
    "  <url>",
    `    <loc>${origin}${path}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { publicDb } = await import("@/lib/public-db.server");
        const db = publicDb();
        const [services, studies, posts, products] = await Promise.all([
          db.from("services").select("slug, updated_at").eq("active", true),
          db.from("case_studies").select("slug, updated_at").eq("published", true),
          db.from("blog_posts").select("slug, updated_at").eq("published", true),
          db.from("products").select("slug, updated_at").eq("published", true),
        ]);

        const entries = [
          ...STATIC_PATHS.map((path) => urlEntry(origin, path)),
          ...(services.data ?? []).map((row) => urlEntry(origin, `/services/${row.slug}`, row.updated_at)),
          ...(studies.data ?? []).map((row) => urlEntry(origin, `/portfolio/${row.slug}`, row.updated_at)),
          ...(posts.data ?? []).map((row) => urlEntry(origin, `/insights/${row.slug}`, row.updated_at)),
          ...(products.data ?? []).map((row) => urlEntry(origin, `/shop/${row.slug}`, row.updated_at)),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`.replace(
          "www.sitemap.org",
          "www.sitemaps.org",
        );

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
