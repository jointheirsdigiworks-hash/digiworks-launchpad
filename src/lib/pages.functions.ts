import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type PageBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "video"; url: string; poster?: string; caption?: string }
  | { type: "cta"; label: string; href: string }
  | { type: "list"; items: string[] };

export type LivePage = {
  id: string;
  slug: string;
  title: string;
  headline: string | null;
  intro: string | null;
  blocks: PageBlock[];
  meta_title: string;
  meta_description: string;
  og_image_url: string | null;
  status: string;
  publish_at: string | null;
  updated_at: string;
};

const PAGE_COLUMNS =
  "id, slug, title, headline, intro, blocks, meta_title, meta_description, og_image_url, status, publish_at, updated_at";

/**
 * Fetch a CMS page for the public site.
 * A `token` matching the page's preview token returns drafts and scheduled
 * pages so the admin can preview before publishing.
 */
export const getCmsPage = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        slug: z
          .string()
          .trim()
          .min(1)
          .max(120)
          .regex(/^[a-z0-9-]+$/i),
        token: z.string().uuid().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    if (data.token) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: preview } = await supabaseAdmin
        .from("pages")
        .select(PAGE_COLUMNS)
        .eq("slug", data.slug)
        .eq("preview_token", data.token)
        .maybeSingle();
      return { page: (preview ?? null) as LivePage | null, preview: true };
    }

    const { publicDb } = await import("./public-db.server");
    const { data: page } = await publicDb()
      .from("pages")
      .select(PAGE_COLUMNS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .lte("publish_at", new Date().toISOString())
      .maybeSingle();
    return { page: (page ?? null) as LivePage | null, preview: false };
  });

/** Published pages flagged for the navigation menu and/or footer. */
export const listCmsNavPages = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb()
    .from("pages")
    .select("slug, title, nav_label, show_in_nav, show_in_footer, sort_order")
    .eq("status", "published")
    .lte("publish_at", new Date().toISOString())
    .order("sort_order");
  const rows = data ?? [];
  const map = (row: (typeof rows)[number]) => ({
    slug: row.slug as string,
    label: (row.nav_label as string | null) || (row.title as string),
  });
  return {
    nav: rows.filter((r) => r.show_in_nav).map(map),
    footer: rows.filter((r) => r.show_in_footer).map(map),
  };
});

/** Admin-editable site-wide identity/contact overrides for header & footer. */
export const getSiteIdentity = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb().from("site_settings").select("value").eq("key", "identity").maybeSingle();
  return {
    identity: (data?.value ?? {}) as {
      site_title?: string;
      tagline?: string;
      footer_blurb?: string;
      email?: string;
      phone_primary?: string;
      phone_secondary?: string;
      whatsapp?: string;
      address?: string;
    },
  };
});
