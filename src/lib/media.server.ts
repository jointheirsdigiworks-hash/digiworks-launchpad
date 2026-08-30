/**
 * Media helpers for the private `media` storage bucket.
 *
 * Content rows may store either a full https URL or a bucket-relative storage
 * path (e.g. `uploads/1788064917816-cover.png`). Paths are resolved to short
 * lived signed URLs at read time so uploaded imagery never breaks when an
 * older signed link expires.
 */

const SIGNED_TTL_SECONDS = 60 * 60 * 6;

export function isStoragePath(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && !/^(https?:)?\/\//.test(value) && !value.startsWith("data:");
}

/** Resolve one value that may be a storage path into a usable image URL. */
export async function resolveMediaUrl(value: unknown): Promise<string | null> {
  if (typeof value !== "string" || value.length === 0) return null;
  if (!isStoragePath(value)) return value;
  const [signed] = await signPaths([value]);
  return signed ?? null;
}

async function signPaths(paths: string[]): Promise<(string | null)[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return Promise.all(
    paths.map(async (path) => {
      const { data } = await supabaseAdmin.storage
        .from("media")
        .createSignedUrl(path.replace(/^media\//, ""), SIGNED_TTL_SECONDS);
      return data?.signedUrl ?? null;
    }),
  );
}

/**
 * Replace storage paths with signed URLs across a list of rows, for the given
 * image-bearing keys. Rows are returned as plain, SSR-serializable objects.
 */
export async function resolveMediaFields<T extends Record<string, unknown>>(
  rows: T[],
  keys: string[],
): Promise<T[]> {
  const pending = new Set<string>();
  for (const row of rows) {
    for (const key of keys) {
      const value = row[key];
      if (isStoragePath(value)) pending.add(value);
    }
  }
  if (pending.size === 0) return rows;
  const list = Array.from(pending);
  const signed = await signPaths(list);
  const map = new Map(list.map((path, index) => [path, signed[index] ?? null]));
  return rows.map((row) => {
    const next = { ...row } as Record<string, unknown>;
    for (const key of keys) {
      const value = next[key];
      if (isStoragePath(value)) next[key] = map.get(value) ?? null;
    }
    return next as T;
  });
}
