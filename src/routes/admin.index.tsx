import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Login | JointHeirs DigiWorks Agency" },
      { name: "description", content: "Secure administration area for JointHeirs DigiWorks Agency." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });

    void (async () => {
      const { data } = await supabase.auth.getUser();
      setSessionEmail(data.user?.email ?? null);
      if (data.user) {
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(Boolean(role));
      }
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid credentials");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Sign in failed. Check your credentials.");
      return;
    }
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(Boolean(role));
    toast.success(role ? "Welcome back." : "Signed in, but this account has no admin access.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setIsAdmin(null);
    setSessionEmail(null);
  }

  if (sessionEmail) {
    return (
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6">
        <p className="font-display text-[11px] tracking-[0.32em] text-gold uppercase">Admin</p>
        <h1 className="mt-4 text-4xl uppercase">Dashboard</h1>
        <div className="gold-rule mt-6" />
        <p className="mt-6 text-sm text-muted-foreground">Signed in as {sessionEmail}.</p>
        {isAdmin === false && (
          <p className="mt-4 text-sm text-destructive">
            This account does not have admin access. Ask an existing admin to grant the admin role.
          </p>
        )}
        {isAdmin && (
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <Link key={section.to} to={section.to} className="luxe-card p-7">
                <p className="font-display text-[12px] tracking-[0.2em] text-gold uppercase">{section.label}</p>
                <p className="mt-3 text-sm text-muted-foreground">{section.description}</p>
              </Link>
            ))}
          </div>
        )}
        <button
          onClick={signOut}
          className="mt-8 rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase"
        >
          Sign out
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pt-28 pb-16">
      <div className="luxe-card p-8">
        <Lock className="h-6 w-6 text-gold" aria-hidden />
        <h1 className="mt-5 text-2xl uppercase">Admin Login</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Authorised personnel only. There is no public registration.
        </p>
        <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="font-display text-[11px] tracking-[0.2em] uppercase">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="font-display text-[11px] tracking-[0.2em] uppercase">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
