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

  if (!mounted) return <div className="w-[38px] h-[38px]" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="group flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-300"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)" }}
    >
      {theme === "dark" ? (
        <Sun size={14} className="text-muted/60 group-hover:text-amber-400 shrink-0 transition-colors" />
      ) : (
        <Moon size={14} className="text-muted/60 group-hover:text-blue-400 shrink-0 transition-colors" />
      )}
      <span className="max-w-0 overflow-hidden group-hover:max-w-[50px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
        {theme === "dark" ? "light" : "dark"}
      </span>
    </button>
  );
}
