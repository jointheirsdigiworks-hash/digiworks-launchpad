import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PRODUCT_PUBLIC_COLUMNS =
  "id, slug, title, short_description, category, product_type, currency, price, cover_image_url, cover_image_alt, featured, purchase_count, sort_order";

const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  slugs: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
});

const claimSchema = z.object({
  reference: z.string().trim().min(4).max(40),
  token: z.string().trim().min(10).max(80),
});

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb()
    .from("products")
    .select(PRODUCT_PUBLIC_COLUMNS)
    .eq("published", true)
    .order("sort_order");
  return { products: data ?? [] };
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().trim().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const { publicDb } = await import("./public-db.server");
    const db = publicDb();
    const { data: product } = await db
      .from("products")
      .select(
        `${PRODUCT_PUBLIC_COLUMNS}, full_description, gallery, features, download_limit, external_url`,
      )
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!product) return { product: null, related: [] };
    const { data: related } = await db
      .from("products")
      .select(PRODUCT_PUBLIC_COLUMNS)
      .eq("published", true)
      .eq("category", product.category)
      .neq("slug", data.slug)
      .order("sort_order")
      .limit(3);
    // never leak the private storage path to the browser
    const { external_url: _external, ...safe } = product as Record<string, unknown>;
    return { product: { ...safe, has_external_link: Boolean(_external) }, related: related ?? [] };
  });

export const getStoreSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("./public-db.server");
  const { data } = await publicDb().from("site_settings").select("value").eq("key", "store").maybeSingle();
  const value = (data?.value ?? {}) as {
    currency?: string;
    capture_email_for_free?: boolean;
    payment_provider?: string;
    payment_note?: string;
  };
  return {
    currency: value.currency ?? "NGN",
    captureEmailForFree: value.capture_email_for_free ?? true,
    paymentProvider: value.payment_provider ?? "paystack",
    paymentNote:
      value.payment_note ??
      "Payment gateway keys are configured by the admin. Paid orders are recorded and confirmed manually until keys are connected.",
  };
});

/**
 * Guest checkout for digital products. Free items are completed immediately with a
 * signed expiring download token; paid items are recorded as pending until the
 * configured payment gateway confirms them.
 */
export const createGuestOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data }) => {
    const { enforceRateLimit, reference } = await import("./rate-limit.server");
    const { notifyAdmin } = await import("./notify.server");
    await enforceRateLimit("store-checkout", 10, 15);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      null;

    const { data: settingsRow } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "store")
      .maybeSingle();
    const settings = (settingsRow?.value ?? {}) as {
      default_download_limit?: number;
      download_link_hours?: number;
      payment_provider?: string;
    };
    const downloadLimit = settings.default_download_limit ?? 5;
    const hours = settings.download_link_hours ?? 168;

    const { data: products, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, slug, title, price, currency, download_limit")
      .in("slug", data.slugs)
      .eq("published", true);
    if (productError) throw new Error(productError.message);
    if (!products?.length) throw new Error("Those products are no longer available.");

    const ref = reference("JD");
    const expires = new Date(Date.now() + hours * 3_600_000).toISOString();
    const rows = products.map((product) => {
      const paid = Number(product.price) > 0;
      return {
        reference: `${ref}-${product.slug.slice(0, 8).toUpperCase()}`,
        product_id: product.id,
        buyer_name: data.name,
        buyer_email: data.email,
        amount: product.price,
        currency: product.currency,
        kind: paid ? "paid" : "free",
        status: paid ? "pending" : "completed",
        provider: paid ? (settings.payment_provider ?? "paystack") : null,
        download_token: crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().slice(0, 8),
        token_expires_at: expires,
        download_limit: product.download_limit ?? downloadLimit,
        ip_address: ip,
      };
    });

    const { data: created, error } = await supabaseAdmin.from("orders").insert(rows).select(
      "reference, download_token, status, kind, amount, currency, product_id",
    );
    if (error) throw new Error(error.message);

    const requiresPayment = rows.some((row) => row.status === "pending");
    const items = (created ?? []).map((order) => {
      const product = products.find((entry) => entry.id === order.product_id);
      return {
        reference: order.reference,
        token: order.download_token,
        title: product?.title ?? "Digital product",
        slug: product?.slug ?? "",
        amount: Number(order.amount),
        currency: order.currency,
        status: order.status,
      };
    });

    await notifyAdmin(`New store order ${ref}`, [
      `Buyer: ${data.name} <${data.email}>`,
      `Items: ${items.map((item) => item.title).join(", ")}`,
      `Payment required: ${requiresPayment ? "yes" : "no (free downloads)"}`,
    ]);

    // Confirmation / download email per item, using admin-editable templates.
    const { sendOrderEmail } = await import("./email.server");
    const origin =
      getRequestHeader("origin") ??
      (getRequestHeader("host") ? `https://${getRequestHeader("host")}` : "");
    const expiresLabel = new Date(expires).toUTCString();
    await Promise.all(
      items.map((item) => {
        const row = rows.find((entry) => entry.reference === item.reference);
        return sendOrderEmail({
          to: data.email,
          name: data.name,
          product: item.title,
          reference: item.reference,
          amount: `${item.currency} ${item.amount.toLocaleString()}`,
          paid: item.status !== "completed",
          downloadUrl: `${origin}/api/public/download/${item.token}`,
          expires: expiresLabel,
          limit: row?.download_limit ?? downloadLimit,
        });
      }),
    );

    return { groupReference: ref, items, requiresPayment, expiresAt: expires };
  });

/** Reads a single order for the confirmation page. Requires both reference and token. */
export const getOrderForConfirmation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => claimSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("reference, status, kind, amount, currency, token_expires_at, download_count, download_limit, products(title, slug, product_type)")
      .eq("reference", data.reference)
      .eq("download_token", data.token)
      .maybeSingle();
    if (!order) return { order: null };
    return {
      order: {
        reference: order.reference,
        status: order.status,
        kind: order.kind,
        amount: Number(order.amount),
        currency: order.currency,
        expiresAt: order.token_expires_at,
        downloadsUsed: order.download_count,
        downloadLimit: order.download_limit,
        title: order.products?.title ?? "Digital product",
        slug: order.products?.slug ?? "",
        productType: order.products?.product_type ?? "other",
      },
    };
  });
