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
    { name: "portfolio", version: `${status.portfolio.projects}+ projects`, state: "online" },
  ];

  return (
    <div className="space-y-2">
      {services.map((s) => (
        <div key={s.name} className="flex items-center gap-2 text-[11px] font-mono">
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
          className="text-[11px] font-mono leading-relaxed"
        >
          <span className="text-accent-secondary/70">[{entry.time}]</span>{" "}
          <span className="text-muted/60">{entry.action}</span>{" "}
          <span className="text-foreground/70">{entry.target}</span>
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

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-card-border bg-card/50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm">
            <span className="text-accent">&gt;</span>{" "}
            <span className="text-foreground font-semibold">workspace</span>
            <span className="text-muted/50">.shami</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono text-muted/50">{time}</span>
          <a
            href="/"
            className="text-[11px] font-mono text-accent hover:text-accent/80 transition-colors"
          >
            &gt; back to command center
          </a>
        </div>
      </header>

      {/* Panel grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_1fr] grid-rows-[1fr_1fr] gap-px bg-card-border/30 overflow-hidden">

        {/* Terminal — top left, spans full height on desktop */}
        <div className="md:row-span-2 p-2">
          <WorkspaceTerminal />
        </div>

        {/* Neural Map — top right */}
        <div className="p-2 hidden md:block">
          <div className="h-full rounded-xl border border-card-border bg-card/30 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-card-border bg-card/50 shrink-0">
              <span className="text-[10px] font-mono text-muted/60">neural map — skills</span>
              <span className="text-[10px] font-mono text-muted/30">hover to explore</span>
            </div>
            <div className="flex-1 relative">
              <NeuralMap />
            </div>
          </div>
        </div>

        {/* Bottom right — split between activity feed and status */}
        <div className="p-2 hidden md:grid grid-cols-[1.2fr_0.8fr] gap-2">
          {/* Activity Feed */}
          <div className="rounded-xl border border-card-border bg-card/30 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-card-border bg-card/50 shrink-0">
              <span className="text-[10px] font-mono text-muted/60">activity feed</span>
            </div>
            <div className="flex-1 p-3 overflow-hidden">
              <ActivityFeed />
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-card-border bg-card/30 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-card-border bg-card/50 shrink-0">
              <span className="text-[10px] font-mono text-muted/60">system status</span>
            </div>
            <div className="flex-1 p-3">
              <StatusPanel />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
