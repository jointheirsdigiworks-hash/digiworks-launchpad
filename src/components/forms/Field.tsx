import type { ReactNode } from "react";

export const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold";

export function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-display text-[11px] tracking-[0.2em] uppercase">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-full bg-gold px-7 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink transition hover:bg-ember disabled:opacity-60"
    >
      {loading ? "Sending…" : children}
    </button>
  );
}

export function zodErrors(issues: { path: (string | number | symbol)[]; message: string }[]) {
  const next: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!next[key]) next[key] = issue.message;
  }
  return next;
}
