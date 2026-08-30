import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Search affordance for the navbar: a gold-outlined icon button that expands
 * into an input on click (and stays a full input on wide screens is not needed —
 * the expand behaviour is identical on desktop and mobile for consistency).
 */
export function SearchBox({ tone, onNavigate }: { tone: string; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const q = term.trim().slice(0, 120);
    if (q.length < 2) return;
    setOpen(false);
    onNavigate?.();
    void navigate({ to: "/search", search: { q } });
  }

  return (
    <form onSubmit={submit} role="search" className="flex items-center">
      <div
        className={`flex items-center overflow-hidden rounded-full border transition-all duration-500 ${tone} ${
          open ? "w-44 bg-background/70 pl-3 sm:w-60" : "w-10 border-transparent"
        }`}
      >
        {open && (
          <>
            <label htmlFor="nav-search" className="sr-only">
              Search the site
            </label>
            <input
              ref={inputRef}
              id="nav-search"
              type="search"
              value={term}
              maxLength={120}
              placeholder="Search…"
              onChange={(event) => setTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false);
              }}
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </>
        )}
        <button
          type={open ? "submit" : "button"}
          onClick={() => {
            if (!open) setOpen(true);
          }}
          aria-label={open ? "Submit search" : "Open search"}
          aria-expanded={open}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${open ? "" : "border"} ${tone}`}
        >
          <Search className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close search"
          className={`ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full ${tone}`}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </form>
  );
}
