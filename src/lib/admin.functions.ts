import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { describeRow, logActivity, requireRead, requireRole, requireWrite } from "@/lib/admin-access";
import { canWrite, type AdminResource } from "@/lib/admin-permissions";
import { ADMIN_ORDER, ADMIN_TABLES } from "@/lib/admin-tables";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Row = Record<string, Json>;

const tableSchema = z.enum(ADMIN_TABLES);
const rowValue = z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.unknown()), z.record(z.unknown())]);
const rowSchema = z.record(rowValue);
const roleSchema = z.enum(["admin", "editor", "viewer"]);

export const adminList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ table: tableSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const role = await requireRead(context as never, data.table as AdminResource);
    const order = ADMIN_ORDER[data.table];
    const { data: rows, error } = await context.supabase
      .from(data.table)
      .select("*")
      .order(order.column, { ascending: order.ascending })
      .limit(500);
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as unknown as Row[], role, canEdit: canWrite(role, data.table as AdminResource) };
  });

export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ table: tableSchema, row: rowSchema, id: z.string().uuid().nullable().optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireWrite(context as never, data.table as AdminResource);
    const payload = { ...data.row };
    delete payload["created_at"];
    delete payload["updated_at"];

    if (data.id) {
      delete payload["id"];
      const { data: row, error } = await context.supabase
        .from(data.table)
        .update(payload as never)
        .eq("id", data.id)
        .select("*")
        .maybeSingle();
      if (error) throw new Error(error.message);
      await logActivity(context as never, {
        action: "update",
        resource: data.table,
        recordId: data.id,
        summary: `Updated ${describeRow(data.row)}`,
        details: { fields: Object.keys(payload) },
      });
      return { row: (row ?? null) as unknown as Row | null };
    }

    delete payload["id"];
    const { data: row, error } = await context.supabase
      .from(data.table)
      .insert(payload as never)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    await logActivity(context as never, {
      action: "create",
      resource: data.table,
      recordId: (row as { id?: string } | null)?.id ?? null,
      summary: `Created ${describeRow(data.row)}`,
    });
    return { row: (row ?? null) as unknown as Row | null };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ table: tableSchema, id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireWrite(context as never, data.table as AdminResource);
    const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logActivity(context as never, {
      action: "delete",
      resource: data.table,
      recordId: data.id,
      summary: `Deleted a ${data.table} record`,
    });
    return { ok: true };
  });

export const adminListSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRead(context as never, "site_settings");
    const { data, error } = await context.supabase.from("site_settings").select("key, value").order("key");
    if (error) throw new Error(error.message);
    return { settings: data ?? [] };
  });

export const adminSaveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ key: z.string().trim().min(1).max(60), value: z.record(z.unknown()) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireWrite(context as never, "site_settings");
    const { error } = await context.supabase
      .from("site_settings")
      .upsert({ key: data.key, value: data.value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    await logActivity(context as never, {
      action: "update",
      resource: "site_settings",
      recordId: data.key,
      summary: `Updated the "${data.key}" settings group`,
    });
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await requireRole(context as never);
    const counts = await Promise.all(
      (["services", "case_studies", "blog_posts", "enquiries", "quote_requests", "bookings"] as const).map(
        async (table) => {
          const { count } = await context.supabase.from(table).select("id", { count: "exact", head: true });
          return [table, count ?? 0] as const;
        },
      ),
    );
    const pending = await Promise.all(
      (["enquiries", "quote_requests", "bookings"] as const).map(async (table) => {
        const { count } = await context.supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("status", "pending");
        return [table, count ?? 0] as const;
      }),
    );
    return {
      role,
      counts: Object.fromEntries(counts) as Record<string, number>,
      pending: Object.fromEntries(pending) as Record<string, number>,
    };
  });

/** Audit trail — admins only. */
export const adminActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ resource: z.string().max(60).optional(), limit: z.number().int().min(1).max(300).optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await requireRead(context as never, "activity_log");
    let query = context.supabase
      .from("activity_log")
      .select("id, actor_email, action, resource, record_id, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 150);
    if (data.resource) query = query.eq("resource", data.resource);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

/** Team access management — admins only. */
export const adminListStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRead(context as never, "user_roles");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin.from("user_roles").select("id, user_id, role, created_at");
    if (error) throw new Error(error.message);
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const emailById = new Map((users?.users ?? []).map((u) => [u.id, u.email ?? ""]));
    return {
      staff: (roles ?? []).map((r) => ({
        id: r.id as string,
        userId: r.user_id as string,
        role: r.role as string,
        email: emailById.get(r.user_id as string) ?? "(unknown)",
        createdAt: r.created_at as string,
      })),
    };
  });

export const adminInviteStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ email: z.string().trim().email().max(255), role: roleSchema })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireWrite(context as never, "user_roles");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();

    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let userId = (existing?.users ?? []).find((u) => (u.email ?? "").toLowerCase() === email)?.id ?? null;

    if (!userId) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        password: crypto.randomUUID() + crypto.randomUUID(),
      });
      if (error) throw new Error(error.message);
      userId = created.user?.id ?? null;
    }
    if (!userId) throw new Error("Could not create the team member account.");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: data.role }, { onConflict: "user_id,role" });
    if (roleError) throw new Error(roleError.message);

    await logActivity(context as never, {
      action: "grant",
      resource: "user_roles",
      recordId: userId,
      summary: `Granted ${data.role} access to ${email}`,
    });
    return { ok: true, email };
  });

export const adminRevokeStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireWrite(context as never, "user_roles");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .eq("id", data.id)
      .maybeSingle();
    if (row && (row.user_id as string) === (context as { userId: string }).userId && row.role === "admin") {
      throw new Error("You cannot revoke your own admin access.");
    }
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logActivity(context as never, {
      action: "revoke",
      resource: "user_roles",
      recordId: (row?.user_id as string) ?? null,
      summary: `Revoked ${row?.role ?? "an"} access grant`,
    });
    return { ok: true };
  });
