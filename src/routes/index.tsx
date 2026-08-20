import { createFileRoute } from "@tanstack/react-router";
import { HeroFlipCards } from "@/components/home/HeroFlipCards";
import {
  AutomationShowcase,
  ClientMarquee,
  FinalCTA,
  FounderPreview,
  InsightsPreview,
  PortfolioHighlights,
  ServicesGrid,
  Testimonials,
} from "@/components/home/HomeSections";

const title = "JointHeirs DigiWorks Agency | AI Powered Digital Growth Agency";
const description =
  "Premium websites, branding, paid social and AI automation for ambitious businesses in Lagos, Nigeria and beyond.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <HeroFlipCards />
      <ClientMarquee />
      <FounderPreview />
      <ServicesGrid />
      <AutomationShowcase />
      <PortfolioHighlights />
      <Testimonials />
      <InsightsPreview />
      <FinalCTA />
    </main>
  );
}
