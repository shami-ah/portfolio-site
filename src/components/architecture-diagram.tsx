"use client";

import { useEffect, useRef, useState } from "react";
import { FadeUp } from "./motion";

interface ArchitectureDiagramProps {
  chart: string;
  title?: string;
}

export function ArchitectureDiagram({
  chart,
  title = "System Architecture",
}: ArchitectureDiagramProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function render(): Promise<void> {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#1e3a5f",
          primaryTextColor: "#93c5fd",
          primaryBorderColor: "#3b82f6",
          lineColor: "#3b82f680",
          secondaryColor: "#18181b",
          tertiaryColor: "#27272a",
          fontFamily: "ui-monospace, monospace",
          fontSize: "12px",
          nodeBorder: "#3b82f640",
          mainBkg: "#1e293b",
          clusterBkg: "#0f172a",
          clusterBorder: "#3b82f630",
          edgeLabelBackground: "#09090b",
          nodeTextColor: "#e2e8f0",
        },
        flowchart: {
          htmlLabels: true,
          curve: "basis",
          padding: 12,
          nodeSpacing: 30,
          rankSpacing: 40,
        },
      });

      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      try {
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch {
        // Mermaid render failed silently
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <FadeUp>
      <div className="my-8">
        <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">
          {title}
        </p>
        <div
          ref={containerRef}
          className="p-6 rounded-xl bg-[#0c0c0f] border border-card-border overflow-x-auto"
        >
          {svg ? (
            <div
              className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-muted/40">
              Loading diagram...
            </div>
          )}
        </div>
      </div>
    </FadeUp>
  );
}
