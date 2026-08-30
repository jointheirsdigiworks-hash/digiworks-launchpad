import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { supabase } from "@/integrations/supabase/client";

const schema = z
  .object({
    password: z.string().min(10, "Use at least 10 characters").max(128),
    confirm: z.string(),
  })
  .refine((value) => value.password === value.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password | JointHeirs DigiWorks Agency" },
      { name: "description", content: "Set a new password for your JointHeirs DigiWorks staff account." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    void (async () => {
      const { data } = await supabase.auth.getSession();
      setReady(Boolean(data.session));
    })();
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the passwords");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setSaving(false);
    if (error) {
      toast.error(error.message || "Could not update the password");
      return;
    }
    toast.success("Password updated. You can sign in now.");
    void navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pt-28 pb-16">
      <div className="luxe-card p-6">
        <KeyRound className="h-6 w-6 text-gold" aria-hidden />
        <h1 className="mt-5 text-2xl uppercase">Set a New Password</h1>
        {ready === false ? (
          <p className="mt-3 text-sm text-muted-foreground">
            This password link is missing or has expired. Request a new reset link from the admin login page.
          </p>
        ) : (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Choose a strong password of at least 10 characters.
            </p>
            <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
              <div>
                <label htmlFor="new-password" className="font-display text-[11px] tracking-[0.2em] uppercase">
                  New password
                </label>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="font-display text-[11px] tracking-[0.2em] uppercase">
                  Confirm password
                </label>
                <PasswordInput
                  id="confirm-password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] text-ink uppercase disabled:opacity-60"
              >
                {saving ? "Saving…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
