import { createFileRoute } from "@tanstack/react-router";
import founderPortraitCutout from "@/assets/founder-ulrich-cutout.png";
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
  const founderRole = founder.role ?? "Founder, President & Chief Executive Officer";
  const founderPortrait = founder.portrait_url?.trim() ? founder.portrait_url : founderPortraitCutout;
  const socials = (founder.socials ?? []).filter((social) => social?.url?.trim() && social?.label?.trim());

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founderName,
    jobTitle: founderRole,
    image: founderPortrait,
    sameAs: socials.map((social) => social.url),
    worksFor: { "@type": "Organization", name: site.name },
    address: { "@type": "PostalAddress", addressLocality: "Ikeja, Lagos", addressCountry: "NG" },
  };

  return (
    <PageShell
      eyebrow="Leadership"
      title={founder.title ?? "Leadership With Vision"}
      intro={founder.intro ?? "The people, principles and philosophy behind JointHeirs DigiWorks Agency."}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <figure className="mx-auto w-full max-w-sm">
          <div className="relative overflow-hidden rounded-lg border border-gold-soft bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_70%),linear-gradient(180deg,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent)]">
            <img
              src={founderPortrait}
              alt={founder.portrait_alt ?? `Portrait of ${founderName}, ${founderRole} of ${site.name}`}
              width={850}
              height={1280}
              className="relative w-full object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_24px_50px_rgba(0,0,0,0.75)]"
            />
          </div>
          <figcaption className="mt-6 text-center">
            <h2 className="text-xl uppercase">{founderName}</h2>
            <p className="mt-2 font-display text-[11px] tracking-[0.22em] text-gold uppercase">{founderRole}</p>
            <div className="gold-rule mx-auto mt-4 max-w-[120px]" />
            {socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap justify-center gap-4">
                {socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-display text-[10px] tracking-[0.2em] text-gold uppercase hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </figcaption>
        </figure>
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
