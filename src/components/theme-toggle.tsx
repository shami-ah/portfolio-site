"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

export function ThemeToggle(): React.ReactElement {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  function applyTheme(t: Theme): void {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(t);
  }

  function toggle(): void {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
    applyTheme(next);
  }

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="group relative inline-flex items-center justify-center w-10 h-10 rounded-full glass hover:border-accent/40 transition-all duration-200 shadow-lg cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun size={14} className="text-muted group-hover:text-accent transition-colors" />
      ) : (
        <Moon size={14} className="text-muted group-hover:text-accent transition-colors" />
      )}
    </button>
  );
}
