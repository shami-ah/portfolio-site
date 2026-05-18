"use client";

import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

export function ThemeToggle(): React.ReactElement {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((t: Theme): void => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(t);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
        applyTheme(stored);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [applyTheme]);

  function toggle(): void {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
    applyTheme(next);
  }

  if (!mounted) return <div className="w-11 h-11 rounded-full" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="group flex items-center cursor-pointer glass rounded-full p-[5px] hover:pr-4 hover:gap-2 transition-all duration-300"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12), 0 0 4px rgba(0,0,0,0.06)" }}
    >
      <span className="flex items-center justify-center w-[34px] h-[34px] rounded-full shrink-0">
        {theme === "dark" ? (
          <Sun size={18} className="text-muted/60 group-hover:text-accent transition-colors" />
        ) : (
          <Moon size={18} className="text-muted/60 group-hover:text-blue-400 transition-colors" />
        )}
      </span>
      <span className="max-w-0 overflow-hidden group-hover:max-w-[50px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
        {theme === "dark" ? "light" : "dark"}
      </span>
    </button>
  );
}
