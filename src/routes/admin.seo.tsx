import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";

const fields: FieldDef[] = [
  { name: "path", label: "Route path", type: "text", hint: "e.g. / or /services" },
  { name: "meta_title", label: "Meta title", type: "text", hint: "Keep under 60 characters" },
  { name: "meta_description", label: "Meta description", type: "textarea", hint: "Keep under 160 characters" },
  { name: "og_image_url", label: "Social share image URL", type: "text" },
  { name: "robots", label: "Robots directive", type: "select", options: ["index, follow", "noindex, nofollow"] },
];

export const Route = createFileRoute("/admin/seo")({
  head: () => ({
    meta: [
      { title: "SEO Settings | JointHeirs Admin" },
      { name: "description", content: "Manage per-page meta titles, descriptions and share images." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="SEO Settings"
      description="Set the meta title, description, share image and robots directive for each route."
    >
      <ResourceManager table="seo_settings" fields={fields} titleField="path" subtitleField="meta_title" />
    </AdminShell>
  ),
});
