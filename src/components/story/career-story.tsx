"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStatus } from "@/lib/use-status";
import { getCareerChapters } from "@/data/stories";
import { getFeaturedArticles } from "@/data/writing";
import { Eyebrow, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/*  Career told by results (plain lens). The git-log version stays in  */
/*  the technical lens.                                                */
/* ------------------------------------------------------------------ */

export function CareerStory(): React.ReactElement {
  const { status } = useStatus();
  const chapters = getCareerChapters(status.openevent);
  const articles = getFeaturedArticles().slice(0, 3);

  return (
    <section id="log" className="px-5 md:px-10 lg:pl-28 lg:pr-16 py-16 md:py-28 border-t border-card-border/60">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <Eyebrow className="mb-3">Experience</Eyebrow>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-[18ch] text-balance">
            Where I&apos;ve done it before.
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

        {articles.length > 0 && (
          <Reveal className="mt-10 md:mt-16" >
            <div id="writing" className="rounded-2xl border border-card-border bg-card/60 p-6 md:p-8">
              <Eyebrow className="mb-4">I also write about what I learn</Eyebrow>
              <ul className="divide-y divide-card-border/60">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/writing#${a.slug}`}
                      className="group flex items-center justify-between gap-4 py-3.5 text-sm md:text-lg text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <span>{a.title}</span>
                      <ArrowRight size={16} className="shrink-0 text-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
