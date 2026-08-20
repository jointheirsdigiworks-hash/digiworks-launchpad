import { getRequestHeader } from "@tanstack/react-start/server";

/** Coarse per-IP throttle backed by the database. Throws when the limit is exceeded. */
export async function enforceRateLimit(action: string, limit = 5, windowMinutes = 15) {
  const ip =
    getRequestHeader("cf-connecting-ip") ??
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const bucket = `${action}:${ip}`;
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: rows } = await supabaseAdmin
    .from("form_rate_limits")
    .select("id, hits, window_start")
    .eq("bucket", bucket)
    .gte("window_start", since)
    .order("window_start", { ascending: false })
    .limit(1);

  const current = rows?.[0];
  if (current) {
    if (current.hits >= limit) {
      throw new Error("Too many submissions. Please try again a little later.");
    }
    await supabaseAdmin
      .from("form_rate_limits")
      .update({ hits: current.hits + 1 })
      .eq("id", current.id);
    return;
  }

  await supabaseAdmin.from("form_rate_limits").insert({ bucket, hits: 1 });
}

export function reference(prefix: string) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `${prefix}-${stamp}${rand}`;
}
