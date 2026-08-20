import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => {
    const title = "Product | JointHeirs DigiWorks Agency";
    const description = "Product details, inclusions and pricing.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/shop/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/shop/${params.slug}` }],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  return (
    <PageShell eyebrow="Product" title={slug.replace(/-/g, " ")} intro="Dynamic product detail page.">
      <Placeholder label="Gallery, description, inclusions, pricing and add-to-cart — wired up in a later phase." />
      <div className="mt-8">
        <Link
          to="/cart"
          className="inline-flex rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink"
        >
          View Cart
        </Link>
      </div>
    </PageShell>
  );
}
