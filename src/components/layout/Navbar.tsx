import { Link, useRouterState } from "@tanstack/react-router";
import { Lock, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { SearchBox } from "@/components/SearchBox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navLinks, services } from "@/lib/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // At the top of the homepage the navbar floats over the dark cinematic hero,
  // so links stay silver-white in both themes for contrast.
  const overHero = pathname === "/" && !scrolled;
  const linkTone = overHero
    ? "text-[oklch(0.968_0.005_247)] hover:text-[oklch(0.75_0.13_88)]"
    : "text-foreground/80 hover:text-gold";
  const ghostTone = overHero
    ? "border-[oklch(0.75_0.13_88_/_55%)] text-[oklch(0.968_0.005_247)] hover:border-[oklch(0.75_0.13_88)] hover:text-[oklch(0.75_0.13_88)]"
    : "border-gold-soft text-foreground hover:border-gold hover:text-gold";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav py-2" : "border-b border-transparent py-4"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link to="/" className="flex shrink-0 items-center" aria-label={`${"JointHeirs DigiWorks Agency"} home`}>
          <BrandLogo className={`transition-all duration-700 ease-out ${scrolled ? "h-9" : "h-11"}`} />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-6">
          <ul className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-gold" }}
                  className={`font-display text-[13px] tracking-[0.18em] uppercase transition-colors ${linkTone}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <SearchBox tone={ghostTone} />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border xl:hidden ${ghostTone}`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

      </nav>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-background transition-all duration-500 xl:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <BrandLogo className="h-9" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-soft text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10">
          <div className="mb-6">
            <SearchBox tone="border-gold-soft text-foreground" onNavigate={() => setOpen(false)} />
          </div>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block font-display text-3xl tracking-wide uppercase text-foreground transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 font-display text-[11px] tracking-[0.3em] text-gold uppercase">
            Service Categories
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {services.slice(0, 8).map((service) => (
              <li key={service.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gold px-6 py-3 text-center font-display text-sm tracking-[0.16em] uppercase text-ink"
            >
              Get a Free Quote
            </Link>
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="rounded-full border border-gold-soft px-6 py-3 text-center font-display text-sm tracking-[0.16em] uppercase text-foreground"
            >
              Book a Strategy Session
            </Link>
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-soft px-6 py-3 text-center font-display text-xs tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:text-gold"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden /> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
