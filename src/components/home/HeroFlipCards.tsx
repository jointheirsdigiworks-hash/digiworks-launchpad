import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeroParticles } from "@/components/effects/HeroParticles";
import heroAds from "@/assets/hero-ads.jpg";
import heroAutomation from "@/assets/hero-automation.jpg";
import heroBranding from "@/assets/hero-branding.jpg";
import heroContent from "@/assets/hero-content.jpg";
import heroPrompt from "@/assets/hero-prompt.jpg";
import heroWebsites from "@/assets/hero-websites.jpg";

type HeroCard = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; slug: string };
};

// Editable via admin in a later phase — these are the default six cards.
const cards: HeroCard[] = [
  {
    image: heroWebsites,
    alt: "Nigerian web designer reviewing a premium website layout in a dark Lagos studio at dusk",
    eyebrow: "Website Design & Development",
    title: "Websites That Convert",
    subtitle: "Premium, high-performing websites engineered for growth.",
    cta: { label: "Explore Web Design", slug: "website-design-development" },
  },
  {
    image: heroAutomation,
    alt: "African business team reviewing automation dashboards on glass screens in a dark office",
    eyebrow: "AI Business Automation",
    title: "Automate. Innovate. Scale.",
    subtitle: "Smart systems that save time and multiply revenue.",
    cta: { label: "Explore Automation", slug: "ai-business-automation" },
  },
  {
    image: heroBranding,
    alt: "Brand designer arranging gold-foiled branding materials on a matte black table",
    eyebrow: "Branding & Identity",
    title: "Brands That Stand Out",
    subtitle: "Strategic identity design that positions you for excellence.",
    cta: { label: "Explore Branding", slug: "branding-identity" },
  },
  {
    image: heroAds,
    alt: "Social media marketer reviewing campaign results on a phone with Lagos city lights behind",
    eyebrow: "Facebook & Instagram Ads",
    title: "Ads That Deliver",
    subtitle: "Data-driven social advertising that turns clicks into customers.",
    cta: { label: "Explore Paid Social", slug: "facebook-instagram-ads" },
  },
  {
    image: heroPrompt,
    alt: "Engineer studying glowing neural network patterns on a screen in a darkened room",
    eyebrow: "Prompt Engineering",
    title: "Engineer Intelligence",
    subtitle: "Precision-crafted prompts that unlock AI's full potential.",
    cta: { label: "Explore Prompt Engineering", slug: "prompt-engineering" },
  },
  {
    image: heroContent,
    alt: "Content creator filming with a cinema camera in a premium dark studio",
    eyebrow: "AI Content Creation",
    title: "Content That Connects",
    subtitle: "Human-quality content at machine speed.",
    cta: { label: "Explore Content", slug: "ai-content-creation" },
  },
];

const DURATION = 6000;

