import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

const title = "About Us | JointHeirs DigiWorks Agency";
const description =
  "Who we are: a Lagos-based AI powered digital growth agency building premium brands and systems.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  {
    title: "Clarity Before Craft",
    copy: "Every engagement starts with the commercial question: what should this work make happen? Design and technology follow that answer, never the other way round.",
  },
  {
    title: "Premium, Not Precious",
    copy: "We hold a high standard on detail, typography, speed and accessibility — while shipping on the timelines a growing business actually lives by.",
  },
  {
    title: "Technology That Serves People",
    copy: "AI and automation earn their place only when they remove friction for your team and your customers. We refuse complexity that cannot justify itself.",
  },
  {
    title: "Accountable Partnership",
    copy: "One team, one point of contact, one roadmap. You always know what is being built, why it matters and what it cost.",
  },
];

const stats = [
  { value: "13", label: "Specialist services under one roof" },
  { value: "6", label: "Disciplines from brand to automation" },
  { value: "Lagos", label: "Ikeja base, clients nationwide" },
  { value: "30 days", label: "Post-launch support on every build" },
];

function About() {
  return (
    <PageShell
      eyebrow="About Us"
      title="Your Growth Partner in the Age of AI"
      intro="JointHeirs DigiWorks Agency is an AI powered digital growth agency based in Omole Phase 1, Ikeja, Lagos. We build premium brands, high-performing websites and practical AI systems for businesses that intend to grow."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5 leading-relaxed text-muted-foreground">
          <h2 className="text-2xl uppercase text-foreground">Our Story</h2>
          <p>
            JointHeirs DigiWorks Agency was founded by Ulrich Archie-Bong on a simple observation: most
            Nigerian businesses were being sold either beautiful work that produced nothing, or technical
            work nobody could explain. Very few partners offered both craft and commercial thinking in the
            same room.
          </p>
          <p>
            We built the studio to close that gap. Brand, website, content, advertising and automation are
            delivered by one accountable team working from a single roadmap — so your positioning, your
            website, your campaigns and your internal systems finally tell the same story.
          </p>
          <p>
            Today we work with property firms, clinics, logistics operators, consultancies and agribusinesses
            across Nigeria, and with founders abroad building for the Nigerian market. The brief is always the
            same: make the business easier to choose, and easier to run.
          </p>
        </div>
        <div className="space-y-5 leading-relaxed text-muted-foreground">
          <h2 className="text-2xl uppercase text-foreground">Our Mission</h2>
          <p>
            To help ambitious businesses turn ideas into compelling brands, practical digital solutions and
            measurable growth — using creativity and artificial intelligence with equal discipline.
          </p>
          <h2 className="pt-4 text-2xl uppercase text-foreground">How We Work</h2>
          <p>
            We scope tightly, quote in writing, and report in plain language. Nothing is billed that was not
            agreed, and nothing is handed over without documentation and a training session. Every build
            includes thirty days of post-launch support.
          </p>
          <p className="font-display tracking-[0.18em] text-gold uppercase">
            Intelligence. Creativity. Growth.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="luxe-card p-6 text-center">
            <p className="font-display text-3xl text-gold">{stat.value}</p>
            <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl uppercase">What We Believe</h2>
        <div className="gold-rule mt-5" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <article key={value.title} className="luxe-card p-6">
              <h3 className="text-lg uppercase">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

