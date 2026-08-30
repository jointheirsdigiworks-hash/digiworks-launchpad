import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Lock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { services, site, whatsappHref } from "@/lib/site";

const companyLinks = [
  { to: "/about", label: "About Us" },
  { to: "/founder", label: "Founder" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/insights", label: "Insights" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[oklch(0.75_0.13_88_/_25%)] bg-[#111111] text-[#F1EFEA] transition-colors duration-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <BrandLogo className="h-10" />
          <p className="mt-5 text-sm leading-relaxed text-[#D8DCE4]">
            {site.name} is an {site.tagline.toLowerCase()} building premium websites, brands and AI
            automation systems for ambitious businesses in Nigeria and beyond.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.2em] text-[oklch(0.82_0.11_88)] uppercase">Services</h3>
          <ul className="mt-5 space-y-2.5">
            {services.slice(0, 8).map((service) => (
              <li key={service.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  className="text-sm text-[#D8DCE4] transition-colors hover:text-[oklch(0.82_0.11_88)]"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.2em] text-[oklch(0.82_0.11_88)] uppercase">Company</h3>
          <ul className="mt-5 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-[#D8DCE4] transition-colors hover:text-[oklch(0.82_0.11_88)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.2em] text-[oklch(0.82_0.11_88)] uppercase">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm text-[#D8DCE4]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.82_0.11_88)]" aria-hidden />
              <span>{site.address}</span>
            </li>
            {site.phones.map((phone) => (
              <li key={phone} className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[oklch(0.82_0.11_88)]" aria-hidden />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[oklch(0.86_0.11_88)]">
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-[oklch(0.82_0.11_88)]" aria-hidden />
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="hover:text-[oklch(0.86_0.11_88)]">
                {site.whatsappDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[oklch(0.82_0.11_88)]" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-[oklch(0.86_0.11_88)]">
                {site.email}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[
              { href: site.socials.facebook, Icon: Facebook, label: "Facebook" },
              { href: site.socials.instagram, Icon: Instagram, label: "Instagram" },
              { href: site.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.75_0.13_88_/_45%)] text-[#F1EFEA] transition-colors hover:border-[oklch(0.82_0.11_88)] hover:text-[oklch(0.86_0.11_88)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[oklch(0.75_0.13_88_/_20%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link to="/founder" className="text-[oklch(0.84_0.11_88)] transition-colors hover:text-[#E8C9A0]">
            Design by {site.founder} - {site.name}
          </Link>
          <div className="flex items-center gap-5">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[#C9CFD9] transition-colors hover:text-[oklch(0.86_0.11_88)]"
            >
              <Lock className="h-3 w-3" aria-hidden />
              Admin Login
            </Link>
            <p className="text-[#C9CFD9]">© 2026 {site.name}. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
