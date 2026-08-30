import {
  canRead,
  canWrite,
  roleRank,
  type AdminResource,
  type AdminRole,
} from "@/lib/admin-permissions";

/** Minimal shape of the request-scoped Supabase client we need here. */
type Client = {
  from: (table: string) => any;
};

type AuthContext = {
  supabase: Client;
  userId: string;
  claims?: { email?: string } | null;
};

/** Highest role granted to the signed-in user, or null when they have none. */
export async function resolveRole(context: AuthContext): Promise<AdminRole | null> {
  const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  const roles = ((data ?? []) as { role: string }[])
    .map((r) => r.role)
    .filter((r): r is AdminRole => r === "admin" || r === "editor" || r === "viewer");
  if (roles.length === 0) return null;
  return roles.sort((a, b) => roleRank(b) - roleRank(a))[0]!;
}

export async function requireRole(context: AuthContext): Promise<AdminRole> {
  const role = await resolveRole(context);
  if (!role) throw new Error("Forbidden");
  return role;
}

export async function requireRead(context: AuthContext, resource: AdminResource): Promise<AdminRole> {
  const role = await requireRole(context);
  if (!canRead(role, resource)) throw new Error("Forbidden");
  return role;
}

export async function requireWrite(context: AuthContext, resource: AdminResource): Promise<AdminRole> {
  const role = await requireRole(context);
  if (!canWrite(role, resource)) throw new Error("Forbidden");
  return role;
}

/** Append an audit entry. Never throws: logging must not break the write. */
export async function logActivity(
  context: AuthContext,
  entry: {
    action: string;
    resource: string;
    recordId?: string | null;
    summary: string;
    details?: Record<string, unknown>;
  },
): Promise<void> {
  try {
    await context.supabase.from("activity_log").insert({
      actor_id: context.userId,
      actor_email: context.claims?.email ?? "",
      action: entry.action,
      resource: entry.resource,
      record_id: entry.recordId ?? null,
      summary: entry.summary,
      details: entry.details ?? {},
    });
  } catch {
    /* audit logging is best-effort */
  }
}

/** Short human label for a changed row. */
export function describeRow(row: Record<string, unknown>): string {
  for (const key of ["title", "name", "slug", "path", "key", "reference", "email"]) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim().slice(0, 120);
  }
  return "record";
}
