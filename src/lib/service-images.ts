import heroAds from "@/assets/hero-ads.jpg";
import heroAutomation from "@/assets/hero-automation.jpg";
import heroBranding from "@/assets/hero-branding.jpg";
import heroContent from "@/assets/hero-content.jpg";
import heroPrompt from "@/assets/hero-prompt.jpg";
import heroWebsites from "@/assets/hero-websites.jpg";

/** Fallback imagery per service slug, used until an admin uploads a custom hero image. */
export const serviceImages: Record<string, string> = {
  "website-design-development": heroWebsites,
  "landing-pages-funnels": heroWebsites,
  "graphic-design": heroBranding,
  "logo-design": heroBranding,
  "prompt-engineering": heroPrompt,
  copywriting: heroContent,
  "ai-business-automation": heroAutomation,
  "social-media-designs": heroContent,
  "ai-content-creation": heroContent,
  "facebook-instagram-ads": heroAds,
  "ai-business-consulting": heroAutomation,
  "branding-identity": heroBranding,
  "complete-digital-solutions": heroWebsites,
};

export const fallbackCovers = [heroWebsites, heroAutomation, heroBranding, heroAds, heroContent, heroPrompt];

export function coverFor(slug: string, index = 0) {
  return serviceImages[slug] ?? fallbackCovers[index % fallbackCovers.length]!;
}
