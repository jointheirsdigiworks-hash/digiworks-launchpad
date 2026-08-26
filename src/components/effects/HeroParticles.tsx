import { useEffect, useRef } from "react";
import { useEffectSettings, useMotionAllowed } from "./useEffectSettings";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Lightweight canvas particle field for the hero. Reacts to pointer movement,
 * pauses off-screen, and is skipped for reduced motion / touch devices.
 */
export function HeroParticles({ className = "" }: { className?: string }) {
  const settings = useEffectSettings();
  const motionAllowed = useMotionAllowed();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = motionAllowed && settings.hero_particles;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;
    const pointer = { x: -999, y: -999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0.5) {
          p.vx -= (dx / dist) * 0.012;
          p.vy -= (dy / dist) * 0.012;
        }
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;

        ctx.beginPath();
        ctx.fillStyle = "rgba(212, 175, 55, 0.55)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = window.requestAnimationFrame(draw);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const observer = new IntersectionObserver((entries) => {
      const next = entries[0]?.isIntersecting ?? true;
      if (next === visible) return;
      visible = next;
      if (visible) frame = window.requestAnimationFrame(draw);
      else window.cancelAnimationFrame(frame);
    });

    resize();
    observer.observe(canvas);
    frame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
