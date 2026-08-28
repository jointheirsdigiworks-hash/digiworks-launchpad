import { useEffect, useRef, useState, type ReactNode } from "react";
import { useEffectSettings } from "./useEffectSettings";

/**
 * Scroll reveal wrapper — fade-up + subtle scale on first entry.
 * Falls back to fully visible content when reduced motion is requested.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const { reveal_animations: enabled } = useEffectSettings();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);



  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.985] opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
