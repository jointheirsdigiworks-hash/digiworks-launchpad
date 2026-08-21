import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const TABLES = [
  "services",
  "case_studies",
  "blog_posts",
  "team_members",
  "availability_slots",
  "media_library",
  "seo_settings",
  "enquiries",
  "quote_requests",
  "bookings",
] as const;

type AdminTable = (typeof TABLES)[number];

const ORDER: Record<AdminTable, { column: string; ascending: boolean }> = {
  services: { column: "sort_order", ascending: true },
  case_studies: { column: "sort_order", ascending: true },
  blog_posts: { column: "created_at", ascending: false },
  team_members: { column: "sort_order", ascending: true },
  availability_slots: { column: "day_of_week", ascending: true },
  media_library: { column: "created_at", ascending: false },
  seo_settings: { column: "path", ascending: true },
  enquiries: { column: "created_at", ascending: false },
  quote_requests: { column: "created_at", ascending: false },
  bookings: { column: "created_at", ascending: false },
};

const tableSchema = z.enum(TABLES);
const rowValue = z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.unknown()), z.record(z.unknown())]);
const rowSchema = z.record(rowValue);

async function assertAdmin(context: { supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> }; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (data !== true) throw new Error("Forbidden");
}

export const adminList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ table: tableSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const order = ORDER[data.table];
    const { data: rows, error } = await context.supabase
      .from(data.table)
      .select("*")
      .order(order.column, { ascending: order.ascending })
      .limit(500);
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as Record<string, unknown>[] };
  });

export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ table: tableSchema, row: rowSchema, id: z.string().uuid().nullable().optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
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
      return { row: row as Record<string, unknown> | null };
    }

    delete payload["id"];
    const { data: row, error } = await context.supabase
      .from(data.table)
      .insert(payload as never)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { row: row as Record<string, unknown> | null };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ table: tableSchema, id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
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
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("site_settings")
      .upsert({ key: data.key, value: data.value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
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
      counts: Object.fromEntries(counts) as Record<string, number>,
      pending: Object.fromEntries(pending) as Record<string, number>,
    };
  });
