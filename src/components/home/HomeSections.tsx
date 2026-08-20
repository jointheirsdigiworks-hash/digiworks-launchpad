import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brush,
  Layers,
  MonitorSmartphone,
  PenTool,
  Quote,
  Sparkles,
  Target,
} from "lucide-react";
import { useState } from "react";
import founderPortrait from "@/assets/founder-portrait.jpg";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/lib/site";

function SectionHeading({
  eyebrow,
  title,
  copy,
  center = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="font-display text-[11px] tracking-[0.32em] text-gold uppercase">{eyebrow}</p>
      <h2 className="mt-4 text-3xl uppercase sm:text-4xl">{title}</h2>
      <div className={`gold-rule mt-5 ${center ? "mx-auto" : ""}`} />
      {copy && <p className="mt-5 text-muted-foreground">{copy}</p>}
    </div>
  );
}

/* ------------------------------ Client marquee ------------------------------ */

const clientLogos = ["Client One", "Client Two", "Client Three", "Client Four", "Client Five", "Client Six"];

export function ClientMarquee() {
  return (
    <section aria-label="Client logos" className="border-y border-border bg-surface/40 py-10">
      <p className="text-center font-display text-[10px] tracking-[0.34em] text-muted-foreground uppercase">
        Trusted by growing brands — placeholder logos
      </p>
      <div className="group mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-14 group-hover:[animation-play-state:paused]">
          {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-xl tracking-[0.16em] text-muted-foreground/60 uppercase transition-colors duration-300 hover:text-gold"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Founder preview ---------------------------- */

export function FounderPreview() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="relative mx-auto w-full max-w-md">
        <div className="absolute -inset-3 rounded-lg border border-gold" aria-hidden />
        <img
          src={founderPortrait}
          alt="Portrait of Ulrich Archie-Bong, Founder, President and CEO of JointHeirs DigiWorks Agency"
          width={1024}
          height={1280}
          loading="lazy"
          decoding="async"
          className="relative w-full rounded-md object-cover shadow-[var(--shadow-luxe)]"
        />
      </div>
      <div>
        <SectionHeading
          eyebrow="Founder & Leadership"
          title="Your Growth Partner in the Age of AI"
          copy="Placeholder founder bio: a short paragraph about Ulrich Archie-Bong, Founder, President & CEO, and the philosophy behind JointHeirs DigiWorks Agency — combining premium design craft with practical AI systems that grow businesses."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-[oklch(0.968_0.005_247)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            About the Agency <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/founder"
            className="inline-flex items-center gap-2 rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase transition-colors hover:border-gold hover:text-gold"
          >
            Meet the Founder
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Services grid ----------------------------- */

const featuredIcons = [MonitorSmartphone, Bot, Brush, Target, Sparkles, PenTool, BarChart3, Layers];
const featured = [
  "website-design-development",
  "ai-business-automation",
  "branding-identity",
  "facebook-instagram-ads",
  "prompt-engineering",
  "copywriting",
  "ai-business-consulting",
  "complete-digital-solutions",
];

export function ServicesGrid() {
  return (
    <section className="bg-secondary/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Core Services"
          copy="Premium digital capability, delivered end to end by one accountable partner."
          center
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((slug, i) => {
            const service = services.find((s) => s.slug === slug)!;
            const Icon = featuredIcons[i] ?? Layers;
            return (
              <Link
                key={slug}
                to="/services/$slug"
                params={{ slug }}
                className="luxe-card group flex flex-col p-7"
              >
                <Icon className="h-7 w-7 text-gold" aria-hidden />
                <h3 className="mt-5 text-lg leading-snug uppercase">{service.name}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-display text-[11px] tracking-[0.2em] text-gold uppercase">
                  Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Automation showcase -------------------------- */

export function AutomationShowcase() {
  const nodes = [
    { label: "Leads", x: 90 },
    { label: "Content", x: 290 },
    { label: "Ads", x: 490 },
    { label: "Analytics", x: 690 },
  ];

  return (
    <section className="bg-ink py-24 text-[oklch(0.968_0.005_247)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI Automation"
          title="One Connected Growth Engine"
          copy="Placeholder metrics: automation typically reclaims hours of manual work each week and compounds revenue by keeping every channel in sync."
          center
        />
        <div className="mt-14 overflow-x-auto rounded-lg border border-gold-soft bg-[oklch(0.213_0.038_268)] p-6 sm:p-10">
          <svg viewBox="0 0 780 240" className="mx-auto h-auto w-full min-w-[680px]" role="img" aria-label="Diagram showing leads, content, ads and analytics connected by an AI automation core">
            <defs>
              <linearGradient id="goldLine" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.75 0.13 88)" />
                <stop offset="100%" stopColor="oklch(0.53 0.17 44)" />
              </linearGradient>
            </defs>
            {nodes.map((node, i) => (
              <g key={node.label}>
                <rect
                  x={node.x - 60}
                  y={30}
                  width={120}
                  height={54}
                  rx={10}
                  fill="none"
                  stroke="url(#goldLine)"
                  strokeWidth={1.5}
                />
                <text
                  x={node.x}
                  y={62}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="14"
                  letterSpacing="2"
                >
                  {node.label.toUpperCase()}
                </text>
                <path
                  d={`M ${node.x} 84 C ${node.x} 130, 390 130, 390 158`}
                  fill="none"
                  stroke="url(#goldLine)"
                  strokeWidth={1.5}
                  className="animate-flow"
                  style={{ animationDelay: `${i * 0.25}s` }}
                />
              </g>
            ))}
            <rect x={280} y={158} width={220} height={58} rx={12} fill="none" stroke="url(#goldLine)" strokeWidth={2} />
            <text x={390} y={193} textAnchor="middle" fill="oklch(0.75 0.13 88)" fontSize="15" letterSpacing="3">
              AI AUTOMATION CORE
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Portfolio highlights -------------------------- */

const caseStudies = [
  { slug: "case-study-one", title: "Case Study One", sector: "Placeholder Sector", result: "Placeholder result metric" },
  { slug: "case-study-two", title: "Case Study Two", sector: "Placeholder Sector", result: "Placeholder result metric" },
  { slug: "case-study-three", title: "Case Study Three", sector: "Placeholder Sector", result: "Placeholder result metric" },
];

export function PortfolioHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Selected Work" title="Portfolio Highlights" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            to="/portfolio/$slug"
            params={{ slug: study.slug }}
            className="luxe-card group relative overflow-hidden p-8"
          >
            <p className="font-display text-[11px] tracking-[0.24em] text-gold uppercase">{study.sector}</p>
            <h3 className="mt-4 text-2xl uppercase">{study.title}</h3>
            <div className="mt-6 max-h-0 overflow-hidden text-sm text-muted-foreground opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
              {study.result}. Placeholder project summary describing scope, approach and outcome.
            </div>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-[11px] tracking-[0.2em] uppercase">
              View Case Study <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Testimonials ------------------------------ */

const testimonials = [
  { quote: "Placeholder testimonial about the results delivered by the team.", name: "Client Name", role: "Role, Company" },
  { quote: "Placeholder testimonial about the process and communication.", name: "Client Name", role: "Role, Company" },
  { quote: "Placeholder testimonial about design quality and ROI.", name: "Client Name", role: "Role, Company" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const item = testimonials[i] ?? testimonials[0]!;

  return (
    <section className="bg-secondary/50 py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Quote className="mx-auto h-10 w-10 text-gold" aria-hidden />
        <blockquote className="mt-8 font-display text-2xl leading-snug uppercase sm:text-3xl">
          {item.quote}
        </blockquote>
        <p className="mt-6 text-sm text-muted-foreground">
          {item.name} — {item.role}
        </p>
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, idx) => (
            <button
              key={`${t.name}-${idx}`}
              type="button"
              aria-label={`Show testimonial ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 w-2 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "bg-muted-foreground/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Insights preview ---------------------------- */

type Post = { id: string; slug: string; title: string; excerpt: string | null; published_at: string | null };

export function InsightsPreview() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["latest-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as Post[];
    },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Insights" title="Latest From the Blog" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {isLoading &&
          [0, 1, 2].map((n) => <div key={n} className="luxe-card h-48 animate-pulse p-8" />)}
        {posts?.map((post) => (
          <Link
            key={post.id}
            to="/insights/$slug"
            params={{ slug: post.slug }}
            className="luxe-card group flex flex-col p-8"
          >
            {post.published_at && (
              <p className="font-display text-[11px] tracking-[0.24em] text-gold uppercase">
                {new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
            <h3 className="mt-4 text-xl leading-snug uppercase">{post.title}</h3>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-[11px] tracking-[0.2em] text-gold uppercase">
              Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
        {!isLoading && !posts?.length && (
          <p className="text-sm text-muted-foreground">No articles published yet.</p>
        )}
      </div>
    </section>
  );
}

/* -------------------------------- Final CTA ------------------------------- */

export function FinalCTA() {
  return (
    <section className="bg-ink py-24 text-[oklch(0.968_0.005_247)]">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl uppercase sm:text-5xl">Ready to Grow with AI?</h2>
        <div className="gold-rule mx-auto mt-6" />
        <p className="mt-6 text-[oklch(0.968_0.005_247_/_78%)]">
          Tell us where you want to be in twelve months. We will design the digital engine that takes
          you there.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/quote"
            className="rounded-full bg-gold px-7 py-3.5 font-display text-[12px] tracking-[0.18em] uppercase text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            Request a Quote
          </Link>
          <Link
            to="/book"
            className="rounded-full border border-[oklch(0.75_0.13_88_/_55%)] px-7 py-3.5 font-display text-[12px] tracking-[0.18em] uppercase transition-colors hover:border-[oklch(0.75_0.13_88)] hover:text-[oklch(0.75_0.13_88)]"
          >
            Book a Strategy Session
          </Link>
        </div>
      </div>
    </section>
  );
}
