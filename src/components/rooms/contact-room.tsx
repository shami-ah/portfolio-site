"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronUp, Mail, Radio, Zap } from "lucide-react";
import { AgentEmoji } from "@/components/agent-visuals";

/* ------------------------------------------------------------------ */
/*  ContactRoom                                                        */
/* ------------------------------------------------------------------ */

export function ContactRoom({
  onGoTop,
}: {
  onGoTop: () => void;
}): React.ReactElement {
  const [launched, setLaunched] = useState(false);
  const steps = launched
    ? ["reviewed", "vetted", "matched", "launched"]
    : ["reviewed", "vetted", "matched", "deploy"];

  return (
    <div className="grid h-full min-h-full place-items-center">
      <div className="w-full max-w-5xl text-center">
        <button
          type="button"
          onClick={() => setLaunched(true)}
          className="mx-auto grid place-items-center text-center"
          aria-label="Launch contact options"
        >
          <motion.span
            animate={
              launched
                ? { y: [-8, -28, -8], scale: [1, 1.12, 1] }
                : { y: [-5, 5, -5] }
            }
            transition={{
              duration: launched ? 1.1 : 2.6,
              repeat: launched ? 2 : Infinity,
              ease: "easeInOut",
            }}
            className="grid h-28 w-28 place-items-center rounded-full border border-green-400/25 bg-green-400/[0.045] shadow-[0_0_60px_rgba(74,222,128,0.16)]"
          >
            <AgentEmoji size={78} mood={launched ? "waving" : "default"} />
          </motion.span>
          <span className="mt-3 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 font-mono text-caption text-accent">
            {launched ? "launched" : "press me"}
          </span>
        </button>

        <p className="mt-5 font-mono text-caption uppercase tracking-[0.24em] text-green-300">
          deploy pipeline
        </p>
        <h2 className="mt-5 text-5xl font-bold md:text-7xl">Deploy me.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          one engineer, full ownership, zero handoffs
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-card-border bg-card/45 p-5 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-3 font-mono text-caption md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`rounded-xl border p-4 ${
                  index < 3 || launched
                    ? "border-green-400/25 bg-green-400/10 text-green-300"
                    : "border-accent/30 bg-accent/10 text-accent"
                }`}
              >
                {index < 3 || launched ? (
                  <Check className="mx-auto mb-2" size={16} />
                ) : (
                  <Zap className="mx-auto mb-2" size={16} />
                )}
                {step}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["Email", "Schedule", "GitHub", "Resume"].map((item) => (
              <button
                key={item}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-5 py-3 font-mono text-small text-accent"
              >
                {item === "Email" ? <Mail size={15} /> : <Radio size={15} />}
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onGoTop}
          className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-card-border bg-card/45 px-5 py-3 font-mono text-caption text-muted transition hover:text-foreground"
        >
          <ChevronUp size={14} />
          back to top
        </button>
      </div>
    </div>
  );
}
