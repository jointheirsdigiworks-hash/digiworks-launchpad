import { useEffect, useRef } from "react";
import { useEffectSettings, useMotionAllowed } from "./useEffectSettings";

/** Thin champagne-gold progress bar pinned to the top of the viewport. */
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden>
      <div ref={ref} className="h-full origin-left scale-x-0 bg-gold shadow-[var(--shadow-gold)]" />
    </div>
  );
}

/** Soft gold orb that trails the cursor. Desktop pointers only. */
function CursorOrb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      node.style.opacity = "1";
    };
    const onLeave = () => {
      node.style.opacity = "0";
    };
    const loop = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      node.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
      frame = window.requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = window.requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[5] h-80 w-80 rounded-full opacity-0 mix-blend-screen transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--gold) 22%, transparent) 0%, transparent 68%)",
        filter: "blur(14px)",
      }}
    />
  );
}

/** Subtle pull toward the pointer on elements marked with data-magnetic. */
function MagneticButtons() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanups = nodes.map((node) => {
      const onMove = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        node.style.transform = `translate3d(${dx * 10}px, ${dy * 8}px, 0)`;
      };
      const onLeave = () => {
        node.style.transform = "";
      };
      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
        node.style.transform = "";
      };
    });
    return () => cleanups.forEach((fn) => fn());
  });

  return null;
}

/**
 * Mounts the premium interaction layer. Everything here is admin-toggleable,
 * skipped for `prefers-reduced-motion`, and skipped on touch-only devices.
 */
export function SiteEffects() {
  const settings = useEffectSettings();
  const motionAllowed = useMotionAllowed();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("smooth-scroll", Boolean(settings.smooth_scroll));
    root.classList.toggle("effects-hover-glow", Boolean(settings.hover_glow));
    return () => {
      root.classList.remove("smooth-scroll", "effects-hover-glow");
    };
  }, [settings.smooth_scroll, settings.hover_glow]);

  return (
    <>
      {settings.scroll_progress && <ScrollProgress />}
      {motionAllowed && settings.cursor_orb && <CursorOrb />}
      {motionAllowed && settings.magnetic_buttons && <MagneticButtons />}
    </>
  );
}
