"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FadeUp } from "@/components/motion";
import { TypeLabel } from "@/components/type-label";
import { articles } from "@/data/writing";
import { Calendar, Clock, Hash } from "lucide-react";

export function WritingPage(): React.ReactElement {
  // Scroll to hash anchor instantly on mount — suppress visible scroll
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      // "View all" — start at top
      window.scrollTo(0, 0);
      return;
    }
    // Disable smooth scroll temporarily, jump to anchor, re-enable
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    const tryScroll = (): void => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ block: "start" });
        // Re-enable after jump
        requestAnimationFrame(() => { html.style.scrollBehavior = ""; });
      }
    };
    // Try immediately, then again after render
    tryScroll();
    const timer = setTimeout(tryScroll, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Sticky nav */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between">
          <p className="text-caption md:text-xs font-mono text-muted/80 text-center truncate hidden sm:block">
            <span className="text-accent">writing</span> · thinking in public
          </p>
          <Link
            href="/"
            className="text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            ← back to portfolio
          </Link>
        </div>
      </header>

      {/* Header */}
      <div className="border-b border-card-border/40 bg-card/20 pt-16">
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-8 md:py-12">
          <TypeLabel
            text="$ ls ~/writing/"
            className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Thinking in public<span className="text-muted">.</span>
          </h1>
          <p className="text-sm md:text-base text-muted max-w-2xl leading-relaxed">
            Lessons from building AI systems, developer tools, and production
            software. Not theory. Things I learned by shipping.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
        <div className="space-y-20 md:space-y-28">
          {articles.map((article, i) => (
            <article
              key={article.slug}
              id={article.slug}
              className="scroll-mt-20"
            >
              {/* Article header */}
              <div className="mb-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-caption bg-accent/5 text-accent/80 rounded border border-accent/20 font-mono"
                    >
                      <Hash size={9} />
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  {article.title}
                </h2>

                {/* Meta + read link */}
                <div className="flex items-center gap-4 text-small font-mono text-muted/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {article.readTime}
                  </span>
                  <a
                    href={`#${article.slug}`}
                    className="ml-auto flex items-center gap-1.5 text-accent/70 hover:text-accent transition-colors"
                  >
                    read <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Article body */}
              <div className="space-y-5">
                {article.body.map((section, si) => (
                  <div key={si}>
                    {section.heading && (
                      <h3 className="text-base md:text-lg font-bold mb-3 text-accent-secondary">
                        {section.heading}
                      </h3>
                    )}
                    {section.paragraphs.map((p, pi) => (
                      <p
                        key={pi}
                        className="text-sm md:text-base text-foreground/80 leading-relaxed mb-4 last:mb-0"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Divider between articles */}
              {i < articles.length - 1 && (
                <div className="mt-16 md:mt-20">
                  <div className="h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Footer */}
        <FadeUp delay={0.2}>
          <div className="mt-20 pt-8 border-t border-card-border/40 text-center">
            <p className="text-small font-mono text-muted/40">
              More articles shipping soon. Building in public means writing in
              public.
            </p>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
