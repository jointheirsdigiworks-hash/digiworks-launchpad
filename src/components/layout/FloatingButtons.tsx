import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";

/** WhatsApp quick-contact button, stacked bottom-right beneath the JDBot launcher. */
export function FloatingButtons() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[oklch(0.968_0.005_247)] shadow-[var(--shadow-luxe)] ring-1 ring-gold-soft transition-transform duration-300 hover:-translate-y-1"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
