import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { adminInviteStaff, adminListStaff, adminRevokeStaff } from "@/lib/admin.functions";
import { ROLE_DESCRIPTION, ROLE_LABEL, type AdminRole } from "@/lib/admin-permissions";

const ROLES: AdminRole[] = ["admin", "editor", "viewer"];

function TeamAccess() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListStaff);
  const invite = useServerFn(adminInviteStaff);
  const revoke = useServerFn(adminRevokeStaff);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");

  const query = useQuery({ queryKey: ["admin", "staff"], queryFn: () => list({ data: undefined }) });

  const inviteMutation = useMutation({
    mutationFn: async () => invite({ data: { email, role } }),
    onSuccess: async (result) => {
      setEmail("");
      await queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      const { error } = await supabase.auth.resetPasswordForEmail(result.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      toast.success(
        error
          ? `Access granted to ${result.email}. Send them a password link from the login page.`
          : `Access granted. A password setup link was emailed to ${result.email}.`,
      );
    },
    onError: (error: Error) => toast.error(error.message || "Could not grant access"),
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => revoke({ data: { id } }),
    onSuccess: () => {
      toast.success("Access revoked");
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not revoke access"),
  });

  const staff = query.data?.staff ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <section>
        <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Staff accounts ({staff.length})</h2>
        <ul className="mt-5 space-y-3">
          {query.isPending && <li className="text-sm text-muted-foreground">Loading…</li>}
          {!query.isPending && staff.length === 0 && (
            <li className="text-sm text-muted-foreground">No staff accounts yet.</li>
          )}
          {staff.map((member) => (
            <li key={member.id} className="luxe-card flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm">{member.email}</p>
                <p className="mt-1 font-display text-[10px] tracking-[0.2em] text-gold uppercase">
                  {ROLE_LABEL[member.role as AdminRole] ?? member.role}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Revoke ${member.role} access for ${member.email}`}
                onClick={() => {
                  if (confirm(`Revoke ${member.role} access for ${member.email}?`)) revokeMutation.mutate(member.id);
                }}
                className="text-muted-foreground transition hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!email.trim()) {
              toast.error("Enter an email address");
              return;
            }
            inviteMutation.mutate();
          }}
          className="luxe-card space-y-4 p-6"
        >
          <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Add a team member</h2>
          <div>
            <label htmlFor="staff-email" className="font-display text-[11px] tracking-[0.2em] uppercase">
              Email
            </label>
            <input
              id="staff-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label htmlFor="staff-role" className="font-display text-[11px] tracking-[0.2em] uppercase">
              Access level
            </label>
            <select
              id="staff-role"
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
            >
              {ROLES.map((option) => (
                <option key={option} value={option}>
                  {ROLE_LABEL[option]}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">{ROLE_DESCRIPTION[role]}</p>
          </div>
          <button
            type="submit"
            disabled={inviteMutation.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] text-ink uppercase disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            {inviteMutation.isPending ? "Granting…" : "Grant access"}
          </button>
        </form>

        <div className="luxe-card mt-6 space-y-3 p-6 text-xs text-muted-foreground">
          {ROLES.map((option) => (
            <p key={option}>
              <span className="font-display tracking-[0.18em] text-gold uppercase">{ROLE_LABEL[option]}</span> —{" "}
              {ROLE_DESCRIPTION[option]}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/admin/access")({
  head: () => ({
    meta: [
      { title: "Team Access | JointHeirs Admin" },
      { name: "description", content: "Grant and revoke admin dashboard access for team members." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell
      title="Team Access"
      description="Add future team members with limited access, or revoke access at any time."
      resource="user_roles"
    >
      <TeamAccess />
    </AdminShell>
  ),
});
