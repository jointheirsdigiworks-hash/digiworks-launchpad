import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={nextLabel}
      title={nextLabel}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-soft bg-surface/60 text-foreground transition-all duration-300 hover:border-gold hover:text-gold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`}
    >
      <Sun
        className={`h-[18px] w-[18px] transition-all duration-500 ${theme === "light" ? "scale-100 rotate-0 opacity-100" : "absolute scale-0 -rotate-90 opacity-0"}`}
      />
      <Moon
        className={`h-[18px] w-[18px] transition-all duration-500 ${theme === "dark" ? "scale-100 rotate-0 opacity-100" : "absolute scale-0 rotate-90 opacity-0"}`}
      />
    </button>
  );
}
