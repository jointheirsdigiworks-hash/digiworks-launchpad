import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";
import { adminList } from "@/lib/admin.functions";

const orderFields: FieldDef[] = [
  { name: "status", label: "Status", type: "select", options: ["pending", "completed", "refunded", "cancelled"] },
  { name: "admin_note", label: "Admin note", type: "textarea", rows: 3 },
  { name: "download_limit", label: "Download limit", type: "number" },
];

function DownloadLogs() {
  const list = useServerFn(adminList);
  const query = useQuery({
    queryKey: ["admin", "download_logs"],
    queryFn: () => list({ data: { table: "download_logs" } }),
  });

  const rows = query.data?.rows ?? [];

  return (
    <section className="mt-14">
      <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Download logs</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Every download attempt with outcome, IP address and timestamp.
      </p>
      {query.isPending && <p className="mt-5 text-sm text-muted-foreground">Loading…</p>}
      {!query.isPending && rows.length === 0 && (
        <p className="mt-5 text-sm text-muted-foreground">No download attempts recorded yet.</p>
      )}
      {rows.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                <th className="py-3 pr-4">When</th>
                <th className="py-3 pr-4">Outcome</th>
                <th className="py-3 pr-4">IP</th>
                <th className="py-3">User agent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row["id"])} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                    {new Date(String(row["created_at"])).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-gold">{String(row["outcome"] ?? "")}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{String(row["ip_address"] ?? "—")}</td>
                  <td className="py-3 text-xs text-muted-foreground">{String(row["user_agent"] ?? "—").slice(0, 90)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders | JointHeirs Admin" },
      { name: "description", content: "View store purchases, payment status and download history." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="Store Orders"
      description="Buyer details, payment status and download history. Mark paid orders completed once payment is confirmed to release the download link."
    >
      <ResourceManager
        table="orders"
        fields={orderFields}
        titleField="reference"
        subtitleField="buyer_email"
        emptyLabel="No orders yet."
      />
      <DownloadLogs />
    </AdminShell>
  ),
});
