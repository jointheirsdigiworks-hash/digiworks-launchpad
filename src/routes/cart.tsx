import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { formatPrice, useCart } from "@/lib/cart";

const title = "Cart | JointHeirs DigiWorks Agency";
const description = "Review your digital products before secure guest checkout.";

export const Route = createFileRoute("/cart")({
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
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: Cart,
});

function Cart() {
  const { items, remove, total, currency, clear } = useCart();

  return (
    <main className="mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-6">
      <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Cart</p>
      <h1 className="mt-4 text-4xl uppercase">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-7 inline-flex rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] text-ink uppercase"
          >
            Browse the store
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-10 space-y-4">
            {items.map((item) => (
              <li key={item.slug} className="luxe-card flex flex-wrap items-center gap-4 p-4">
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt=""
                    loading="lazy"
                    className="h-16 w-20 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-16 w-20 rounded-md border border-dashed border-gold-soft" aria-hidden />
                )}
                <div className="min-w-40 flex-1">
                  <Link to="/shop/$slug" params={{ slug: item.slug }} className="text-base uppercase hover:text-gold">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">Digital download · one licence</p>
                </div>
                <span className="font-display text-sm text-gold">{formatPrice(item.price, item.currency)}</span>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  aria-label={`Remove ${item.title} from cart`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-gold hover:text-gold"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <button type="button" onClick={clear} className="text-xs tracking-[0.16em] text-muted-foreground uppercase hover:text-gold">
              Clear cart
            </button>
            <p className="font-display text-lg tracking-[0.08em]">
              Total <span className="text-gold">{total === 0 ? "Free" : formatPrice(total, currency)}</span>
            </p>
          </div>

          <Link
            to="/checkout"
            data-magnetic
            className="mt-8 inline-flex rounded-full bg-gold px-7 py-3.5 font-display text-[12px] tracking-[0.18em] text-ink uppercase shadow-[var(--shadow-gold)]"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </main>
  );
}
