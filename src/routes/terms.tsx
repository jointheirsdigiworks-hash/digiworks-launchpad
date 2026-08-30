import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

const title = "Terms & Conditions | JointHeirs DigiWorks Agency";
const description = "The terms that govern the use of our website and services.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

const sections = [
  {
    heading: "Agreement",
    body: [
      `These terms govern your use of this website and any services or digital products you obtain from ${site.name}. By using the site or engaging us, you accept them.`,
      "Where we issue a signed proposal, statement of work or invoice for a specific project, that document takes precedence over these terms for anything it addresses directly.",
    ],
  },
  {
    heading: "Scope of Services",
    body: [
      "We deliver only what a written proposal or statement of work sets out: the deliverables, the number of concepts, the platforms covered and the timeline. Anything not listed is out of scope.",
      "Additional requests are welcome and will be quoted separately before any work begins. We do not carry out unquoted work and then invoice for it.",
    ],
  },
  {
    heading: "Quotations and Payment",
    body: [
      "Quotations are valid for 30 days from the date of issue and are stated in Nigerian Naira unless agreed otherwise.",
      "Projects begin on receipt of a 60% commitment deposit, with the 40% balance due on approval and before final handover or deployment. Retainers are invoiced monthly in advance.",
      "Invoices are payable within 7 days. Work may be paused on overdue accounts, and any bank charges or transfer fees are payable by the client.",
    ],
  },
  {
    heading: "Client Responsibilities",
    body: [
      "You agree to provide content, brand assets, access credentials and feedback within the agreed timeframes, and to nominate one decision-maker who can approve work.",
      "You confirm that any text, images, logos or data you supply are yours to use and do not infringe anyone else's rights.",
      "Where delays in content or approvals move the timeline, the launch date moves with them. Files left unapproved and inactive for more than 60 days may be archived and reactivated on a new quotation.",
    ],
  },
  {
    heading: "Revisions and Approval",
    body: [
      "Each deliverable includes two rounds of revision within the agreed direction. Further rounds, or changes of direction after a concept has been approved, are quoted separately.",
      "Deliverables are considered approved once you confirm in writing, or if no feedback is received within 10 working days of submission.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "On full payment, ownership of the final approved deliverables produced specifically for you transfers to you.",
      "We retain ownership of our working files, internal tooling, frameworks, prompt libraries and any pre-existing components used in the build, which you receive a perpetual licence to use as part of the delivered work.",
      "Third-party assets such as fonts, stock imagery, plugins and hosting are licensed in your name and remain subject to their own terms and renewal fees.",
      "Unless you ask us in writing not to, we may show the finished work in our portfolio and marketing.",
    ],
  },
  {
    heading: "Digital Products",
    body: [
      "Digital products purchased on this site are licensed to one individual or one business for internal use. You may not resell, redistribute or repackage them.",
      "Download links are personal, time-limited and rate-limited. Because files are delivered instantly, digital purchases are non-refundable except where the file is faulty or does not match its description — contact us and we will fix it or refund you.",
    ],
  },
  {
    heading: "Support and Warranty",
    body: [
      "Every website build includes 30 days of post-launch support covering defects in the work we delivered. It does not cover new features, content changes, third-party outages or issues caused by changes made by others.",
      "We do not warrant uninterrupted service, specific search rankings or specific commercial results, as these depend on factors outside our control.",
    ],
  },
  {
    heading: "Confidentiality",
    body: [
      "Each party will keep the other's non-public business information confidential and use it only to deliver or receive the services. This obligation continues after the engagement ends.",
    ],
  },
  {
    heading: "Cancellation",
    body: [
      "Either party may end an engagement with 14 days' written notice. Work completed and expenses committed up to that date are payable, and deposits covering work already performed are non-refundable.",
      "Retainers may be cancelled with 30 days' written notice before the next billing date.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "Nothing in these terms limits liability for fraud or for anything that cannot lawfully be limited.",
      "Otherwise our total liability for any claim is limited to the fees paid to us for the affected engagement in the preceding three months, and we are not liable for indirect or consequential loss, including lost profit, revenue or data.",
    ],
  },
  {
    heading: "Governing Law",
    body: [
      "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes will be resolved in the courts of Lagos State, after both parties have made a genuine attempt to settle the matter in good faith.",
    ],
  },
];

function Terms() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms & Conditions"
      intro={`The terms on which ${site.name} provides services and digital products. Last updated August 2026.`}
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
          <h2 className="text-lg uppercase">Questions About These Terms</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
