import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

const title = "Cart | JointHeirs DigiWorks Agency";
const description = "Review the items in your cart before checkout.";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: Cart,
});

function Cart() {
  return (
    <PageShell eyebrow="Cart" title="Your Cart" intro="Cart state and totals arrive with the store build.">
      <Placeholder label="Line items, quantities, totals and promo codes." />
      <div className="mt-8">
        <Link
          to="/checkout"
          className="inline-flex rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink"
        >
          Proceed to Checkout
        </Link>
      </div>
    </PageShell>
  );
}
