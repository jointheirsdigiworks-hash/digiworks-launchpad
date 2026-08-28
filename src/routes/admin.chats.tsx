import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminList, adminSave } from "@/lib/admin.functions";

type Turn = { role?: string; content?: string };

type ChatRow = {
  id?: string;
  session_key?: string;
  visitor_name?: string | null;
  visitor_email?: string | null;
  visitor_phone?: string | null;
  handoff_channel?: string | null;
  handoff_topic?: string | null;
  handoff_note?: string | null;
  status?: string | null;
  message_count?: number | null;
  ip_address?: string | null;
  created_at?: string | null;
  transcript?: unknown;
};

const statuses = ["open", "handoff_requested", "contacted", "closed"] as const;

function ChatSessions() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const [openId, setOpenId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["admin", "chat_sessions"],
    queryFn: () => list({ data: { table: "chat_sessions" } }),
  });

  const mutation = useMutation({
    mutationFn: async (payload: { id: string; row: Record<string, string> }) =>
      save({ data: { table: "chat_sessions", id: payload.id, row: payload.row } }),
    onSuccess: () => {
      toast.success("Chat session updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "chat_sessions"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not update session"),
  });

  const rows = (query.data?.rows ?? []) as ChatRow[];

  return (
    <section className="space-y-4">
      {query.isPending && <p className="text-sm text-muted-foreground">Loading chat sessions…</p>}
      {!query.isPending && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No JDBot conversations logged yet.</p>
      )}

      {rows.map((row) => {
        const transcript = Array.isArray(row.transcript) ? (row.transcript as Turn[]) : [];
        const id = row.id ?? row.session_key ?? "";
        const expanded = openId === id;
        return (
          <article key={id} className="luxe-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-[12px] tracking-[0.18em] uppercase">
                  {row.visitor_name || "Anonymous visitor"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {row.visitor_email || "no email"} · {row.visitor_phone || "no phone"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {row.created_at ? new Date(row.created_at).toLocaleString() : "—"} ·{" "}
                  {row.message_count ?? transcript.length} messages · {row.ip_address || "no ip"}
                </p>
                {row.handoff_channel && (
                  <p className="mt-2 text-xs text-gold">
                    Wants {row.handoff_channel}
                    {row.handoff_topic ? ` · ${row.handoff_topic}` : ""}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor={`status-${id}`} className="sr-only">
                  Status
                </label>
                <select
                  id={`status-${id}`}
                  value={row.status ?? "open"}
                  onChange={(event) => mutation.mutate({ id, row: { status: event.target.value } })}
                  className="rounded-md border border-input bg-background/60 px-3 py-2 text-xs uppercase outline-none focus:border-gold"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setOpenId(expanded ? null : id)}
                  className="rounded-full border border-gold-soft px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase"
                >
                  {expanded ? "Hide transcript" : "View transcript"}
                </button>
              </div>
            </div>

            {row.handoff_note && (
              <p className="mt-4 rounded-md border border-border bg-surface/50 p-4 text-sm text-foreground/90">
                {row.handoff_note}
              </p>
            )}

            {expanded && (
              <div className="mt-5 space-y-2 border-t border-border pt-5">
                {transcript.length === 0 && <p className="text-sm text-muted-foreground">No transcript stored.</p>}
                {transcript.map((turn, index) => (
                  <p
                    key={`${index}-${(turn.content ?? "").slice(0, 10)}`}
                    className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                      turn.role === "user" ? "ml-auto bg-gold/15" : "bg-surface"
                    }`}
                  >
                    <span className="mr-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                      {turn.role === "user" ? "Visitor" : "JDBot"}
                    </span>
                    {turn.content}
                  </p>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

export const Route = createFileRoute("/admin/chats")({
  head: () => ({
    meta: [
      { title: "JDBot Chats | JointHeirs Admin" },
      { name: "description", content: "Review JDBot conversations and human handoff requests." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="JDBot Chats"
      description="Every JDBot conversation, plus the visitor details collected before a WhatsApp or email handoff."
    >
      <ChatSessions />
    </AdminShell>
  ),
});
