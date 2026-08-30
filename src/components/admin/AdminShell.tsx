import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ADMIN_SECTIONS,
  ROLE_LABEL,
  canRead,
  roleRank,
  type AdminResource,
  type AdminRole,
} from "@/lib/admin-permissions";

export function AdminShell({
  title,
  description,
  resource,
  children,
}: {
  title: string;
  description?: string;
  /** Resource this page manages; used to gate access by role. */
  resource?: AdminResource;
  children: ReactNode | ((role: AdminRole) => ReactNode);
}) {
  const [state, setState] = useState<"loading" | "denied" | "ok">("loading");
  const [role, setRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setState("denied");
        return;
      }
      const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      const roles = (rows ?? [])
        .map((r) => r.role as string)
        .filter((r): r is AdminRole => r === "admin" || r === "editor" || r === "viewer")
        .sort((a, b) => roleRank(b) - roleRank(a));
      const best = roles[0] ?? null;
      setRole(best);
      setState(best ? "ok" : "denied");
    })();
  }, []);

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </main>
    );
  }

  if (state === "denied" || !role) {
    return (
      <main className="mx-auto max-w-md px-4 pt-32 pb-24 sm:px-6">
        <h1 className="text-2xl uppercase">Admin Access Required</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Sign in with a staff account to manage content.
        </p>
        <Link
          to="/admin"
          className="mt-7 inline-block rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] text-ink uppercase"
        >
          Go to Admin Login
        </Link>
      </main>
    );
  }

  const links = ADMIN_SECTIONS.filter((section) => canRead(role, section.resource));
  const blocked = resource ? !canRead(role, resource) : false;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <nav aria-label="Admin sections" className="flex flex-wrap gap-2 border-b border-gold-soft pb-5">
        <Link
          to="/admin"
          activeOptions={{ exact: true }}
          activeProps={{ className: "border-gold bg-gold text-ink" }}
          className="rounded-full border border-gold-soft px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase text-muted-foreground"
        >
          Overview
        </Link>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            activeProps={{ className: "border-gold bg-gold text-ink" }}
            className="rounded-full border border-gold-soft px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase text-muted-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <header className="mt-9">
        <p className="font-display text-[10px] tracking-[0.28em] text-gold uppercase">
          Signed in as {ROLE_LABEL[role]}
        </p>
        <h1 className="mt-3 text-3xl uppercase">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </header>
      <div className="mt-9">
        {blocked ? (
          <p className="luxe-card p-6 text-sm text-muted-foreground">
            Your {ROLE_LABEL[role]} account does not have access to this section.
          </p>
        ) : typeof children === "function" ? (
          children(role)
        ) : (
          children
        )}
      </div>
    </main>
  );
}
