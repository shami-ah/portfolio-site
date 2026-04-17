"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Projects" | "Contact" | "Resources";
  action: () => void;
  icon?: React.ReactElement;
}

function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandPalette(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(
    () => [
      {
        id: "nav-about",
        label: "Go to About",
        hint: "Builder mindset, stats, dev workflow",
        group: "Navigate",
        action: () => scrollToId("about"),
      },
      {
        id: "nav-experience",
        label: "Go to Experience",
        hint: "Roles, companies, impact",
        group: "Navigate",
        action: () => scrollToId("experience"),
      },
      {
        id: "nav-projects",
        label: "Go to Projects",
        hint: "9 case studies",
        group: "Navigate",
        action: () => scrollToId("projects"),
      },
      {
        id: "nav-contact",
        label: "Go to Contact",
        hint: "Book a call, email, socials",
        group: "Navigate",
        action: () => scrollToId("contact"),
      },
      ...projects.map<Command>((p) => ({
        id: `p-${p.slug}`,
        label: `Open project: ${p.title}`,
        hint: p.subtitle,
        group: "Projects",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("open-project", { detail: p.slug }),
          );
        },
      })),
      {
        id: "book",
        label: "Book a 15-min intro call",
        hint: "Calendly · Google Meet",
        group: "Contact",
        action: () =>
          window.open(
            "https://calendly.com/shami8024/30min",
            "_blank",
            "noopener,noreferrer",
          ),
      },
      {
        id: "email",
        label: "Email me",
        hint: "shami8024@gmail.com",
        group: "Contact",
        action: () => {
          window.location.href = "mailto:shami8024@gmail.com";
        },
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Contact",
        action: () =>
          window.open(
            "https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5",
            "_blank",
            "noopener,noreferrer",
          ),
      },
      {
        id: "github",
        label: "Open GitHub profile",
        hint: "shami-ah",
        group: "Contact",
        action: () =>
          window.open("https://github.com/shami-ah", "_blank", "noopener,noreferrer"),
      },
      {
        id: "chat",
        label: "Chat with my AI CV",
        hint: "Ask anything · scoped to my work",
        group: "Resources",
        action: () => {
          window.location.href = "/chat";
        },
      },
      {
        id: "journey",
        label: "Walk through my career visually",
        hint: "Timeline · day in the life · parallel systems",
        group: "Resources",
        action: () => {
          window.location.href = "/journey";
        },
      },
      {
        id: "faq",
        label: "Jump to FAQ",
        hint: "Rates · timezone · how I work",
        group: "Navigate",
        action: () => scrollToId("faq"),
      },
      {
        id: "shortcuts",
        label: "Show keyboard shortcuts",
        hint: "Press ? anywhere",
        group: "Resources",
        action: () => {
          // Simulate pressing "?"
          const event = new KeyboardEvent("keydown", { key: "?" });
          window.dispatchEvent(event);
        },
      },
      {
        id: "cv",
        label: "View CV / Resume",
        hint: "Interactive + printable",
        group: "Resources",
        action: () => {
          window.location.href = "/cv";
        },
      },
      {
        id: "download",
        label: "Download CV as PDF",
        hint: "Fires print dialog on /cv",
        group: "Resources",
        action: () => {
          window.location.href = "/cv?print=1";
        },
      },
      {
        id: "replay",
        label: "Replay intro sequence",
        hint: "Re-run the boot animation",
        group: "Resources",
        action: () => {
          window.dispatchEvent(new CustomEvent("replay-intro"));
        },
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => {
      const hay = `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase();
      return hay.includes(q);
    });
  }, [commands, query]);

  const groups = useMemo(() => {
    const g: Record<string, Command[]> = {};
    for (const c of filtered) {
      if (!g[c.group]) g[c.group] = [];
      g[c.group].push(c);
    }
    return g;
  }, [filtered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (modKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !open) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[activeIdx]) {
        e.preventDefault();
        filtered[activeIdx].action();
        setOpen(false);
        setQuery("");
        setActiveIdx(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setActiveIdx(0);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  let flatIdx = -1;

  return (
    <>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[150] flex items-start justify-center pt-[12vh] md:pt-[18vh] px-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl bg-card border border-card-border rounded-xl shadow-2xl shadow-accent/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 border-b border-card-border">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/70 shrink-0">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Jump to section, project, contact…"
                  className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder:text-muted/40"
                />
                <kbd className="hidden sm:inline text-[10px] font-mono text-muted/50 border border-card-border px-1.5 py-0.5 rounded">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {Object.keys(groups).length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-muted/60">
                    No matches for &ldquo;{query}&rdquo;
                  </div>
                )}
                {Object.entries(groups).map(([groupName, items]) => (
                  <div key={groupName} className="py-1">
                    <p className="px-4 md:px-5 text-[10px] font-mono uppercase tracking-wider text-muted/40 mb-1">
                      {groupName}
                    </p>
                    {items.map((cmd) => {
                      flatIdx += 1;
                      const isActive = flatIdx === activeIdx;
                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          onMouseEnter={() => setActiveIdx(flatIdx)}
                          onClick={() => {
                            cmd.action();
                            setOpen(false);
                          }}
                          className={`w-full text-left px-4 md:px-5 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                            isActive ? "bg-accent/10" : "hover:bg-card-hover"
                          }`}
                        >
                          <div className="min-w-0">
                            <p className={`text-sm truncate ${isActive ? "text-accent" : "text-foreground"}`}>
                              {cmd.label}
                            </p>
                            {cmd.hint && (
                              <p className="text-[11px] text-muted/60 truncate">
                                {cmd.hint}
                              </p>
                            )}
                          </div>
                          {isActive && (
                            <span className="text-[10px] font-mono text-accent/70 shrink-0">
                              ↵
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer hints */}
              <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-2.5 border-t border-card-border text-[10px] font-mono text-muted/50">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 border border-card-border rounded bg-background/50">↑↓</kbd>
                    navigate
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 border border-card-border rounded bg-background/50">↵</kbd>
                    select
                  </span>
                </div>
                <span className="hidden sm:inline">
                  {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
