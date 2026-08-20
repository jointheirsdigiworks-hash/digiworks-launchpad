import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeChoice = "dark" | "light" | "system";
type Resolved = "dark" | "light";

const STORAGE_KEY = "jhdw-theme";

type ThemeContextValue = {
  choice: ThemeChoice;
  theme: Resolved;
  setChoice: (choice: ThemeChoice) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): Resolved {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Resolved) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  defaultChoice = "dark",
}: {
  children: ReactNode;
  defaultChoice?: ThemeChoice;
}) {
  const [choice, setChoiceState] = useState<ThemeChoice>(defaultChoice);
  const [theme, setTheme] = useState<Resolved>(defaultChoice === "light" ? "light" : "dark");

  // Read the stored preference after hydration to avoid SSR mismatches.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
    const next: ThemeChoice = stored ?? defaultChoice;
    setChoiceState(next);
    const resolved = next === "system" ? systemTheme() : next;
    setTheme(resolved);
    applyTheme(resolved);
  }, [defaultChoice]);

  useEffect(() => {
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const resolved = systemTheme();
      setTheme(resolved);
      applyTheme(resolved);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    const resolved = next === "system" ? systemTheme() : next;
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const toggle = useCallback(() => {
    setChoice(theme === "dark" ? "light" : "dark");
  }, [setChoice, theme]);

  return (
    <ThemeContext.Provider value={{ choice, theme, setChoice, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
