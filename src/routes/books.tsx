import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/effects/Reveal";
import { formatPrice, useCart } from "@/lib/cart";
import { listProducts } from "@/lib/store.functions";
import { site } from "@/lib/site";

const title = "Books & Publications | JointHeirs DigiWorks Agency Lagos";
const description =
  "Books and publications from JointHeirs DigiWorks Agency — including The AI-Powered Entrepreneur series by Ulrich Archie-Bong, written for founders in Lagos, Nigeria and across Africa.";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content: "books on AI for entrepreneurs, Nigerian business books, digital marketing books Lagos",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/books" }],
  }),
  loader: () => listProducts(),
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24">
      <h1 className="text-3xl uppercase">Library unavailable</h1>
      <p className="mt-4 text-sm text-muted-foreground">Please refresh in a moment.</p>
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24">
      <h1 className="text-3xl uppercase">No books yet</h1>
    </main>
  ),
  component: Books,
});

function Books() {
  const { products } = Route.useLoaderData();
  const { add } = useCart();
  const books = products.filter((product) => product.category === "Books");

  return (
    <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      {books.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "JointHeirs DigiWorks books and publications",
              itemListElement: books.map((book, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Book",
                  name: book.title,
                  author: { "@type": "Person", name: site.founder },
                  url: `/shop/${book.slug}`,
                },
              })),
            }),
          }}
        />
      )}

      <Reveal>
        <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Books &amp; Publications</p>
        <h1 className="mt-4 max-w-3xl text-4xl uppercase sm:text-5xl">Read the Playbooks We Build From</h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Our books turn the systems we run for clients into something you can read, apply and keep. Written by{" "}
          {site.founder} and the JointHeirs DigiWorks team in Lagos, each title ships as an instant download.
        </p>
      </Reveal>

      {books.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">
          New titles are being prepared. Meanwhile, browse the{" "}
          <Link to="/shop" className="text-gold underline-offset-4 hover:underline">
            digital store
          </Link>
          .
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            <Reveal key={book.slug} delay={index * 70}>
              <article className="luxe-card hover-glow flex h-full flex-col overflow-hidden">
                <Link to="/shop/$slug" params={{ slug: book.slug }} className="block">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={book.cover_image_alt ?? `${book.title} book cover`}
                      loading={index < 3 ? "eager" : "lazy"}
                      width={800}
                      height={1200}
                      className="aspect-[2/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-surface/60">
                      <BookOpen className="h-8 w-8 text-gold" aria-hidden />
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">{site.founder}</p>
                  <h2 className="mt-2 font-display text-base leading-snug uppercase">
                    <Link to="/shop/$slug" params={{ slug: book.slug }} className="hover:text-gold">
                      {book.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {book.short_description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-display text-sm text-gold">
                      {Number(book.price) === 0 ? "Free" : formatPrice(Number(book.price), book.currency)}
                    </span>
                    <button
                      type="button"
                      data-magnetic
                      onClick={() => {
                        add({
                          slug: book.slug,
                          title: book.title,
                          price: Number(book.price),
                          currency: book.currency,
                        });
                        toast.success(`${book.title} added to your cart`);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-display text-[10px] tracking-[0.16em] text-ink uppercase"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden /> Get it
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
