import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";

const fields: FieldDef[] = [
  { name: "title", label: "Project title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "client_name", label: "Client name", type: "text" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "category", label: "Category", type: "text", hint: "Used by the portfolio filter" },
  { name: "cover_image_url", label: "Cover image URL", type: "text" },
  { name: "cover_image_alt", label: "Cover image alt text", type: "text" },
  { name: "result_summary", label: "Result summary", type: "textarea" },
  { name: "challenge", label: "Challenge", type: "textarea", rows: 5 },
  { name: "solution", label: "Solution", type: "textarea", rows: 5 },
  { name: "results", label: "Results (JSON)", type: "json", hint: '[{"label":"Leads","value":"+180%"}]' },
  { name: "gallery", label: "Gallery (JSON)", type: "json", hint: '[{"url":"https://…","alt":"…"}]' },
  { name: "testimonial_quote", label: "Testimonial quote", type: "textarea" },
  { name: "testimonial_author", label: "Testimonial author", type: "text" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "boolean" },
];

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({
    meta: [
      { title: "Manage Portfolio | JointHeirs Admin" },
      { name: "description", content: "Create and edit case studies." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Portfolio" description="Add, edit and remove case studies shown in the portfolio grid.">
      <ResourceManager table="case_studies" fields={fields} titleField="title" subtitleField="client_name" />
    </AdminShell>
  ),
});
