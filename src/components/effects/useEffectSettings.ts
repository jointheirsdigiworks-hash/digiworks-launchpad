import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type EffectSettings = {
  cursor_orb: boolean;
  hero_particles: boolean;
  scroll_progress: boolean;
  smooth_scroll: boolean;
  reveal_animations: boolean;
  hover_glow: boolean;
  magnetic_buttons: boolean;
  parallax_hero: boolean;
};

const defaults: EffectSettings = {
  cursor_orb: true,
  hero_particles: true,
  scroll_progress: true,
  smooth_scroll: true,
  reveal_animations: true,
  hover_glow: true,
  magnetic_buttons: true,
  parallax_hero: true,
};

/** True when the visitor asked for reduced motion or is on a touch-only device. */
export function useMotionAllowed() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setAllowed(!reduced.matches && fine.matches);
    update();
    reduced.addEventListener("change", update);
    fine.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      fine.removeEventListener("change", update);
    };
  }, []);

  return allowed;
}

/** Admin-controlled special effects toggles (site_settings → `effects`). */
export function useEffectSettings(): EffectSettings {
  const { data } = useQuery({
    queryKey: ["site_settings", "effects"],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data: row } = await supabase.from("site_settings").select("value").eq("key", "effects").maybeSingle();
      return (row?.value ?? {}) as Partial<EffectSettings>;
    },
  });
  return { ...defaults, ...(data ?? {}) };
}
