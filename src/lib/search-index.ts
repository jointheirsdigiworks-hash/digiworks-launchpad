import type { SearchResult } from "./search.functions";

export type StaticPage = {
  title: string;
  path: string;
  excerpt: string;
  keywords: string;
};

/** Hand-written index of the site's static pages. */
export const STATIC_PAGES: StaticPage[] = [
  {
    title: "Home",
    path: "/",
    excerpt: "AI powered digital growth agency in Lagos — websites, branding, paid social and automation.",
    keywords: "home agency lagos nigeria ai growth intelligence creativity",
  },
  {
    title: "About JointHeirs DigiWorks",
    path: "/about",
    excerpt: "Who we are, how we work and the standards behind every JointHeirs DigiWorks engagement.",
    keywords: "about company values team story agency",
  },
  {
    title: "Services",
    path: "/services",
    excerpt: "Websites, funnels, branding, design, copywriting, ads, AI automation and consulting.",
    keywords: "services websites branding ads automation copywriting design",
  },
  {
    title: "Portfolio & Case Studies",
    path: "/portfolio",
    excerpt: "Selected client work and measurable results across Nigerian and international brands.",
    keywords: "portfolio case studies work projects clients results",
  },
  {
    title: "Insights",
    path: "/insights",
    excerpt: "Articles and videos on AI marketing, brand building and digital growth.",
    keywords: "blog insights articles video marketing ai",
  },
  {
    title: "Books",
    path: "/books",
    excerpt: "Books and publications from the JointHeirs DigiWorks team, including the AI-Powered Entrepreneur series.",
    keywords: "books publications ebook ai powered entrepreneur reading library",
  },
  {
    title: "Shop",
    path: "/shop",
    excerpt: "Digital products — ebooks, templates, video and audio assets you can download instantly.",
    keywords: "shop store products ebooks templates download digital",
  },
  {
    title: "Founder",
    path: "/founder",
    excerpt: "Leadership with vision — Ulrich Archie-Bong, Founder, President & CEO.",
    keywords: "founder ulrich archie-bong leadership ceo management team",
  },
  {
    title: "Contact",
    path: "/contact",
    excerpt: "Talk to our Lagos team by phone, email or WhatsApp.",
    keywords: "contact phone email whatsapp address lagos ikeja enquiry",
  },
  {
    title: "Get a Free Quote",
    path: "/quote",
    excerpt: "Tell us about your project and get a tailored quote.",
    keywords: "quote pricing estimate proposal brief",
  },
  {
    title: "Book a Strategy Session",
    path: "/book",
    excerpt: "Book a complimentary strategy session with our team.",
    keywords: "book booking strategy session consultation call appointment",
  },
  {
    title: "Privacy Policy",
    path: "/privacy",
    excerpt: "How we collect, use and protect personal data under the NDPA.",
    keywords: "privacy policy data protection ndpa cookies",
  },
  {
    title: "Terms of Service",
    path: "/terms",
    excerpt: "The terms that govern our services, deliverables and payments.",
    keywords: "terms conditions service agreement payments",
  },
];

/** Rank exact and prefix title matches above body-only matches. */
export function rankResults(results: SearchResult[], query: string): SearchResult[] {
  const q = query.toLowerCase();
  const score = (result: SearchResult) => {
    const title = result.title.toLowerCase();
    if (title === q) return 0;
    if (title.startsWith(q)) return 1;
    if (title.includes(q)) return 2;
    return 3;
  };
  return [...results].sort((a, b) => score(a) - score(b) || a.title.localeCompare(b.title));
}