export function HeroFlipCards() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % cards.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + cards.length) % cards.length), []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(next, DURATION);
    return () => window.clearInterval(id);
  }, [next, paused]);

  return (
    <section
      aria-label="Featured services"
      className="relative w-full overflow-hidden bg-ink"
      style={{ perspective: "1600px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        touchStart.current = null;
        setPaused(false);
        if (start === null) return;
        const delta = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(delta) > 48) (delta < 0 ? next : prev)();
      }}
    >
      <HeroParticles />
      {/* Primary CTAs live here (top right of the hero) rather than in the nav bar. */}
      <div className="absolute top-20 right-4 z-20 flex flex-wrap justify-end gap-2 sm:top-24 sm:right-8 sm:gap-3 lg:right-10">
        <Link
          to="/quote"
          className="rounded-full bg-gold px-4 py-2.5 font-display text-[10px] tracking-[0.16em] uppercase text-ink shadow-[var(--shadow-gold)] transition-transform duration-300 hover:-translate-y-0.5 sm:px-5 sm:text-[12px]"
        >
          Get a Free Quote
        </Link>
        <Link
          to="/book"
          className="rounded-full border border-[oklch(0.75_0.13_88_/_55%)] bg-[oklch(0_0_0_/_35%)] px-4 py-2.5 font-display text-[10px] tracking-[0.16em] uppercase text-[oklch(0.968_0.005_247)] backdrop-blur-sm transition-colors duration-300 hover:border-[oklch(0.75_0.13_88)] hover:text-[oklch(0.75_0.13_88)] sm:px-5 sm:text-[12px]"
        >
          Book a Strategy Session
        </Link>
        <Link
          to="/admin"
          aria-label="Admin login"
          title="Admin Login"
          className="inline-flex items-center justify-center rounded-full border border-[oklch(0.968_0.005_247_/_25%)] bg-[oklch(0_0_0_/_35%)] p-2.5 text-[oklch(0.968_0.005_247_/_70%)] backdrop-blur-sm transition-colors duration-300 hover:border-[oklch(0.75_0.13_88)] hover:text-[oklch(0.75_0.13_88)]"
        >
          <Lock className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <div className="relative h-[86vh] min-h-[540px] w-full">

        {cards.map((card, i) => {
          const active = i === index;
          return (
            <article
              key={card.title}
              aria-hidden={!active}
              className="absolute inset-0 origin-top transition-all duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: active ? "rotateX(0deg) scale(1)" : "rotateX(-92deg) scale(0.96)",
                opacity: active ? 1 : 0,
                transformStyle: "preserve-3d",
                pointerEvents: active ? "auto" : "none",
              }}
            >
              <img
                src={card.image}
                alt={card.alt}
                width={1920}
                height={1088}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className={`h-full w-full object-cover transition-transform duration-[7000ms] ${active ? "scale-105" : "scale-100"}`}
              />
              <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero)" }} />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-8">
                  <div
                    className={`max-w-2xl transition-all delay-200 duration-700 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                  >
                    <p className="font-display text-[11px] tracking-[0.34em] text-[oklch(0.75_0.13_88)] uppercase">
                      {card.eyebrow}
                    </p>
                    <h1 className="mt-5 text-4xl leading-[1.05] uppercase text-[oklch(0.968_0.005_247)] sm:text-6xl lg:text-7xl">
                      {card.title}
                    </h1>
                    <p className="mt-5 max-w-xl text-base text-[oklch(0.968_0.005_247_/_82%)] sm:text-lg">
                      {card.subtitle}
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                      <Link
                        to="/quote"
                        className="rounded-full bg-gold px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink transition-transform duration-300 hover:-translate-y-0.5"
                      >
                        Get a Free Quote
                      </Link>
                      <Link
                        to="/services/$slug"
                        params={{ slug: card.cta.slug }}
                        className="rounded-full border border-[oklch(0.75_0.13_88_/_55%)] px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-[oklch(0.968_0.005_247)] transition-colors duration-300 hover:border-[oklch(0.75_0.13_88)] hover:text-[oklch(0.75_0.13_88)]"
                      >
                        {card.cta.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-8">
          <div className="flex flex-1 items-center gap-2" role="tablist" aria-label="Hero slides">
            {cards.map((card, i) => (
              <button
                key={card.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}: ${card.title}`}
                onClick={() => setIndex(i)}
                className="group relative h-[3px] w-10 overflow-hidden rounded-full bg-[oklch(0.968_0.005_247_/_28%)] sm:w-16"
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{
                    width: i === index ? "100%" : "0%",
                    backgroundImage: "var(--gradient-gold)",
                  }}
                />
              </button>
            ))}
          </div>
          <div className="ml-4 flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[oklch(0.968_0.005_247_/_35%)] text-[oklch(0.968_0.005_247)] backdrop-blur-sm transition-colors hover:border-[oklch(0.75_0.13_88)] hover:text-[oklch(0.75_0.13_88)]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[oklch(0.968_0.005_247_/_35%)] text-[oklch(0.968_0.005_247)] backdrop-blur-sm transition-colors hover:border-[oklch(0.75_0.13_88)] hover:text-[oklch(0.75_0.13_88)]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
