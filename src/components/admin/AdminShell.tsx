import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/submissions", label: "Submissions" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/chats", label: "JDBot Chats" },
  { to: "/admin/seo", label: "SEO" },
  { to: "/admin/settings", label: "Settings" },
] as const;

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<"loading" | "denied" | "ok">("loading");

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setState("denied");
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setState(role ? "ok" : "denied");
    })();
  }, []);

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </main>
    );
  }

  if (state === "denied") {
    return (
      <main className="mx-auto max-w-md px-4 pt-32 pb-24 sm:px-6">
        <h1 className="text-2xl uppercase">Admin Access Required</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Sign in with an admin account to manage content.
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

  return (
    <main className="mx-auto max-w-7xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <nav aria-label="Admin sections" className="flex flex-wrap gap-2 border-b border-gold-soft pb-5">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            activeOptions={{ exact: link.to === "/admin" }}
            activeProps={{ className: "border-gold bg-gold text-ink" }}
            className="rounded-full border border-gold-soft px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase text-muted-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <header className="mt-9">
        <h1 className="text-3xl uppercase">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </header>
      <div className="mt-9">{children}</div>
    </main>
  );
}
