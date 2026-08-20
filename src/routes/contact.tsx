import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageShell } from "@/components/PageShell";
import { site, whatsappHref } from "@/lib/site";

const title = "Contact | JointHeirs DigiWorks Agency";
const description = "Talk to JointHeirs DigiWorks Agency in Ikeja, Lagos — phone, WhatsApp or email.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
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
        <EnquiryForm />
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
