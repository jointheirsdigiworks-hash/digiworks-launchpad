import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text" },
  { name: "designation", label: "Designation", type: "text" },
  { name: "bio", label: "Short bio", type: "textarea" },
  { name: "photo_url", label: "Photo URL", type: "text" },
  { name: "photo_alt", label: "Photo alt text", type: "text" },
  { name: "social_url", label: "Social/profile link", type: "text" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "active", label: "Active", type: "boolean" },
];

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Manage Team | JointHeirs Admin" },
      { name: "description", content: "Manage leadership and management team cards." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Leadership Team" description="Manage the management team cards on the leadership page.">
      <ResourceManager table="team_members" fields={fields} titleField="name" subtitleField="designation" />
    </AdminShell>
  ),
});
