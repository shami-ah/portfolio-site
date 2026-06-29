"use client";

import { Bot, BriefcaseBusiness, GitCommit, Network, Send } from "lucide-react";

export type Room = "home" | "projects" | "experience" | "toolbelt" | "contact";

const roomNav: {
  id: Room;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}[] = [
  { id: "home", label: "Home", icon: Bot },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "experience", label: "Experience", icon: GitCommit },
  { id: "toolbelt", label: "Skills CV Chat", icon: Network },
  { id: "contact", label: "Contact", icon: Send },
];

export function SignalRail({
  room,
  setRoom,
}: {
  room: Room;
  setRoom: (room: Room) => void;
}): React.ReactElement {
  const nodes = roomNav.map((item, index) => ({
    ...item,
    x: index % 2 === 0 ? 2 : 16,
    y: index * 70,
  }));
  const activeIndex = nodes.findIndex((item) => item.id === room);

  return (
    <nav
      aria-label="Pipeline navigation"
      className="absolute left-3 top-1/2 z-50 hidden -translate-y-1/2 font-mono md:block"
      style={{ width: 56, height: 320 }}
    >
      <svg className="absolute inset-0 pointer-events-none overflow-visible" viewBox="0 0 56 320" fill="none">
        {nodes.slice(0, -1).map((item, index) => {
          const next = nodes[index + 1];
          const path = `M ${item.x + 19} ${item.y + 19} Q 32 ${(item.y + next.y) / 2 + 19} ${next.x + 19} ${next.y + 19}`;
          const done = index < activeIndex;
          return (
            <path
              key={item.id}
              d={path}
              stroke={done ? "rgba(74,222,128,0.55)" : "var(--wire-stroke)"}
              strokeWidth={done ? 1.5 : 1}
              strokeDasharray={done ? undefined : "6 4"}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {nodes.map((item, index) => {
        const Icon = item.icon;
        const active = room === item.id;
        const done = index < activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setRoom(item.id)}
            aria-label={item.label}
            className="group absolute flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: item.x,
              top: item.y,
              width: active ? 46 : 38,
              height: active ? 46 : 38,
              marginLeft: active ? -4 : 0,
              marginTop: active ? -4 : 0,
              borderRadius: 14,
              background: active ? "var(--accent-glow)" : "transparent",
              boxShadow: active ? "0 4px 24px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
              border: active
                ? "1px solid color-mix(in srgb, var(--accent) 20%, transparent)"
                : "1px solid transparent",
            }}
          >
            {active && (
              <span className="absolute inset-0 rounded-[14px] border border-accent/30 animate-[pulse-expand_2.5s_ease-out_infinite]" />
            )}
            <Icon
              size={active ? 20 : 15}
              strokeWidth={active ? 2 : 1.5}
              className={
                active
                  ? "text-accent drop-shadow-[0_0_6px_rgba(160,120,104,0.5)]"
                  : done
                    ? "text-accent-status/70"
                    : "text-muted/25 group-hover:text-muted/50"
              }
            />
            <span className="absolute left-full ml-3 rounded-lg border border-card-border/50 bg-card/90 px-2.5 py-1 text-[10px] text-foreground/80 opacity-0 shadow-lg backdrop-blur-xl transition-all duration-200 group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        );
      })}
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </nav>
  );
}
