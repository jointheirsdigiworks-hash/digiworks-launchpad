import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

const title = "Privacy Policy | JointHeirs DigiWorks Agency";
const description = "How JointHeirs DigiWorks Agency collects, uses and protects personal data.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

const sections = [
  {
    heading: "Who We Are",
    body: [
      `${site.name} ("we", "us") is a digital agency registered and operating in Nigeria, with offices at ${site.address}. We are the data controller for the personal information described in this policy.`,
      "This policy explains what we collect when you use this website, why we collect it, how long we keep it and the rights you have over it.",
    ],
  },
  {
    heading: "Information We Collect",
    body: [
      "Information you give us: your name, email address, phone number, company name, project details and budget range when you submit an enquiry, request a quote, book a strategy session, subscribe to updates or buy a digital product.",
      "Information collected automatically: your IP address, browser type, device type, referring page and the pages you view. This is used in aggregate to understand how the site is used and to protect it from abuse.",
      "Chat information: if you use our on-site assistant, the messages you send are stored so we can answer follow-up questions and improve responses. Please do not share card details or passwords in chat.",
    ],
  },
  {
    heading: "Why We Use It (Lawful Basis)",
    body: [
      "To respond to your enquiry, prepare quotations and deliver the services or digital products you request — on the basis of performing a contract or taking steps at your request.",
      "To send order confirmations, download links and service updates — on the basis of contract performance.",
      "To keep the site secure, prevent fraud and enforce rate limits — on the basis of our legitimate interests.",
      "To send marketing updates — only where you have given consent, which you may withdraw at any time.",
    ],
  },
  {
    heading: "Cookies and Analytics",
    body: [
      "We use a small number of cookies and similar technologies: strictly necessary ones that make the site work and remember your theme and cart, and analytics cookies that help us measure traffic and page performance.",
      "You can block or delete cookies in your browser settings. Blocking strictly necessary cookies may prevent parts of the site, such as checkout, from working.",
    ],
  },
  {
    heading: "Sharing With Third Parties",
    body: [
      "We share personal data only with service providers who help us operate: website and database hosting, email delivery, payment processing and analytics. Each processes data on our instructions under a contract.",
      "Payments for digital products are handled by our payment provider. We never see or store your full card details.",
      "We do not sell your personal data. We may disclose information where required by Nigerian law or to protect our legal rights.",
    ],
  },
  {
    heading: "International Transfers",
    body: [
      "Some of our providers store data outside Nigeria. Where that happens we rely on providers that offer an adequate standard of protection and contractual safeguards covering the transfer.",
    ],
  },
  {
    heading: "How Long We Keep It",
    body: [
      "Enquiries, quote requests and booking records: up to 24 months after our last contact, so we can pick up conversations where they left off.",
      "Order and download records: up to seven years, to meet accounting and tax obligations.",
      "Chat transcripts: up to 12 months.",
      "Marketing consents: until you unsubscribe, plus a short record of the withdrawal itself.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "Under the Nigeria Data Protection Act you may request access to the personal data we hold about you, ask us to correct it, ask us to delete it, object to certain processing, ask us to restrict processing, or request a copy in a portable format.",
      `To exercise any of these rights, email ${site.email} or write to us at our Ikeja office. We respond within 30 days. If you are not satisfied, you may complain to the Nigeria Data Protection Commission.`,
    ],
  },
  {
    heading: "Security",
    body: [
      "The site is served over HTTPS. Access to submissions and orders is restricted to authorised administrators using authenticated accounts, and download links for purchased files are time-limited and rate-limited.",
      "No system is perfectly secure. If a breach affects your data and creates a real risk to you, we will notify you and the regulator as required by law.",
    ],
  },
  {
    heading: "Children",
    body: ["This website and our services are intended for people aged 18 and over. We do not knowingly collect data from children."],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "We may update this policy as our services change. The version in force is always the one published on this page, and material changes will be highlighted here.",
    ],
  },
];

function Privacy() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`This policy explains how ${site.name} handles personal information collected through this website. Last updated August 2026.`}
    >
      <div className="mt-12 max-w-3xl space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl uppercase">{section.heading}</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="luxe-card p-6">
          <h2 className="text-lg uppercase">Contact Us About Privacy</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {site.address}
            <br />
            <a href={`mailto:${site.email}`} className="text-gold hover:underline">
              {site.email}
            </a>
            <br />
            {site.phones.join(" · ")}
          </p>
        </section>
      </div>
    </PageShell>
  );
}
