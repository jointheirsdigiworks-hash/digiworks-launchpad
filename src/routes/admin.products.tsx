import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "URL segment, e.g. ai-marketing-ebook" },
  { name: "short_description", label: "Short description", type: "textarea", rows: 2 },
  { name: "long_description", label: "Full description", type: "textarea", rows: 8 },
  { name: "cover_image_url", label: "Cover image URL", type: "text", hint: "Upload in Media, then paste the URL" },
  { name: "cover_image_alt", label: "Cover image alt text", type: "text" },
  { name: "gallery", label: "Preview gallery", type: "json", hint: '[{"url":"…","alt":"…"}]' },
  { name: "features", label: "Features / inclusions", type: "json", hint: '["Feature one","Feature two"]' },
  { name: "category", label: "Category", type: "text", hint: "e.g. Ebooks, Templates, Audio, Video" },
  {
    name: "product_type",
    label: "Product type",
    type: "select",
    options: ["ebook", "video", "template", "audio", "other"],
    initial: "ebook",
  },
  { name: "currency", label: "Currency", type: "select", options: ["NGN", "USD"], initial: "NGN" },
  { name: "price", label: "Price (0 = free)", type: "number" },
  {
    name: "file_storage_path",
    label: "Private file path",
    type: "text",
    hint: "Path inside the private media bucket — never exposed publicly",
  },
  { name: "external_url", label: "External secure URL", type: "text", hint: "Use instead of a file upload" },
  { name: "download_limit", label: "Download limit per order", type: "number", initial: 5 },
  { name: "published", label: "Published", type: "boolean" },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products | JointHeirs Admin" },
      { name: "description", content: "Manage digital products, files, pricing and categories." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="Digital Products"
      description="Add, edit and remove store products. Files stay in private storage and are only served through secure expiring links."
    >
      <ResourceManager
        table="products"
        fields={fields}
        titleField="title"
        subtitleField="category"
        emptyLabel="No products yet — add your first digital product."
      />
    </AdminShell>
  ),
});
