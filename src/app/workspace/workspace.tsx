"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WorkspaceTerminal } from "@/components/workspace-terminal";
import { NeuralMap } from "@/components/neural-map";
import { useStatus } from "@/lib/use-status";
import { activityFeed } from "@/data/activity-feed";

function StatusPanel(): React.ReactElement {
  const { status } = useStatus();
  const services = [
    { name: "openevent", version: `${status.openevent.clients}+ clients`, state: status.openevent.status },
    { name: "gogaa-cli", version: `v${status.gogaa.version}`, state: status.gogaa.status },
    { name: "codelens", version: `v${status.codelens.version}`, state: status.codelens.status },
    { name: "portfolio", version: `${status.portfolio.productionSystems}+ systems`, state: "online" },
  ];

  return (
    <div className="space-y-2">
      {services.map((s) => (
        <div key={s.name} className="flex items-center gap-2 text-small font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${
            s.state === "live" || s.state === "online" ? "bg-accent-status" : "bg-accent-secondary"
          } animate-pulse`} />
          <span className="text-foreground/80">{s.name}</span>
          <span className="text-muted/40 ml-auto">{s.version}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityFeed(): React.ReactElement {
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((c) => Math.min(c + 1, activityFeed.length));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-1.5 overflow-y-auto max-h-full">
      {activityFeed.slice(0, visibleCount).map((entry, i) => (
        <motion.div
          key={`${entry.time}-${i}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-small font-mono leading-relaxed"
        >
          <span className="text-accent-secondary/70">[{entry.time}]</span>{" "}
          <span className="text-muted/60">{entry.action}</span>{" "}
          <span className="text-foreground/80">{entry.target}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function Workspace(): React.ReactElement {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = (): void => {
      setTime(new Date().toLocaleTimeString("en-US", {
        hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
      }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const [activeTab, setActiveTab] = useState<"terminal" | "neural-map">("terminal");

  const sidebarFiles = [
    { name: "terminal.sh", icon: "text-accent-status", active: activeTab === "terminal" },
    { name: "neural-map.tsx", icon: "text-accent-secondary", active: activeTab === "neural-map" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* IDE Title bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-card-border bg-card/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="font-mono text-xs text-muted/60 ml-2">
            workspace.shami
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-caption font-mono text-muted/40">{time}</span>
          <a
            href="/"
            className="text-caption font-mono text-accent/60 hover:text-accent transition-colors"
          >
            ← back
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* IDE Sidebar — file explorer */}
        <div className="w-[180px] border-r border-card-border bg-card/20 shrink-0 hidden md:flex flex-col">
          <div className="px-3 py-2 border-b border-card-border/40">
            <span className="text-caption font-mono text-muted/40 uppercase tracking-widest">Explorer</span>
          </div>
          <div className="px-1 py-1">
            <div className="flex items-center gap-1.5 px-2 py-1 text-small font-mono text-muted/60">
              <span className="text-accent/40 text-caption">&#9662;</span> workspace/
            </div>
            {sidebarFiles.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setActiveTab(f.name === "terminal.sh" ? "terminal" : "neural-map")}
                className={`w-full flex items-center gap-1.5 px-2 py-1 pl-5 text-small font-mono rounded transition-all text-left ${
                  f.active
                    ? "bg-accent/10 text-accent border-r-2 border-accent"
                    : "text-muted/60 hover:bg-card-hover hover:text-muted/80"
                }`}
              >
                <span className={`text-caption ${f.icon}`}>&#9670;</span>
                {f.name}
              </button>
            ))}
            <div className="flex items-center gap-1.5 px-2 py-1 text-small font-mono text-muted/40">
              <span className="text-accent/20 text-caption">&#9656;</span> .config/
            </div>
          </div>

          {/* Sidebar bottom — status */}
          <div className="mt-auto border-t border-card-border/40 p-3">
            <div className="text-caption font-mono text-muted/40 uppercase tracking-widest mb-2">Status</div>
            <StatusPanel />
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-card-border bg-card/20 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("terminal")}
              className={`flex items-center gap-1.5 px-4 py-2 text-small font-mono border-r border-card-border/40 transition-colors ${
                activeTab === "terminal"
                  ? "bg-background text-foreground/80 border-b-2 border-b-accent -mb-px"
                  : "text-muted/40 hover:text-muted/60"
              }`}
            >
              <span className="text-accent-status text-caption">&#9670;</span>
              terminal.sh
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("neural-map")}
              className={`flex items-center gap-1.5 px-4 py-2 text-small font-mono border-r border-card-border/40 transition-colors ${
                activeTab === "neural-map"
                  ? "bg-background text-foreground/80 border-b-2 border-b-accent -mb-px"
                  : "text-muted/40 hover:text-muted/60"
              }`}
            >
              <span className="text-accent-secondary text-caption">&#9670;</span>
              neural-map.tsx
            </button>
          </div>

          {/* Editor content — panels */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "terminal" ? (
              <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-px bg-card-border/20">
                <div className="p-2">
                  <WorkspaceTerminal />
                </div>
                <div className="p-2 hidden md:flex flex-col gap-2">
                  <div className="flex-1 rounded-lg border border-card-border bg-card/20 overflow-hidden flex flex-col">
                    <div className="px-3 py-2 border-b border-card-border/40 bg-card/40 shrink-0">
                      <span className="text-caption font-mono text-muted/40">activity feed</span>
                    </div>
                    <div className="flex-1 p-3 overflow-hidden">
                      <ActivityFeed />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-card-border/20 bg-card/20 shrink-0">
                  <span className="text-caption font-mono text-muted/60">neural map: hover nodes to explore connections</span>
                </div>
                <div className="flex-1 relative">
                  <NeuralMap />
                </div>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-3 py-1 border-t border-card-border bg-card/40 shrink-0 text-caption font-mono text-muted/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent-status" />
                main
              </span>
              <span>UTF-8</span>
              <span>{activeTab === "terminal" ? "Shell" : "TypeScript React"}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>workspace v1.0</span>
              <span>Ln 1, Col 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
