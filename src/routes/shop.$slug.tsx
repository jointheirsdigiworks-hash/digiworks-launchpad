import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Download, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getProductBySlug } from "@/lib/store.functions";
import { formatPrice, useCart } from "@/lib/cart";
import { Reveal } from "@/components/effects/Reveal";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    const result = await getProductBySlug({ data: { slug: params.slug } });
    if (!result.product) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product as
      | { title: string; short_description: string; cover_image_url?: string | null; price?: number; currency?: string }
      | undefined;
    if (!product) {
      return { meta: [{ title: "Product unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${product.title} | Digital Products | JointHeirs DigiWorks`;
    return {
      meta: [
        { title },
        { name: "description", content: product.short_description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.short_description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(product.cover_image_url?.startsWith("https://")
          ? [
              { property: "og:image", content: product.cover_image_url },
              { name: "twitter:image", content: product.cover_image_url },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: ProductMissing,
  errorComponent: ProductMissing,
  component: ProductDetail,
});

function ProductMissing() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-32 pb-24 text-center">
      <h1 className="text-3xl uppercase">Product not available</h1>
      <p className="mt-4 text-sm text-muted-foreground">This product may have been unpublished.</p>
      <Link to="/shop" className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] text-ink uppercase">
        Back to shop
      </Link>
    </main>
  );
}

function ProductDetail() {
  const { product, related } = Route.useLoaderData();
  const { add } = useCart();
  const [active, setActive] = useState(0);

  const record = product as unknown as {
    slug: string;
    title: string;
    short_description: string;
    full_description: string;
    category: string;
    product_type: string;
    price: number;
    currency: string;
    cover_image_url: string | null;
    cover_image_alt: string | null;
    gallery: unknown;
    features: unknown;
  };

  const gallery = [
    ...(record.cover_image_url ? [{ url: record.cover_image_url, alt: record.cover_image_alt ?? record.title }] : []),
    ...(Array.isArray(record.gallery)
      ? (record.gallery as { url?: string; alt?: string }[])
          .filter((entry) => typeof entry?.url === "string")
          .map((entry) => ({ url: entry.url as string, alt: entry.alt ?? record.title }))
      : []),
  ];
  const features = Array.isArray(record.features) ? (record.features as string[]) : [];
  const isFree = Number(record.price) === 0;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: record.title,
            description: record.short_description,
            category: record.category,
            ...(record.cover_image_url ? { image: record.cover_image_url } : {}),
            offers: {
              "@type": "Offer",
              price: Number(record.price),
              priceCurrency: record.currency,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link to="/shop" className="hover:text-gold">
          Shop
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{record.title}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <Reveal>
          {gallery.length > 0 ? (
            <>
              <img
                src={gallery[active]?.url}
                alt={gallery[active]?.alt ?? record.title}
                loading="lazy"
                decoding="async"
                className="aspect-4/3 w-full rounded-xl border border-gold-soft object-cover"
              />
              {gallery.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {gallery.map((image, index) => (
                    <button
                      key={image.url}
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`Show image ${index + 1}`}
                      aria-pressed={index === active}
                      className={`h-16 w-20 overflow-hidden rounded-md border ${index === active ? "border-gold" : "border-border"}`}
                    >
                      <img src={image.url} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-4/3 w-full rounded-xl border border-dashed border-gold-soft" aria-hidden />
          )}
        </Reveal>

        <Reveal delay={80}>
          <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">
            {record.category} · {record.product_type}
          </p>
          <h1 className="mt-4 text-4xl uppercase">{record.title}</h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{record.short_description}</p>
          <p className="mt-7 font-display text-2xl tracking-[0.08em] text-gold">
            {formatPrice(Number(record.price), record.currency)}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              data-magnetic
              onClick={() => {
                const added = add({
                  slug: record.slug,
                  title: record.title,
                  price: Number(record.price),
                  currency: record.currency,
                  coverImageUrl: record.cover_image_url,
                });
                toast[added ? "success" : "info"](added ? "Added to cart" : "Already in your cart");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.16em] text-ink uppercase shadow-[var(--shadow-gold)]"
            >
              {isFree ? <Download className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {isFree ? "Download Now" : "Add to Cart"}
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.16em] uppercase hover-glow"
            >
              View Cart
            </Link>
          </div>

          {features.length > 0 && (
            <ul className="mt-9 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">About this product</h2>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {record.full_description.split("\n").filter(Boolean).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">More in {record.category}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <Link
                key={entry.slug}
                to="/shop/$slug"
                params={{ slug: entry.slug }}
                className="luxe-card hover-glow p-5"
              >
                <h3 className="text-lg uppercase">{entry.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{entry.short_description}</p>
                <p className="mt-4 font-display text-sm text-gold">
                  {formatPrice(Number(entry.price), entry.currency)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
