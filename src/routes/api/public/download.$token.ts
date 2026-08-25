import { createFileRoute } from "@tanstack/react-router";

/**
 * Secure download gateway for digital products.
 *
 * Files live in a private storage bucket and are never exposed by direct URL.
 * Every hit is validated (order status, token expiry, download limit), rate
 * limited per IP, logged with IP + user agent, and then answered with a
 * short-lived signed URL redirect that cannot be hotlinked.
 */
export const Route = createFileRoute("/api/public/download/$token")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const token = params.token;
        if (!token || token.length < 16) return new Response("Invalid link", { status: 400 });

        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          null;
        const userAgent = request.headers.get("user-agent");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { enforceRateLimit } = await import("@/lib/rate-limit.server");
        try {
          await enforceRateLimit("download", 30, 15);
        } catch {
          return new Response("Too many download attempts. Please try again later.", { status: 429 });
        }

        const { data: order } = await supabaseAdmin
          .from("orders")
          .select(
            "id, status, token_expires_at, download_count, download_limit, product_id, products(file_storage_path, external_url, title)",
          )
          .eq("download_token", token)
          .maybeSingle();

        async function log(outcome: string, orderId: string | null, productId: string | null) {
          await supabaseAdmin.from("download_logs").insert({
            order_id: orderId,
            product_id: productId,
            ip_address: ip,
            user_agent: userAgent,
            outcome,
          });
        }

        if (!order) {
          await log("not_found", null, null);
          return new Response("This download link is not valid.", { status: 404 });
        }
        if (order.status !== "completed") {
          await log("unpaid", order.id, order.product_id);
          return new Response("This order is not confirmed yet.", { status: 402 });
        }
        if (new Date(order.token_expires_at).getTime() < Date.now()) {
          await log("expired", order.id, order.product_id);
          return new Response("This download link has expired. Please contact us for a new one.", { status: 410 });
        }
        if (order.download_count >= order.download_limit) {
          await log("limit_reached", order.id, order.product_id);
          return new Response("The download limit for this order has been reached.", { status: 429 });
        }

        const product = order.products;
        let target: string | null = null;
        if (product?.file_storage_path) {
          const { data: signed } = await supabaseAdmin.storage
            .from("media")
            .createSignedUrl(product.file_storage_path, 120, { download: true });
          target = signed?.signedUrl ?? null;
        } else if (product?.external_url) {
          target = product.external_url;
        }

        if (!target) {
          await log("file_missing", order.id, order.product_id);
          return new Response("The file for this product is not attached yet.", { status: 409 });
        }

        await supabaseAdmin
          .from("orders")
          .update({ download_count: order.download_count + 1 })
          .eq("id", order.id);
        if (order.product_id) {
          const { data: current } = await supabaseAdmin
            .from("products")
            .select("download_count")
            .eq("id", order.product_id)
            .maybeSingle();
          await supabaseAdmin
            .from("products")
            .update({ download_count: (current?.download_count ?? 0) + 1 })
            .eq("id", order.product_id);
        }
        await log("allowed", order.id, order.product_id);

        return new Response(null, {
          status: 302,
          headers: { location: target, "cache-control": "no-store", "referrer-policy": "no-referrer" },
        });
      },
    },
  },
});
