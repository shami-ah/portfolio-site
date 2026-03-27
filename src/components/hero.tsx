"use client";

import { motion } from "framer-motion";
import { FadeUp } from "./motion";

export function Hero(): React.ReactElement {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-mono mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Available for work
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            I architect AI systems
            <br />
            <span className="text-accent">that run businesses</span>
            <br />
            autonomously.
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Full-stack AI engineer & automation architect. 250+ delivered
            projects, production SaaS serving real users, and open-source
            developer tools. End-to-end: architecture to deployment, zero
            handoffs.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-card-border text-foreground rounded-lg hover:bg-card hover:border-muted/30 transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </FadeUp>

        {/* Architecture flow */}
        <FadeUp delay={0.5}>
          <div className="mt-16 p-4 rounded-xl bg-card/50 border border-card-border backdrop-blur-sm">
            <p className="text-xs font-mono text-muted mb-2 uppercase tracking-wider">
              My Architecture Pattern
            </p>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                "Input Sources",
                "AI Classification",
                "Agent Orchestrator",
                "Human Review",
                "Execution",
                "Observability",
              ].map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-md">
                    {step}
                  </span>
                  {i < 5 && <span className="text-muted hidden sm:inline">&rarr;</span>}
                </span>
              ))}
            </motion.div>
          </div>
        </FadeUp>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
