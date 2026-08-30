import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { searchSite } from "@/lib/search.functions";

const title = "Search | JointHeirs DigiWorks Agency";
const description = "Search services, case studies, insights, books and digital products across JointHeirs DigiWorks.";

const searchSchema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const run = useServerFn(searchSite);
  const [term, setTerm] = useState(q);
  const query = q.trim().slice(0, 120);

  const results = useQuery({
    queryKey: ["site-search", query],
    queryFn: () => run({ data: { q: query } }),
    enabled: query.length >= 2,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-6">
      <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Search</p>
      <h1 className="mt-4 text-4xl uppercase">Find Anything On This Site</h1>

      <form
        className="relative mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          void navigate({ to: "/search", search: { q: term.trim().slice(0, 120) } });
        }}
      >
        <label htmlFor="site-search-input" className="sr-only">
          Search the site
        </label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="site-search-input"
          type="search"
          value={term}
          autoFocus
          maxLength={120}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Try “branding”, “AI automation”, “books”…"
          className="w-full rounded-full border border-input bg-background/60 py-3.5 pr-28 pl-11 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-gold px-5 py-2.5 font-display text-[11px] tracking-[0.16em] text-ink uppercase"
        >
          Search
        </button>
      </form>

      {query.length < 2 ? (
        <p className="mt-10 text-sm text-muted-foreground">Enter at least two characters to search.</p>
      ) : results.isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Searching…</p>
      ) : results.data && results.data.results.length > 0 ? (
        <>
          <p className="mt-10 text-sm text-muted-foreground">
            {results.data.results.length} result{results.data.results.length === 1 ? "" : "s"} for “{query}”
          </p>
          <ul className="mt-6 space-y-3">
            {results.data.results.map((result) => (
              <li key={`${result.kind}-${result.path}`}>
                <Link
                  to={result.path}
                  className="luxe-card hover-glow block p-5 transition-transform hover:-translate-y-0.5"
                >
                  <span className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">{result.kind}</span>
                  <h2 className="mt-2 font-display text-base uppercase">{result.title}</h2>
                  {result.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{result.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-10 text-sm text-muted-foreground">
          No matches for “{query}”. Try a broader term, or{" "}
          <Link to="/contact" className="text-gold underline-offset-4 hover:underline">
            contact our team
          </Link>
          .
        </p>
      )}
    </main>
  );
}
