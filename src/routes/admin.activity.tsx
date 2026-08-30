import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminActivity } from "@/lib/admin.functions";

const FILTERS = [
  { value: "", label: "All" },
  { value: "services", label: "Services" },
  { value: "case_studies", label: "Portfolio" },
  { value: "blog_posts", label: "Blog" },
  { value: "team_members", label: "Team" },
  { value: "products", label: "Products" },
  { value: "orders", label: "Orders" },
  { value: "media_library", label: "Media" },
  { value: "seo_settings", label: "SEO" },
  { value: "site_settings", label: "Settings" },
  { value: "user_roles", label: "Team access" },
] as const;

const ACTION_TONE: Record<string, string> = {
  create: "text-[oklch(0.72_0.12_150)]",
  update: "text-gold",
  delete: "text-destructive",
  grant: "text-[oklch(0.72_0.12_150)]",
  revoke: "text-destructive",
};

function ActivityLog() {
  const [resource, setResource] = useState("");
  const load = useServerFn(adminActivity);
  const query = useQuery({
    queryKey: ["admin", "activity", resource],
    queryFn: () => load({ data: resource ? { resource } : {} }),
  });

  const rows = query.data?.rows ?? [];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setResource(filter.value)}
            className={`rounded-full border px-4 py-2 font-display text-[10px] tracking-[0.16em] uppercase transition ${
              resource === filter.value
                ? "border-gold bg-gold text-ink"
                : "border-gold-soft text-muted-foreground hover:border-gold"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="luxe-card mt-6 overflow-x-auto p-4 sm:p-6">
        {query.isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!query.isPending && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        )}
        {rows.length > 0 && (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="font-display text-[10px] tracking-[0.18em] text-gold uppercase">
                <th className="pb-3 pr-4">When</th>
                <th className="pb-3 pr-4">Who</th>
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3 pr-4">Area</th>
                <th className="pb-3">What changed</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {rows.map((row) => (
                <tr key={row.id as string} className="border-t border-gold-soft/40">
                  <td className="py-3 pr-4 whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(row.created_at as string).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-xs">{(row.actor_email as string) || "unknown"}</td>
                  <td
                    className={`py-3 pr-4 font-display text-[10px] tracking-[0.16em] uppercase ${
                      ACTION_TONE[row.action as string] ?? "text-foreground"
                    }`}
                  >
                    {row.action as string}
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{row.resource as string}</td>
                  <td className="py-3 text-xs">{row.summary as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin/activity")({
  head: () => ({
    meta: [
      { title: "Activity Log | JointHeirs Admin" },
      { name: "description", content: "Audit trail of content changes across the JointHeirs admin dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="Activity Log"
      description="Every content change recorded with who made it, what changed and when."
      resource="activity_log"
    >
      <ActivityLog />
    </AdminShell>
  ),
});
