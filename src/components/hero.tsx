"use client";

import { motion } from "framer-motion";
import { FadeUp } from "./motion";

export function Hero(): React.ReactElement {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-24">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <FadeUp>
          <p className="text-lg md:text-xl font-mono text-accent mb-3 tracking-wide">
            Ahtesham Ahmad
          </p>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Open to opportunities
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6">
            I build AI systems that
            <br className="hidden sm:block" />
            <span className="text-accent"> run businesses</span> on their own.
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            5+ years shipping production AI. Multi-agent architectures with
            human approval gates, full-stack products that hold up under real
            load, and the open-source tooling to build them right.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
            >
              See Case Studies
            </a>
            <a
              href="https://calendly.com/shami8024/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-medium rounded-lg hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-200"
            >
              Book a 15-min Call
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-card-border text-foreground rounded-lg hover:bg-card hover:border-muted/30 transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <p className="text-xs font-mono text-muted/60">
              Currently building:{" "}
              <span className="text-accent/80">Gogaa v0.9.2 — parallel panes live streaming</span>
            </p>
          </div>
        </FadeUp>

        {/* Architecture flow */}
        <FadeUp delay={0.5}>
          <div className="mt-16 p-4 rounded-xl bg-card/50 border border-card-border backdrop-blur-sm">
            <p className="text-xs font-mono text-muted mb-3 uppercase tracking-wider">
              How I architect every system
            </p>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-xs font-mono px-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                "Ingest",
                "Classify",
                "Orchestrate",
                "Review",
                "Execute",
                "Observe",
              ].map((step, i) => (
                <span key={step} className="flex items-center gap-1">
                  <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-md text-[10px] sm:text-xs whitespace-nowrap">
                    {step}
                  </span>
                  {i < 5 && (
                    <span className="text-muted/50">&rarr;</span>
                  )}
                </span>
              ))}
            </motion.div>
          </div>
        </FadeUp>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-muted/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-muted/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
