import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="font-display text-[11px] tracking-[0.32em] text-gold uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-4 text-4xl uppercase sm:text-5xl">{title}</h1>
        <div className="gold-rule mt-6" />
        {intro && <p className="mt-6 max-w-2xl text-muted-foreground">{intro}</p>}
        {children}
      </section>
    </main>
  );
}

export function Placeholder({ label }: { label: string }) {
  return (
    <div className="luxe-card mt-10 border-dashed p-10 text-center">
      <p className="font-display text-sm tracking-[0.2em] text-gold uppercase">Placeholder</p>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
