import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { listProducts } from "@/lib/store.functions";
import { formatPrice, useCart } from "@/lib/cart";
import { Reveal } from "@/components/effects/Reveal";

const title = "Digital Products Nigeria | Ebooks, Templates & AI Guides | JointHeirs DigiWorks";
const description =
  "Download premium digital products from JointHeirs DigiWorks Agency Lagos — ebooks on AI marketing, digital templates for entrepreneurs, video and audio assets for growth.";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: "digital products Nigeria, ebooks on AI marketing, digital templates for entrepreneurs, digital agency Lagos" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  loader: () => listProducts(),
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24">
      <h1 className="text-3xl uppercase">Store unavailable</h1>
      <p className="mt-4 text-sm text-muted-foreground">Please refresh in a moment.</p>
    </main>
  ),
  component: Shop,
});

const sorts = ["Featured", "Popularity", "Price: low to high", "Price: high to low"] as const;

function Shop() {
  const { products } = Route.useLoaderData();
  const { add, count } = useCart();
  const [category, setCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Featured");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category))).sort()],
    [products],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter((product) => `${product.title} ${product.short_description} ${product.category}`.toLowerCase().includes(q))
      .slice(0, 5);
  }, [products, query]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (priceFilter === "free" && Number(product.price) > 0) return false;
      if (priceFilter === "paid" && Number(product.price) === 0) return false;
      if (q && !`${product.title} ${product.short_description} ${product.category}`.toLowerCase().includes(q))
        return false;
      return true;
    });
    list = [...list];
    if (sort === "Popularity") list.sort((a, b) => (b.purchase_count ?? 0) - (a.purchase_count ?? 0));
    else if (sort === "Price: low to high") list.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "Price: high to low") list.sort((a, b) => Number(b.price) - Number(a.price));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
    return list;
  }, [products, category, priceFilter, sort, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "JointHeirs DigiWorks digital products",
            itemListElement: products.slice(0, 20).map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: product.title,
              url: `/shop/${product.slug}`,
            })),
          }),
        }}
      />

      <Reveal>
        <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Digital Store</p>
        <h1 className="mt-4 max-w-3xl text-4xl uppercase sm:text-5xl">Digital Products for Ambitious Brands</h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Ebooks, templates, video and audio assets built by our team in Lagos. Instant, secure downloads —
          all listings below are editable placeholders until the catalogue is published from the dashboard.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <label htmlFor="product-search" className="sr-only">
            Search digital products
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value.slice(0, 80))}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 150)}
            placeholder="Search ebooks, templates, video…"
            className="w-full rounded-full border border-input bg-background/60 py-3.5 pr-4 pl-11 text-sm outline-none focus:border-gold"
          />
          {focused && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gold-soft bg-background shadow-[var(--shadow-luxe)]">
              {suggestions.map((product) => (
                <li key={product.slug}>
                  <Link
                    to="/shop/$slug"
                    params={{ slug: product.slug }}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-surface"
                  >
                    <span>{product.title}</span>
                    <span className="text-xs text-gold">{formatPrice(Number(product.price), product.currency)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as (typeof sorts)[number])}
            className="rounded-full border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
          >
            {sorts.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-gold-soft px-5 py-3 font-display text-[11px] tracking-[0.16em] uppercase hover-glow"
          >
            <ShoppingBag className="h-4 w-4" /> Cart ({count})
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setCategory(entry)}
            aria-pressed={category === entry}
            className={`rounded-full border px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase transition-colors ${
              category === entry ? "border-gold bg-gold text-ink" : "border-gold-soft text-muted-foreground"
            }`}
          >
            {entry}
          </button>
        ))}
        <span className="mx-1 h-9 w-px bg-border" aria-hidden />
        {(["all", "free", "paid"] as const).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setPriceFilter(entry)}
            aria-pressed={priceFilter === entry}
            className={`rounded-full border px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase transition-colors ${
              priceFilter === entry ? "border-gold bg-gold text-ink" : "border-gold-soft text-muted-foreground"
            }`}
          >
            {entry === "all" ? "All prices" : entry}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">No products match those filters yet.</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, index) => (
            <Reveal key={product.slug} delay={index * 60}>
              <article className="luxe-card hover-glow group flex h-full flex-col overflow-hidden">
                <Link to="/shop/$slug" params={{ slug: product.slug }} className="block">
                  {product.cover_image_url ? (
                    <img
                      src={product.cover_image_url}
                      alt={product.cover_image_alt ?? product.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-4/3 w-full border-b border-dashed border-gold-soft" aria-hidden />
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-display text-[10px] tracking-[0.24em] text-gold uppercase">{product.category}</p>
                  <h2 className="mt-3 text-lg uppercase">
                    <Link to="/shop/$slug" params={{ slug: product.slug }} className="hover:text-gold">
                      {product.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{product.short_description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-display text-sm tracking-[0.1em] text-gold">
                      {formatPrice(Number(product.price), product.currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const added = add({
                          slug: product.slug,
                          title: product.title,
                          price: Number(product.price),
                          currency: product.currency,
                          coverImageUrl: product.cover_image_url ?? null,
                        });
                        toast[added ? "success" : "info"](added ? "Added to cart" : "Already in your cart");
                      }}
                      className="rounded-full bg-gold px-4 py-2 font-display text-[10px] tracking-[0.16em] text-ink uppercase"
                    >
                      {Number(product.price) > 0 ? "Add to cart" : "Get free"}
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
