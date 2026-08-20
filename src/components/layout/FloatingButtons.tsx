import { Bot, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";

export function FloatingButtons() {
  return (
    <>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 left-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[oklch(0.968_0.005_247)] shadow-[var(--shadow-luxe)] ring-1 ring-gold-soft transition-transform duration-300 hover:-translate-y-1"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <button
        type="button"
        aria-label="JDBot assistant (coming soon)"
        title="JDBot — coming soon"
        className="animate-gold-pulse fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-[var(--shadow-luxe)] transition-transform duration-300 hover:-translate-y-1"
      >
        <Bot className="h-6 w-6" />
      </button>
    </>
  );
}
