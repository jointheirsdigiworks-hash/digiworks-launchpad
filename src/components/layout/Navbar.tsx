import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/jointheirs-logo.png.asset.json";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navLinks, services } from "@/lib/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          <img
            src={logo.url}
            alt="JointHeirs DigiWorks Agency logo"
            width={1366}
            height={455}
            className={`w-auto transition-all duration-500 ${scrolled ? "h-9" : "h-11"} ${
              // keep the wordmark legible on matte black
              "dark:brightness-110"
            }`}
          />
        </Link>

        <ul className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-gold" }}
                className="font-display text-[13px] tracking-[0.18em] uppercase text-foreground/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/quote"
            className="hidden rounded-full bg-gold px-5 py-2.5 font-display text-[12px] tracking-[0.16em] uppercase text-ink shadow-[var(--shadow-gold)] transition-transform duration-300 hover:-translate-y-0.5 lg:inline-flex"
          >
            Get a Free Quote
          </Link>
          <Link
            to="/book"
            className="hidden rounded-full border border-gold-soft px-5 py-2.5 font-display text-[12px] tracking-[0.16em] uppercase text-foreground transition-colors duration-300 hover:border-gold hover:text-gold xl:inline-flex"
          >
            Book a Strategy Session
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-soft text-foreground xl:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-background transition-all duration-500 xl:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <img src={logo.url} alt="JointHeirs DigiWorks Agency logo" className="h-9 w-auto" />
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
          </div>
        </div>
      </div>
    </header>
  );
}
