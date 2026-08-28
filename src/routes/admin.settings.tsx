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

const effectKeys = [
  { key: "cursor_orb", label: "Cursor-reactive glowing orb" },
  { key: "hero_particles", label: "Hero particle field" },
  { key: "scroll_progress", label: "Scroll progress bar" },
  { key: "reveal_animations", label: "Section reveal animations" },
  { key: "magnetic_buttons", label: "Magnetic buttons (desktop)" },
  { key: "smooth_scroll", label: "Smooth inertial scrolling" },
  { key: "hover_glow", label: "Hover glow" },
  { key: "parallax_hero", label: "Hero parallax" },
] as const;

const templateFields = [
  { key: "from_name", label: "Sender name", rows: 1 },
  { key: "free_subject", label: "Free download — subject", rows: 1 },
  { key: "free_body", label: "Free download — body", rows: 8 },
  { key: "paid_subject", label: "Paid order — subject", rows: 1 },
  { key: "paid_body", label: "Paid order — body", rows: 8 },
] as const;

/** Site-wide toggles for the premium interaction layer. */
function EffectsPanel() {
  const queryClient = useQueryClient();
  const listSettings = useServerFn(adminListSettings);
  const saveSetting = useServerFn(adminSaveSetting);
  const [values, setValues] = useState<Record<string, boolean> | null>(null);

  const query = useQuery({ queryKey: ["admin", "site_settings"], queryFn: () => listSettings({}) });

  useEffect(() => {
    if (!query.data || values) return;
    const stored = (query.data.settings.find((setting) => setting.key === "effects")?.value ?? {}) as Record<
      string,
      boolean
    >;
    const next: Record<string, boolean> = {};
    for (const effect of effectKeys) next[effect.key] = stored[effect.key] !== false;
    setValues(next);
  }, [query.data, values]);

  const mutation = useMutation({
    mutationFn: async (value: Record<string, boolean>) => saveSetting({ data: { key: "effects", value } }),
    onSuccess: () => {
      toast.success("Special effects updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      void queryClient.invalidateQueries({ queryKey: ["site_settings", "effects"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save effects"),
  });

  return (
    <section className="space-y-4">
      <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Special effects</h2>
      <p className="text-sm text-muted-foreground">
        Turn individual interaction effects on or off across the whole site. Effects are always skipped for visitors who
        request reduced motion.
      </p>
      <div className="luxe-card grid gap-4 p-6 sm:grid-cols-2">
        {effectKeys.map((effect) => (
          <label key={effect.key} htmlFor={`effect-${effect.key}`} className="flex items-center gap-3 text-sm">
            <input
              id={`effect-${effect.key}`}
              type="checkbox"
              checked={values?.[effect.key] ?? true}
              onChange={(event) => setValues({ ...(values ?? {}), [effect.key]: event.target.checked })}
              className="h-4 w-4 accent-[var(--gold)]"
            />
            {effect.label}
          </label>
        ))}
        <button
          type="button"
          disabled={!values || mutation.isPending}
          onClick={() => values && mutation.mutate(values)}
          className="mt-2 justify-self-start rounded-full bg-gold px-5 py-2 font-display text-[11px] tracking-[0.16em] text-ink uppercase disabled:opacity-60"
        >
          Save effects
        </button>
      </div>
    </section>
  );
}

/** Editable order confirmation / download email templates. */
function EmailTemplatesPanel() {
  const queryClient = useQueryClient();
  const listSettings = useServerFn(adminListSettings);
  const saveSetting = useServerFn(adminSaveSetting);
  const [values, setValues] = useState<Record<string, string> | null>(null);

  const query = useQuery({ queryKey: ["admin", "site_settings"], queryFn: () => listSettings({}) });

  useEffect(() => {
    if (!query.data || values) return;
    const stored = (query.data.settings.find((setting) => setting.key === "email_templates")?.value ??
      {}) as Record<string, string>;
    const next: Record<string, string> = {};
    for (const field of templateFields) next[field.key] = stored[field.key] ?? "";
    setValues(next);
  }, [query.data, values]);

  const mutation = useMutation({
    mutationFn: async (value: Record<string, string>) => saveSetting({ data: { key: "email_templates", value } }),
    onSuccess: () => {
      toast.success("Email templates saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save templates"),
  });

  return (
    <section className="mt-14 space-y-4">
      <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Order & download emails</h2>
      <p className="text-sm text-muted-foreground">
        Placeholders you can use: {"{{name}}"}, {"{{product}}"}, {"{{reference}}"}, {"{{amount}}"},{" "}
        {"{{download_url}}"}, {"{{expires}}"}, {"{{limit}}"}.
      </p>
      <div className="luxe-card space-y-5 p-6">
        {templateFields.map((field) => (
          <div key={field.key}>
            <label htmlFor={`tpl-${field.key}`} className="font-display text-[11px] tracking-[0.2em] uppercase">
              {field.label}
            </label>
            <textarea
              id={`tpl-${field.key}`}
              rows={field.rows}
              value={values?.[field.key] ?? ""}
              onChange={(event) => setValues({ ...(values ?? {}), [field.key]: event.target.value })}
              className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
        ))}
        <button
          type="button"
          disabled={!values || mutation.isPending}
          onClick={() => values && mutation.mutate(values)}
          className="rounded-full bg-gold px-5 py-2 font-display text-[11px] tracking-[0.16em] text-ink uppercase disabled:opacity-60"
        >
          Save email templates
        </button>
      </div>
    </section>
  );
}

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
      <EffectsPanel />
      <div className="mt-14">
        <SettingsEditor />
      </div>
      <EmailTemplatesPanel />

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
