import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";
import { adminListSettings, adminSaveSetting } from "@/lib/admin.functions";

const slotFields: FieldDef[] = [
  {
    name: "day_of_week",
    label: "Day of week (0 = Sunday)",
    type: "number",
  },
  { name: "start_time", label: "Start time", type: "text", hint: "e.g. 10:00" },
  { name: "end_time", label: "End time", type: "text", hint: "e.g. 10:45" },
  { name: "active", label: "Active", type: "boolean" },
];

function SettingsEditor() {
  const queryClient = useQueryClient();
  const listSettings = useServerFn(adminListSettings);
  const saveSetting = useServerFn(adminSaveSetting);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");

  const query = useQuery({ queryKey: ["admin", "site_settings"], queryFn: () => listSettings({}) });

  useEffect(() => {
    if (!query.data) return;
    const next: Record<string, string> = {};
    for (const setting of query.data.settings) {
      next[setting.key] = JSON.stringify(setting.value, null, 2);
    }
    setDrafts(next);
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: async (payload: { key: string; value: Record<string, unknown> }) =>
      saveSetting({ data: payload }),
    onSuccess: () => {
      toast.success("Settings saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save settings"),
  });

  function save(key: string) {
    try {
      const parsed = JSON.parse(drafts[key] ?? "{}") as Record<string, unknown>;
      mutation.mutate({ key, value: parsed });
    } catch {
      toast.error("Value must be valid JSON");
    }
  }

  return (
    <section className="space-y-5">
      <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Site settings</h2>
      {query.isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
      {Object.keys(drafts).map((key) => (
        <div key={key} className="luxe-card p-6">
          <label htmlFor={`setting-${key}`} className="font-display text-[11px] tracking-[0.2em] uppercase">
            {key}
          </label>
          <textarea
            id={`setting-${key}`}
            rows={8}
            value={drafts[key] ?? ""}
            onChange={(event) => setDrafts({ ...drafts, [key]: event.target.value })}
            className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 font-mono text-xs outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => save(key)}
            className="mt-4 rounded-full bg-gold px-5 py-2 font-display text-[11px] tracking-[0.16em] text-ink uppercase"
          >
            Save {key}
          </button>
        </div>
      ))}

      <div className="luxe-card p-6">
        <label htmlFor="new-setting" className="font-display text-[11px] tracking-[0.2em] uppercase">
          Add a new setting key
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          <input
            id="new-setting"
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
            className="flex-1 rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => {
              const key = newKey.trim();
              if (!key) return;
              setDrafts({ ...drafts, [key]: "{}" });
              setNewKey("");
            }}
            className="rounded-full border border-gold-soft px-5 py-2 font-display text-[11px] tracking-[0.16em] uppercase"
          >
            Add
          </button>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Site Settings | JointHeirs Admin" },
      { name: "description", content: "Manage founder content, contact details and booking availability." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="Site Settings"
      description="Edit global content blocks (founder story, contact details, robots) and strategy session availability."
    >
      <SettingsEditor />
      <div className="mt-14">
        <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Strategy session availability</h2>
        <div className="mt-5">
          <ResourceManager
            table="availability_slots"
            fields={slotFields}
            titleField="start_time"
            subtitleField="end_time"
          />
        </div>
      </div>
    </AdminShell>
  ),
});
