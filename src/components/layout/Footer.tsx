import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import logo from "@/assets/jointheirs-logo.png.asset.json";
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
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <img src={logo.url} alt="JointHeirs DigiWorks Agency logo" className="h-10 w-auto" loading="lazy" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {site.name} is an {site.tagline.toLowerCase()} building premium websites, brands and AI
            automation systems for ambitious businesses in Nigeria and beyond.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.2em] text-gold uppercase">Services</h3>
          <ul className="mt-5 space-y-2.5">
            {services.slice(0, 8).map((service) => (
              <li key={service.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.2em] text-gold uppercase">Company</h3>
          <ul className="mt-5 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.2em] text-gold uppercase">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>{site.address}</span>
            </li>
            {site.phones.map((phone) => (
              <li key={phone} className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold">
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-gold" aria-hidden />
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="hover:text-gold">
                {site.whatsappDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-gold">
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-soft text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link to="/founder" className="text-gold transition-colors hover:text-ember">
            Design by {site.founder} - {site.name}
          </Link>
          <p className="text-muted-foreground">© 2026 {site.name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
