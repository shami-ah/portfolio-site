"use client";

import { FileText, Network } from "lucide-react";
import { NeuralMap } from "@/components/neural-map";
import { openCvDrawer } from "@/components/cv-drawer";

/* ------------------------------------------------------------------ */
/*  SkillsRoom                                                         */
/* ------------------------------------------------------------------ */

export function SkillsRoom(): React.ReactElement {
  return (
    <div className="grid h-full min-h-full gap-2 md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">
            neural map
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
            Skills + CV
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("show-skills-modal"))
            }
            className="flex items-center gap-2 rounded-xl border border-card-border bg-card/45 px-4 py-2.5 font-mono text-caption text-muted transition hover:text-foreground"
          >
            <Network size={13} />
            expand
          </button>
          <button
            type="button"
            onClick={() => openCvDrawer()}
            data-cv-open
            className="flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-4 py-2.5 font-mono text-caption text-accent transition hover:border-accent/45"
          >
            <FileText size={13} />
            open CV
          </button>
        </div>
      </div>

      <div className="relative min-h-0 overflow-hidden rounded-2xl border border-card-border bg-card/35 backdrop-blur-md">
        <NeuralMap />
      </div>
    </div>
  );
}
