"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "./motion";
import { TypeLabel } from "./type-label";
import { getFeaturedArticles } from "@/data/writing";
import { ArrowRight, Clock } from "lucide-react";

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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-14 leading-tight">
            Thinking in public
            <span className="text-muted">.</span>
          </h2>
        </FadeUp>

        {/* Compact 3-column grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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

                className="group flex flex-col h-full card-glow card-gradient-border rounded-xl bg-card border border-card-border p-4 md:p-5 hover:border-transparent transition-colors duration-300"
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-caption bg-accent/5 text-accent/80 rounded border border-accent/20 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-base font-bold mb-auto leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-3">
                  {article.title}
                </h3>

                {/* Meta footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border/30">
                  <span className="flex items-center gap-1 text-caption font-mono text-muted/50">
                    <Clock size={10} />
                    {article.readTime}
                  </span>
                  <ArrowRight size={13} className="text-muted/30 group-hover:text-accent transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <FadeUp delay={0.3}>
          <div className="mt-6 text-center">
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
