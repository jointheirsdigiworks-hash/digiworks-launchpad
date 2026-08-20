export const site = {
  name: "JointHeirs DigiWorks Agency",
  tagline: "AI Powered Digital Growth Agency",
  founder: "Ulrich Archie-Bong",
  address: "76 Lola Holloway Street, Omole Phase 1, Ikeja, Lagos, Nigeria",
  phones: ["0903 114 7808", "0805 440 0328"],
  whatsapp: "+2349027769832",
  whatsappDisplay: "+234 902 776 9832",
  whatsappMessage:
    "Hello JointHeirs DigiWorks Agency, I would like to make an enquiry.",
  email: "jointheirsdigiworks@gmail.com",
  socials: {
    facebook: "https://facebook.com/JointHeirs DigiWorks",
    instagram: "https://instagram.com/jointheirsdigiworks",
    x: "#",
    linkedin: "#",
  },
} as const;

export const whatsappHref = `https://wa.me/${site.whatsapp.replace("+", "")}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;

export const services = [
  { slug: "website-design-development", name: "Website Design & Development", blurb: "Premium, high-performing websites engineered for growth and conversion." },
  { slug: "landing-pages-funnels", name: "Landing Pages & Funnels", blurb: "Conversion-first landing pages and funnels that capture qualified demand." },
  { slug: "graphic-design", name: "Professional Graphic Design", blurb: "Editorial-grade visuals for campaigns, decks, print and digital." },
  { slug: "logo-design", name: "Professional Logo Design", blurb: "Distinctive marks built to scale across every brand touchpoint." },
  { slug: "prompt-engineering", name: "Professional Prompt Engineering", blurb: "Precision-crafted prompt systems that unlock AI's full potential." },
  { slug: "copywriting", name: "Professional Copywriting", blurb: "Persuasive brand and sales copy written to move decisions." },
  { slug: "ai-business-automation", name: "AI Business Automation", blurb: "Smart systems that save time and multiply revenue." },
  { slug: "social-media-designs", name: "Social Media Designs", blurb: "Scroll-stopping content systems built for consistency." },
  { slug: "ai-content-creation", name: "AI Content Creation", blurb: "Human-quality content at machine speed." },
  { slug: "facebook-instagram-ads", name: "Facebook & Instagram Ads", blurb: "Data-driven social advertising that turns clicks into customers." },
  { slug: "ai-business-consulting", name: "AI Business Consulting", blurb: "Advisory that turns AI capability into commercial advantage." },
  { slug: "branding-identity", name: "Branding & Identity", blurb: "Strategic identity design that positions you for excellence." },
  { slug: "complete-digital-solutions", name: "Complete Digital Solutions", blurb: "One accountable partner for your entire digital stack." },
] as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/insights", label: "Insights" },
  { to: "/shop", label: "Shop" },
  { to: "/founder", label: "Founder" },
  { to: "/contact", label: "Contact" },
] as const;
