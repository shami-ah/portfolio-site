"use client";

import { useStatus } from "@/lib/use-status";
import { getCareerChapters } from "@/data/stories";

import { Eyebrow, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/*  Career told by results (plain lens). The git-log version stays in  */
/*  the technical lens.                                                */
/* ------------------------------------------------------------------ */

export function CareerStory(): React.ReactElement {
  const { status } = useStatus();
  const chapters = getCareerChapters(status.openevent);
  

  return (
    <section id="log" className="px-5 md:px-10 lg:px-28 py-10 md:py-16 border-t border-card-border/60">
      <div className="max-w-[1200px] mx-auto">
        <Reveal className="text-center">
          <Eyebrow className="mb-3">Experience</Eyebrow>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-[18ch] mx-auto text-balance">
            Where I&apos;ve
            <span className="block text-gradient">done it before.</span>
          </h2>
        </Reveal>

        <ol className="mt-10 md:mt-16">
          {chapters.map((c, i) => (
            <Reveal key={c.company} delay={Math.min(i * 0.05, 0.15)}>
              <li id={i === 0 ? "experience" : undefined} className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-2 md:gap-10 py-8 md:py-12 border-t border-card-border/60">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{c.period}</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{c.title}</p>
                  <p className="text-sm text-foreground/60">{c.company}</p>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-5xl leading-[1.1] tracking-tight text-balance">
                    {c.headline}
                  </h3>
                  <ul className="mt-4 md:mt-6 space-y-2 max-w-2xl">
                    {c.points.map((point) => (
                      <li key={point} className="text-sm md:text-lg text-foreground/70 leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

    
      </div>
    </section>
  );
}
