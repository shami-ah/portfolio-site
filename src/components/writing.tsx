"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "./motion";
import { TypeLabel } from "./type-label";
import { getFeaturedArticles } from "@/data/writing";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export function Writing(): React.ReactElement {
  const featured = getFeaturedArticles();

  return (
    <section id="writing" className="py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <FadeUp>
          <TypeLabel
            text="$ cat ~/writing/*.md"
            className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Thinking in public
            <span className="text-muted">.</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-2xl mb-10 md:mb-14 leading-relaxed">
            Lessons from building AI systems, developer tools, and production
            software. Not theory. Things I learned by shipping.
          </p>
        </FadeUp>

        <div className="space-y-4">
          {featured.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/writing#${article.slug}`}
                className="group block card-glow card-gradient-border rounded-xl bg-card border border-card-border p-5 md:p-6 hover:border-transparent transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-caption bg-accent/5 text-accent/80 rounded border border-accent/20 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-accent transition-colors duration-200">
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-muted leading-relaxed mb-3">
                      {article.summary}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-caption font-mono text-muted/60">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-accent/5 text-accent/40 group-hover:text-accent group-hover:bg-accent/10 transition-all duration-200 shrink-0 mt-6">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <FadeUp delay={0.3}>
          <div className="mt-8 text-center">
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-card-border text-sm font-mono text-muted hover:text-accent hover:border-accent/30 transition-colors duration-200"
            >
              View all articles
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
