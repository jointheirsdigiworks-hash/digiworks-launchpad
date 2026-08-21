import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "category", label: "Category", type: "text" },
  { name: "author", label: "Author", type: "text" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "body", label: "Body", type: "textarea", rows: 12, hint: "Separate paragraphs with a blank line" },
  { name: "cover_image_url", label: "Cover image URL", type: "text" },
  { name: "cover_image_alt", label: "Cover image alt text", type: "text" },
  { name: "reading_minutes", label: "Reading minutes", type: "number" },
  { name: "featured", label: "Featured article", type: "boolean" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "published_at", label: "Publish date", type: "date" },
  { name: "video_url", label: "Video URL", type: "text", hint: "MP4/WebM file URL, or a YouTube/Vimeo link" },
  { name: "video_kind", label: "Video kind", type: "select", options: ["file", "youtube", "vimeo"] },
  { name: "video_poster_url", label: "Video poster image URL", type: "text" },
  { name: "video_captions_url", label: "Captions (.vtt) URL", type: "text" },
  { name: "video_transcript", label: "Video transcript", type: "textarea", rows: 6 },
  { name: "video_is_featured", label: "Show video at top of article", type: "boolean" },
  { name: "video_autoplay", label: "Autoplay", type: "boolean" },
  { name: "video_muted", label: "Muted", type: "boolean" },
  { name: "video_loop", label: "Loop", type: "boolean" },
  { name: "video_controls", label: "Show controls", type: "boolean" },
];

export const Route = createFileRoute("/admin/blog")({
  head: () => ({
    meta: [
      { title: "Manage Blog | JointHeirs Admin" },
      { name: "description", content: "Create and edit insights articles and video posts." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Blog & Insights" description="Write articles, attach video, and control publishing.">
      <ResourceManager table="blog_posts" fields={fields} titleField="title" subtitleField="category" />
    </AdminShell>
  ),
});
