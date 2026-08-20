import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Shop | JointHeirs DigiWorks Agency";
const description = "Digital products, templates and done-for-you packages from JointHeirs DigiWorks Agency.";

const products = ["product-one", "product-two", "product-three", "product-four"];

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  return (
    <PageShell eyebrow="Shop" title="Store" intro="Products and pricing are placeholders until the catalogue is published from the admin dashboard.">
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((slug, i) => (
          <Link key={slug} to="/shop/$slug" params={{ slug }} className="luxe-card p-7">
            <div className="aspect-square rounded-md border border-dashed border-gold-soft" aria-hidden />
            <h2 className="mt-5 text-lg uppercase">Product {i + 1}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Placeholder price</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
