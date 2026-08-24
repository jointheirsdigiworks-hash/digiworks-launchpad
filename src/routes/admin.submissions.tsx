import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminList, adminSave } from "@/lib/admin.functions";

type Table = "enquiries" | "quote_requests" | "bookings";

const tabs: { table: Table; label: string; summary: (row: Record<string, unknown>) => string[] }[] = [
  {
    table: "enquiries",
    label: "Contact enquiries",
    summary: (row) => [
      `${String(row["name"] ?? "")} · ${String(row["email"] ?? "")}`,
      `Service: ${String(row["service"] ?? "—")}`,
      String(row["message"] ?? ""),
    ],
  },
  {
    table: "quote_requests",
    label: "Quote requests",
    summary: (row) => [
      `${String(row["name"] ?? "")} · ${String(row["email"] ?? "")} · ${String(row["reference"] ?? "")}`,
      `${String(row["service"] ?? "")} · ${String(row["budget_range"] ?? "")} · ${String(row["timeline"] ?? "")}`,
      String(row["project_brief"] ?? ""),
    ],
  },
  {
    table: "bookings",
    label: "Strategy sessions",
    summary: (row) => [
      `${String(row["name"] ?? "")} · ${String(row["email"] ?? "")} · ${String(row["reference"] ?? "")}`,
      `${String(row["preferred_date"] ?? "")} at ${String(row["preferred_time"] ?? "")}`,
      String(row["needs"] ?? ""),
    ],
  },
];

const statuses = ["pending", "in_progress", "won", "closed"] as const;

function SubmissionList({ table }: { table: Table }) {
  const queryClient = useQueryClient();
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const query = useQuery({ queryKey: ["admin", table], queryFn: () => list({ data: { table } }) });

  const mutation = useMutation({
    mutationFn: async (payload: { id: string; status: string; admin_note: string | null }) =>
      save({ data: { table, id: payload.id, row: { status: payload.status, admin_note: payload.admin_note } } }),
    onSuccess: () => {
      toast.success("Submission updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not update submission"),
  });

  const config = tabs.find((tab) => tab.table === table)!;
  const rows = query.data?.rows ?? [];

  return (
    <div className="space-y-4">
      {query.isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!query.isPending && rows.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
      {rows.map((row) => {
        const id = String(row["id"]);
        const lines = config.summary(row);
        const created = row["created_at"] ? new Date(String(row["created_at"])).toLocaleString("en-NG") : "";
        return (
          <article key={id} className="luxe-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm uppercase">{lines[0]}</p>
              <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{created}</p>
            </div>
            <p className="mt-2 text-xs tracking-[0.16em] text-gold uppercase">{lines[1]}</p>
            <p className="mt-3 text-sm whitespace-pre-line text-muted-foreground">{lines[2]}</p>
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor={`status-${id}`} className="font-display text-[10px] tracking-[0.2em] uppercase">
                  Status
                </label>
                <select
                  id={`status-${id}`}
                  defaultValue={String(row["status"] ?? "pending")}
                  onChange={(event) =>
                    mutation.mutate({
                      id,
                      status: event.target.value,
                      admin_note: notes[id] ?? (row["admin_note"] as string | null) ?? null,
                    })
                  }
                  className="mt-2 rounded-md border border-input bg-background/60 px-4 py-2 text-sm outline-none focus:border-gold"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor={`note-${id}`} className="font-display text-[10px] tracking-[0.2em] uppercase">
                  Internal note
                </label>
                <input
                  id={`note-${id}`}
                  defaultValue={(row["admin_note"] as string | null) ?? ""}
                  onChange={(event) => setNotes({ ...notes, [id]: event.target.value })}
                  className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  mutation.mutate({
                    id,
                    status: String(row["status"] ?? "pending"),
                    admin_note: notes[id] ?? ((row["admin_note"] as string | null) ?? null),
                  })
                }
                className="rounded-full border border-gold-soft px-5 py-2 font-display text-[11px] tracking-[0.16em] uppercase"
              >
                Save note
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export const Route = createFileRoute("/admin/submissions")({
  head: () => ({
    meta: [
      { title: "Submissions | JointHeirs Admin" },
      { name: "description", content: "Review contact enquiries, quote requests and strategy session bookings." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Submissions,
});

function Submissions() {
  const [active, setActive] = useState<Table>("enquiries");
  return (
    <AdminShell title="Submissions" description="Every enquiry, quote request and strategy session booking.">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.table}
            type="button"
            aria-pressed={active === tab.table}
            onClick={() => setActive(tab.table)}
            className={`rounded-full border px-5 py-2 font-display text-[11px] tracking-[0.16em] uppercase transition ${
              active === tab.table ? "border-gold bg-gold text-ink" : "border-gold-soft text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <SubmissionList table={active} />
      </div>
    </AdminShell>
  );
}
