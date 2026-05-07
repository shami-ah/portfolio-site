"use client";

import { motion } from "framer-motion";

const clients = [
  "More Life Hospitality",
  "Rouelite Techno",
  "Outlier AI",
  "RWS Group",
  "40+ global clients",
];

export function TrustedBy(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-8 md:py-10"
    >
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-caption font-mono text-muted/40 uppercase tracking-widest shrink-0">
            Built for
          </span>
          {clients.map((name, i) => (
            <span key={name} className="flex items-center gap-3">
              {i > 0 && (
                <span className="text-muted/15 hidden sm:inline">·</span>
              )}
              <span className="text-xs md:text-sm text-muted/50 font-medium whitespace-nowrap">
                {name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
