import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createGuestOrder, getStoreSettings } from "@/lib/store.functions";
import { formatPrice, useCart } from "@/lib/cart";

const title = "Checkout | JointHeirs DigiWorks Agency";
const description = "Guest checkout for JointHeirs DigiWorks digital products.";

export const Route = createFileRoute("/checkout")({
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
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: Checkout,
});

const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold";

function Checkout() {
  const { items, total, currency, clear } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(createGuestOrder);
  const storeSettings = useServerFn(getStoreSettings);
  const settings = useQuery({ queryKey: ["store-settings"], queryFn: () => storeSettings({}) });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const paidTotal = total > 0;

  const mutation = useMutation({
    mutationFn: async () => submit({ data: { name: name.trim(), email: email.trim(), slugs: items.map((i) => i.slug) } }),
    onSuccess: (result) => {
      clear();
      void navigate({
        to: "/thank-you",
        search: { ref: result.items[0]?.reference ?? "", token: result.items[0]?.token ?? "" },
      });
    },
    onError: (error: Error) => toast.error(error.message || "Could not complete checkout"),
  });

  return (
    <main className="mx-auto max-w-5xl px-4 pt-32 pb-24 sm:px-6">
      <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Checkout</p>
      <h1 className="mt-4 text-4xl uppercase">Secure Guest Checkout</h1>
      <p className="mt-5 max-w-2xl text-sm text-muted-foreground">
        No account needed. We email your secure, expiring download link and show it on the confirmation page.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">Your cart is empty — add a product to continue.</p>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="luxe-card p-6"
            onSubmit={(event) => {
              event.preventDefault();
              if (name.trim().length < 2) {
                toast.error("Please enter your name");
                return;
              }
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.trim())) {
                toast.error("Please enter a valid email address");
                return;
              }
              mutation.mutate();
            }}
          >
            <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Your details</h2>
            <div className="mt-6">
              <label htmlFor="checkout-name" className="font-display text-[11px] tracking-[0.18em] uppercase">
                Full name
              </label>
              <input
                id="checkout-name"
                value={name}
                maxLength={100}
                required
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="mt-5">
              <label htmlFor="checkout-email" className="font-display text-[11px] tracking-[0.18em] uppercase">
                Email address
              </label>
              <input
                id="checkout-email"
                type="email"
                value={email}
                maxLength={255}
                required
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {settings.data?.captureEmailForFree === false
                  ? "Used only to deliver your download link."
                  : "Your download link is sent to this address."}
              </p>
            </div>

            {paidTotal && (
              <p className="mt-6 rounded-md border border-gold-soft bg-surface/60 p-4 text-xs leading-relaxed text-muted-foreground">
                Paid orders are placed with {settings.data?.paymentProvider ?? "the configured"} gateway.{" "}
                {settings.data?.paymentNote}
              </p>
            )}

            <button
              type="submit"
              data-magnetic
              disabled={mutation.isPending}
              className="mt-8 inline-flex rounded-full bg-gold px-7 py-3.5 font-display text-[12px] tracking-[0.18em] text-ink uppercase shadow-[var(--shadow-gold)] disabled:opacity-60"
            >
              {mutation.isPending ? "Processing…" : paidTotal ? "Place order" : "Get my downloads"}
            </button>
          </form>

          <aside className="luxe-card h-fit p-6">
            <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Order summary</h2>
            <ul className="mt-6 space-y-3">
              {items.map((item) => (
                <li key={item.slug} className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{item.title}</span>
                  <span className="text-gold">{formatPrice(item.price, item.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex justify-between border-t border-border pt-4 font-display text-sm tracking-[0.1em] uppercase">
              Total <span className="text-gold">{total === 0 ? "Free" : formatPrice(total, currency)}</span>
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
