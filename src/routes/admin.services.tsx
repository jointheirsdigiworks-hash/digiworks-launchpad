import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";

const fields: FieldDef[] = [
  { name: "name", label: "Service name", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "URL segment, e.g. web-design" },
  { name: "category", label: "Category", type: "text" },
  { name: "short_description", label: "Short description", type: "textarea" },
  { name: "long_description", label: "Long description", type: "textarea", rows: 6 },
  { name: "hero_image_url", label: "Hero image URL", type: "text" },
  { name: "hero_image_alt", label: "Hero image alt text", type: "text" },
  {
    name: "features",
    label: "Features (JSON)",
    type: "json",
    hint: '[{"title":"...","description":"..."}]',
  },
  { name: "process", label: "Process steps (JSON)", type: "json", hint: '[{"title":"...","description":"..."}]' },
  { name: "faqs", label: "FAQs (JSON)", type: "json", hint: '[{"question":"...","answer":"..."}]' },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "active", label: "Active (visible on site)", type: "boolean" },
];

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Manage Services | JointHeirs Admin" },
      { name: "description", content: "Create and edit service pages." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Services" description="Manage all service pages, imagery, features, process and FAQs.">
      <ResourceManager table="services" fields={fields} titleField="name" subtitleField="category" />
    </AdminShell>
  ),
});
