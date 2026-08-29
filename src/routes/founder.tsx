import { createFileRoute } from "@tanstack/react-router";
import founderPortraitAsset from "@/assets/founder-ulrich.jpg.asset.json";
import { PageShell } from "@/components/PageShell";
import { getFounderPage } from "@/lib/content.functions";
import { site } from "@/lib/site";

const title = "Leadership With Vision | Ulrich Archie-Bong | JointHeirs DigiWorks";
const description =
  "Meet Ulrich Archie-Bong, Founder, President and CEO of JointHeirs DigiWorks Agency in Ikeja, Lagos, and the leadership team behind the work.";

export const Route = createFileRoute("/founder")({
  loader: () => getFounderPage(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/founder" },
    ],
    links: [{ rel: "canonical", href: "/founder" }],
  }),
  errorComponent: () => (
    <PageShell eyebrow="Leadership" title="Leadership With Vision" intro="Please refresh the page in a moment." />
  ),
  component: Founder,
});

function Founder() {
  const { founder, team } = Route.useLoaderData();
  const founderName = founder.name ?? site.founder;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founderName,
    jobTitle: founder.role ?? "Founder, President & Chief Executive Officer",
    worksFor: { "@type": "Organization", name: site.name },
    address: { "@type": "PostalAddress", addressLocality: "Ikeja, Lagos", addressCountry: "NG" },
  };

  return (
    <PageShell
      eyebrow="Leadership"
      title={founder.title ?? "Leadership With Vision"}
      intro={`${founderName} — ${founder.role ?? "Founder, President & Chief Executive Officer"}.`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rounded-lg border border-gold" aria-hidden />
          <img
            src={founderPortraitAsset.url}
            alt={`Portrait of ${founderName}, Founder, President and CEO of ${site.name}`}
            width={719}
            height={1080}
            className="relative w-full rounded-md object-cover shadow-[var(--shadow-luxe)]"
          />
        </div>
        <div>
          <div className="space-y-5 leading-relaxed text-muted-foreground">
            {(founder.story ?? []).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {founder.quote && (
            <blockquote className="luxe-card mt-8 p-7">
              <p className="text-lg italic">“{founder.quote}”</p>
              <footer className="mt-4 font-display text-[11px] tracking-[0.22em] text-gold uppercase">
                {founderName}
              </footer>
            </blockquote>
          )}
        </div>
      </div>

      {team.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl uppercase">Management Team</h2>
          <div className="gold-rule mt-5" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <article key={member.id} className="luxe-card overflow-hidden">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.photo_alt ?? `Portrait of ${member.name}, ${member.designation}`}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex aspect-[4/5] w-full items-center justify-center bg-navy/40"
                    aria-hidden
                  >
                    <span className="font-display text-4xl text-gold-soft">JH</span>
                  </div>
                )}
                <div className="p-7">
                  <h3 className="text-base uppercase">{member.name}</h3>
                  <p className="mt-1 font-display text-[10px] tracking-[0.22em] text-gold uppercase">
                    {member.designation}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                  {member.social_url && (
                    <a
                      href={member.social_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block font-display text-[10px] tracking-[0.2em] text-gold uppercase"
                    >
                      Connect
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
