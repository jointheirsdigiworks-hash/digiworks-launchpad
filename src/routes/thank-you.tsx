import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";
import { z } from "zod";
import { getOrderForConfirmation } from "@/lib/store.functions";
import { formatPrice } from "@/lib/cart";

const title = "Thank You | JointHeirs DigiWorks Agency";
const description = "Your JointHeirs DigiWorks order confirmation and secure download link.";

const searchSchema = z.object({
  ref: z.string().catch(""),
  token: z.string().catch(""),
});

export const Route = createFileRoute("/thank-you")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { ref, token } = Route.useSearch();
  const fetchOrder = useServerFn(getOrderForConfirmation);
  const query = useQuery({
    queryKey: ["order", ref, token],
    enabled: ref.length > 3 && token.length > 10,
    queryFn: () => fetchOrder({ data: { reference: ref, token } }),
  });

  const order = query.data?.order ?? null;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6">
      <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Order Confirmed</p>
      <h1 className="mt-4 text-4xl uppercase">Thank You</h1>

      {!ref || !token ? (
        <p className="mt-6 text-sm text-muted-foreground">
          We couldn't find an order reference in this link. Please use the link from your confirmation email.
        </p>
      ) : query.isPending ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading your order…</p>
      ) : !order ? (
        <p className="mt-6 text-sm text-muted-foreground">
          That order could not be found. Please check the link or contact us and we'll help right away.
        </p>
      ) : (
        <div className="luxe-card mt-10 p-7">
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Reference {order.reference}</p>
          <h2 className="mt-4 text-2xl uppercase">{order.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.kind === "free" ? "Free download" : formatPrice(order.amount, order.currency)} ·{" "}
            {order.productType}
          </p>

          {order.status === "completed" ? (
            <>
              <a
                href={`/api/public/download/${token}`}
                data-magnetic
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-display text-[12px] tracking-[0.18em] text-ink uppercase shadow-[var(--shadow-gold)]"
              >
                <Download className="h-4 w-4" /> Download now
              </a>
              <p className="mt-4 text-xs text-muted-foreground">
                Secure expiring link · {order.downloadsUsed}/{order.downloadLimit} downloads used · expires{" "}
                {new Date(order.expiresAt).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="mt-8 rounded-md border border-gold-soft bg-surface/60 p-4 text-sm leading-relaxed text-muted-foreground">
              We've recorded your order and will confirm payment shortly. Once confirmed, your secure download link
              is emailed to you and appears on this page.
            </p>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/shop" className="rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase hover-glow">
          Continue shopping
        </Link>
        <Link to="/contact" className="rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase hover-glow">
          Need help?
        </Link>
      </div>
    </main>
  );
}
