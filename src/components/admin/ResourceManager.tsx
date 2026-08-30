import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { adminDelete, adminList, adminSave } from "@/lib/admin.functions";

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type Row = Record<string, Json>;

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "json" | "select" | "date";
  options?: string[];
  hint?: string;
  rows?: number;
  initial?: Json;
};

export type ResourceTable =
  | "services"
  | "case_studies"
  | "blog_posts"
  | "team_members"
  | "availability_slots"
  | "media_library"
  | "seo_settings"
  | "products"
  | "orders"
  | "download_logs"
  | "chat_sessions";

const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold";

function blankRow(fields: FieldDef[]): Row {
  const row: Row = {};
  for (const field of fields) {
    row[field.name] =
      field.initial !== undefined
        ? field.initial
        : field.type === "boolean"
          ? false
          : field.type === "number"
            ? 0
            : field.type === "json"
              ? []
              : "";
  }
  return row;
}

export function ResourceManager({
  table,
  fields,
  titleField,
  subtitleField,
  emptyLabel = "No records yet.",
}: {
  table: ResourceTable;
  fields: FieldDef[];
  titleField: string;
  subtitleField?: string;
  emptyLabel?: string;
}) {
  const queryClient = useQueryClient();
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);

  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Row>({});

  const query = useQuery({
    queryKey: ["admin", table],
    queryFn: () => list({ data: { table } }),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: { id: string | null; row: Row }) =>
      save({ data: { table, id: payload.id, row: payload.row } }),
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => remove({ data: { table, id } }),
    onSuccess: () => {
      toast.success("Deleted");
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not delete"),
  });

  function startEdit(row: Row | null) {
    const base = row ?? blankRow(fields);
    const next: Row = {};
    for (const field of fields) {
      const value = base[field.name];
      next[field.name] =
        field.type === "json"
          ? JSON.stringify(value ?? [], null, 2)
          : value === null || value === undefined
            ? field.type === "boolean"
              ? false
              : ""
            : (value as Json);
    }
    if (row && typeof row["id"] === "string") next["id"] = row["id"];
    setDraft(next);
    setEditing(base);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const row: Row = {};
    for (const field of fields) {
      const raw = draft[field.name];
      if (field.type === "json") {
        try {
          row[field.name] = JSON.parse(String(raw || "[]")) as Json;
        } catch {
          toast.error(`${field.label} must be valid JSON`);
          return;
        }
      } else if (field.type === "number") {
        row[field.name] = Number(raw ?? 0);
      } else if (field.type === "boolean") {
        row[field.name] = Boolean(raw);
      } else {
        const text = String(raw ?? "").trim();
        row[field.name] = text === "" ? null : text;
      }
    }
    const id = typeof draft["id"] === "string" ? draft["id"] : null;
    saveMutation.mutate({ id, row });
  }

  const rows = query.data?.rows ?? [];
  const canEdit = query.data?.canEdit !== false;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Records ({rows.length})</h2>
          {canEdit && <button
            type="button"
            onClick={() => startEdit(null)}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-display text-[11px] tracking-[0.16em] text-ink uppercase"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden /> New
          </button>}
        </div>

        <ul className="mt-5 space-y-3">
          {query.isPending && <li className="text-sm text-muted-foreground">Loading…</li>}
          {!query.isPending && rows.length === 0 && <li className="text-sm text-muted-foreground">{emptyLabel}</li>}
          {rows.map((row) => (
            <li key={String(row["id"])} className="luxe-card flex items-start justify-between gap-4 p-4">
              <button type="button" onClick={() => startEdit(row)} className="text-left">
                <p className="text-sm uppercase">{String(row[titleField] ?? "Untitled")}</p>
                {subtitleField && (
                  <p className="mt-1 text-xs text-muted-foreground">{String(row[subtitleField] ?? "")}</p>
                )}
              </button>
              {canEdit && <button
                type="button"
                aria-label="Delete record"
                onClick={() => {
                  if (confirm("Delete this record permanently?")) deleteMutation.mutate(String(row["id"]));
                }}
                className="text-muted-foreground transition hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        {!editing ? (
          <p className="luxe-card p-6 text-sm text-muted-foreground">
            Select a record to edit, or create a new one.
          </p>
        ) : (
          <form onSubmit={submit} className="luxe-card space-y-4 p-6">
            <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">
              {typeof draft["id"] === "string" ? "Edit record" : "New record"}
            </h2>
            {fields.map((field) => {
              const id = `${table}-${field.name}`;
              const value = draft[field.name];
              return (
                <div key={field.name}>
                  <label htmlFor={id} className="font-display text-[11px] tracking-[0.2em] uppercase">
                    {field.label}
                  </label>
                  {field.type === "boolean" ? (
                    <div className="mt-2">
                      <input
                        id={id}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => setDraft({ ...draft, [field.name]: e.target.checked })}
                        className="h-4 w-4 accent-[var(--gold)]"
                      />
                    </div>
                  ) : field.type === "select" ? (
                    <select
                      id={id}
                      value={String(value ?? "")}
                      onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select…</option>
                      {(field.options ?? []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" || field.type === "json" ? (
                    <textarea
                      id={id}
                      rows={field.rows ?? (field.type === "json" ? 8 : 4)}
                      value={String(value ?? "")}
                      onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                      className={`${inputClass} ${field.type === "json" ? "font-mono text-xs" : ""}`}
                    />
                  ) : (
                    <input
                      id={id}
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      value={String(value ?? "")}
                      onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                      className={inputClass}
                    />
                  )}
                  {field.hint && <p className="mt-1.5 text-xs text-muted-foreground">{field.hint}</p>}
                </div>
              );
            })}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saveMutation.isPending || !canEdit}
                title={canEdit ? undefined : "Your access level is read-only"}
                className="rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] text-ink uppercase disabled:opacity-60"
              >
                {saveMutation.isPending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
