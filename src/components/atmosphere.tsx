"use client";

import { motion } from "framer-motion";

export const flagshipColors: Record<string, string> = {
  openevent: "from-rose-500/20 via-red-300/10 to-green-400/10",
  codelens: "from-amber-400/18 via-sky-300/10 to-green-400/10",
  "gogaa-cli": "from-green-400/18 via-cyan-300/10 to-violet-400/10",
  rasad: "from-violet-400/20 via-fuchsia-300/10 to-green-400/10",
};

export function Atmosphere({
  room,
  projectSlug,
}: {
  room: string;
  projectSlug?: string;
}): React.ReactElement {
  const color =
    room === "projects" && projectSlug
      ? flagshipColors[projectSlug] ?? "from-accent/[0.08] via-transparent to-green-400/[0.045]"
      : "from-accent/[0.08] via-transparent to-green-400/[0.045]";

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <motion.div
        key={`${room}-${projectSlug}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`absolute inset-0 bg-gradient-to-br ${color}`}
      />
      <motion.div
        className="absolute left-1/2 top-[-20rem] h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-accent/[0.055] blur-3xl"
        animate={{ x: [-30, 30, -30], scale: [0.94, 1.05, 0.94] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
