import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminDelete, adminList, adminSave } from "@/lib/admin.functions";
import type { PageBlock } from "@/lib/pages.functions";

type Row = Record<string, unknown>;

type Draft = {
  id: string | null;
  slug: string;
  title: string;
  headline: string;
  intro: string;
  blocks: PageBlock[];
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  status: "draft" | "scheduled" | "published";
  publish_at: string;
  show_in_nav: boolean;
  show_in_footer: boolean;
  nav_label: string;
  sort_order: number;
  preview_token: string | null;
};

const input =
  "mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-gold";
const label = "font-display text-[10px] tracking-[0.2em] uppercase text-muted-foreground";

const BLOCK_LABEL: Record<PageBlock["type"], string> = {
  heading: "Section heading",
  text: "Paragraph text",
  list: "Bullet list",
  image: "Image",
  video: "Video",
  cta: "Button / link",
};

function newBlock(type: PageBlock["type"]): PageBlock {
  switch (type) {
    case "heading":
      return { type: "heading", text: "" };
    case "text":
      return { type: "text", text: "" };
    case "list":
      return { type: "list", items: [""] };
    case "image":
      return { type: "image", url: "", alt: "" };
    case "video":
      return { type: "video", url: "" };
    case "cta":
      return { type: "cta", label: "", href: "" };
  }
}

function emptyDraft(): Draft {
  return {
    id: null,
    slug: "",
    title: "",
    headline: "",
    intro: "",
    blocks: [{ type: "text", text: "" }],
    meta_title: "",
    meta_description: "",
    og_image_url: "",
    status: "draft",
    publish_at: "",
    show_in_nav: false,
    show_in_footer: false,
    nav_label: "",
    sort_order: 0,
    preview_token: null,
  };
}

