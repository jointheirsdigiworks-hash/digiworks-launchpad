import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageShell } from "@/components/PageShell";
import { site, whatsappHref } from "@/lib/site";

const title = "Contact a Digital Agency in Ikeja, Lagos | JointHeirs DigiWorks";
const description =
  "Call, WhatsApp or email JointHeirs DigiWorks Agency in Omole Phase 1, Ikeja, Lagos for websites, branding, ads and AI automation.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell eyebrow="Contact" title="Let's Talk" intro="Send an enquiry or reach us directly.">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <ContactForm />
        <address className="luxe-card mt-10 h-fit space-y-4 p-8 text-sm not-italic text-muted-foreground">
          <p>{site.address}</p>
          {site.phones.map((phone) => (
            <p key={phone}>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold">
                {phone}
              </a>
            </p>
          ))}
          <p>
            WhatsApp:{" "}
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="text-gold hover:text-ember">
              {site.whatsappDisplay}
            </a>
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="break-all hover:text-gold">
              {site.email}
            </a>
          </p>
        </address>
      </div>
    </PageShell>
  );
}