function toDraft(row: Row): Draft {
  const publishAt = row["publish_at"] as string | null;
  return {
    id: (row["id"] as string) ?? null,
    slug: (row["slug"] as string) ?? "",
    title: (row["title"] as string) ?? "",
    headline: (row["headline"] as string) ?? "",
    intro: (row["intro"] as string) ?? "",
    blocks: Array.isArray(row["blocks"]) ? (row["blocks"] as PageBlock[]) : [],
    meta_title: (row["meta_title"] as string) ?? "",
    meta_description: (row["meta_description"] as string) ?? "",
    og_image_url: (row["og_image_url"] as string) ?? "",
    status: ((row["status"] as Draft["status"]) ?? "draft") as Draft["status"],
    publish_at: publishAt ? new Date(publishAt).toISOString().slice(0, 16) : "",
    show_in_nav: Boolean(row["show_in_nav"]),
    show_in_footer: Boolean(row["show_in_footer"]),
    nav_label: (row["nav_label"] as string) ?? "",
    sort_order: Number(row["sort_order"] ?? 0),
    preview_token: (row["preview_token"] as string) ?? null,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function BlockEditor({
  block,
  onChange,
}: {
  block: PageBlock;
  onChange: (next: PageBlock) => void;
}) {
  if (block.type === "heading" || block.type === "text") {
    return (
      <textarea
        rows={block.type === "text" ? 6 : 2}
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder={block.type === "text" ? "Write your content. Leave a blank line between paragraphs." : "Heading"}
        className={input}
      />
    );
  }
  if (block.type === "list") {
    return (
      <div className="space-y-2">
        {block.items.map((item, index) => (
          <input
            key={index}
            value={item}
            onChange={(e) => {
              const items = [...block.items];
              items[index] = e.target.value;
              onChange({ ...block, items });
            }}
            placeholder={`Point ${index + 1}`}
            className={input}
          />
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          className="text-xs text-gold underline"
        >
          Add a bullet
        </button>
      </div>
    );
  }
  if (block.type === "image") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="Image URL (paste from Media Library)"
          className={input}
        />
        <input
          value={block.alt}
          onChange={(e) => onChange({ ...block, alt: e.target.value })}
          placeholder="Alt text (describes the image)"
          className={input}
        />
        <input
          value={block.caption ?? ""}
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          placeholder="Caption (optional)"
          className={`${input} sm:col-span-2`}
        />
      </div>
    );
  }
  if (block.type === "video") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="Video URL (MP4/WebM, YouTube or Vimeo)"
          className={input}
        />
        <input
          value={block.poster ?? ""}
          onChange={(e) => onChange({ ...block, poster: e.target.value })}
          placeholder="Poster image URL (optional)"
          className={input}
        />
        <input
          value={block.caption ?? ""}
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          placeholder="Caption (optional)"
          className={`${input} sm:col-span-2`}
        />
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        value={block.label}
        onChange={(e) => onChange({ ...block, label: e.target.value })}
        placeholder="Button label"
        className={input}
      />
      <input
        value={block.href}
        onChange={(e) => onChange({ ...block, href: e.target.value })}
        placeholder="Link, e.g. /contact"
        className={input}
      />
    </div>
  );
}

function PagesManager({ canEditFallback }: { canEditFallback: boolean }) {
  const queryClient = useQueryClient();
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);
  const [draft, setDraft] = useState<Draft | null>(null);

  const query = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: () => list({ data: { table: "pages" } }),
  });
  const canEdit = query.data?.canEdit ?? canEditFallback;
  const rows = (query.data?.rows ?? []) as Row[];

  const saveMutation = useMutation({
    mutationFn: async (payload: Draft) =>
      save({
        data: {
          table: "pages",
          id: payload.id,
          row: {
            slug: payload.slug,
            title: payload.title,
            headline: payload.headline || null,
            intro: payload.intro || null,
            blocks: payload.blocks as never,
            meta_title: payload.meta_title,
            meta_description: payload.meta_description,
            og_image_url: payload.og_image_url || null,
            status: payload.status,
            publish_at: payload.publish_at ? new Date(payload.publish_at).toISOString() : null,
            show_in_nav: payload.show_in_nav,
            show_in_footer: payload.show_in_footer,
            nav_label: payload.nav_label || null,
            sort_order: payload.sort_order,
          },
        },
      }),
    onSuccess: () => {
      toast.success("Page saved");
      setDraft(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save the page"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => remove({ data: { table: "pages", id } }),
    onSuccess: () => {
      toast.success("Page deleted");
      setDraft(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not delete the page"),
  });

  function updateBlock(index: number, next: PageBlock) {
    setDraft((current) =>
      current ? { ...current, blocks: current.blocks.map((block, i) => (i === index ? next : block)) } : current,
    );
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setDraft((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.blocks.length) return current;
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(index, 1);
      blocks.splice(target, 0, moved!);
      return { ...current, blocks };
    });
  }

  if (draft) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.slug.trim()) return toast.error("Add a page address (slug)");
          if (draft.status === "scheduled" && !draft.publish_at) {
            return toast.error("Pick a date and time for the scheduled publish");
          }
          saveMutation.mutate(draft);
        }}
        className="luxe-card space-y-6 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Page title</label>
            <input
              value={draft.title}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  title: e.target.value,
                  slug: draft.id ? draft.slug : slugify(e.target.value),
                })
              }
              className={input}
              required
            />
          </div>
          <div>
            <label className={label}>Page address</label>
            <input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
              className={input}
              required
            />
            <p className="mt-2 text-xs text-muted-foreground">Lives at /pages/{draft.slug || "your-page"}</p>
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Headline shown on the page</label>
            <input
              value={draft.headline}
              onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
              placeholder="Defaults to the page title"
              className={input}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Intro paragraph</label>
            <textarea
              rows={3}
              value={draft.intro}
              onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
              className={input}
            />
          </div>
        </div>

        <div>
          <h3 className="font-display text-[12px] tracking-[0.22em] uppercase">Content blocks</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Add text, images, video and buttons in any order. No code needed.
          </p>
          <div className="mt-5 space-y-4">
            {draft.blocks.map((block, index) => (
              <div key={index} className="rounded-lg border border-gold-soft p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-[10px] tracking-[0.2em] text-gold uppercase">
                    {BLOCK_LABEL[block.type]}
                  </span>
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Move up" onClick={() => moveBlock(index, -1)}>
                      <ArrowUp className="h-4 w-4 text-muted-foreground hover:text-gold" />
                    </button>
                    <button type="button" aria-label="Move down" onClick={() => moveBlock(index, 1)}>
                      <ArrowDown className="h-4 w-4 text-muted-foreground hover:text-gold" />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove block"
                      onClick={() =>
                        setDraft({ ...draft, blocks: draft.blocks.filter((_, i) => i !== index) })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <BlockEditor block={block} onChange={(next) => updateBlock(index, next)} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(BLOCK_LABEL) as PageBlock["type"][]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDraft({ ...draft, blocks: [...draft.blocks, newBlock(type)] })}
                className="rounded-full border border-gold-soft px-4 py-2 font-display text-[10px] tracking-[0.16em] uppercase text-muted-foreground hover:border-gold hover:text-gold"
              >
                + {BLOCK_LABEL[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Meta title (SEO)</label>
            <input
              value={draft.meta_title}
              onChange={(e) => setDraft({ ...draft, meta_title: e.target.value })}
              className={input}
              maxLength={70}
            />
          </div>
          <div>
            <label className={label}>Social share image URL</label>
            <input
              value={draft.og_image_url}
              onChange={(e) => setDraft({ ...draft, og_image_url: e.target.value })}
              className={input}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Meta description (SEO)</label>
            <textarea
              rows={2}
              value={draft.meta_description}
              onChange={(e) => setDraft({ ...draft, meta_description: e.target.value })}
              className={input}
              maxLength={200}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Status</label>
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as Draft["status"] })}
              className={input}
            >
              <option value="draft">Draft (hidden)</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published (live)</option>
            </select>
          </div>
          <div>
            <label className={label}>Publish date & time</label>
            <input
              type="datetime-local"
              value={draft.publish_at}
              onChange={(e) => setDraft({ ...draft, publish_at: e.target.value })}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Menu label</label>
            <input
              value={draft.nav_label}
              onChange={(e) => setDraft({ ...draft, nav_label: e.target.value })}
              placeholder="Defaults to the page title"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Menu order</label>
            <input
              type="number"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
              className={input}
            />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={draft.show_in_nav}
              onChange={(e) => setDraft({ ...draft, show_in_nav: e.target.checked })}
            />
            Show in the top navigation menu
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={draft.show_in_footer}
              onChange={(e) => setDraft({ ...draft, show_in_footer: e.target.checked })}
            />
            Show in the footer menu
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-gold-soft pt-5">
          <button
            type="submit"
            disabled={saveMutation.isPending || !canEdit}
            className="rounded-full bg-gold px-6 py-2.5 font-display text-[11px] tracking-[0.18em] text-ink uppercase disabled:opacity-60"
          >
            {saveMutation.isPending ? "Saving…" : "Save page"}
          </button>
          <button
            type="button"
            onClick={() => setDraft(null)}
            className="rounded-full border border-gold-soft px-6 py-2.5 font-display text-[11px] tracking-[0.18em] uppercase"
          >
            Cancel
          </button>
          {draft.id && draft.preview_token && (
            <a
              href={`/pages/${draft.slug}?token=${draft.preview_token}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-gold underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Preview this page
            </a>
          )}
          {draft.id && canEdit && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Delete this page permanently?")) deleteMutation.mutate(draft.id!);
              }}
              className="ml-auto inline-flex items-center gap-2 text-xs text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete page
            </button>
          )}
        </div>
      </form>
    );
  }

  return (
    <div>
      {canEdit && (
        <button
          type="button"
          onClick={() => setDraft(emptyDraft())}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-display text-[11px] tracking-[0.18em] text-ink uppercase"
        >
          <Plus className="h-4 w-4" /> New page
        </button>
      )}
      {query.isLoading ? (
        <p className="mt-7 text-sm text-muted-foreground">Loading pages…</p>
      ) : rows.length === 0 ? (
        <p className="mt-7 luxe-card p-6 text-sm text-muted-foreground">
          No custom pages yet. Create one to publish a new page without code.
        </p>
      ) : (
        <ul className="mt-7 space-y-3">
          {rows.map((row) => {
            const page = toDraft(row);
            return (
              <li key={page.id} className="luxe-card flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm uppercase">{page.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    /pages/{page.slug} · {page.status}
                    {page.publish_at ? ` · ${new Date(page.publish_at).toLocaleString()}` : ""}
                  </p>
                </div>
                <a
                  href={`/pages/${page.slug}?token=${page.preview_token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gold underline"
                >
                  Preview
                </a>
                <button
                  type="button"
                  onClick={() => setDraft(page)}
                  className="rounded-full border border-gold-soft px-4 py-2 font-display text-[10px] tracking-[0.16em] uppercase"
                >
                  {canEdit ? "Edit" : "View"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export const Route = createFileRoute("/admin/pages")({
  head: () => ({
    meta: [
      { title: "Manage Pages | JointHeirs Admin" },
      { name: "description", content: "Create, edit, schedule and delete website pages without code." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="Pages"
      description="Build and maintain website pages: text, images, video, buttons, SEO, menu placement, preview and scheduling."
      resource="pages"
    >
      {(role) => <PagesManager canEditFallback={role !== "viewer"} />}
    </AdminShell>
  ),
});
