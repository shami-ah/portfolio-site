"use client";

import { FadeUp } from "./motion";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  platform?: "upwork" | "linkedin" | "direct";
}

// Paste real quotes here — pull from Upwork reviews or ask clients directly.
// Leave this array empty and the section won't render.
const testimonials: Testimonial[] = [
  // {
  //   quote: "Paste the exact Upwork review text here.",
  //   name: "Client Name",
  //   role: "Role / Company Type",
  //   company: "Company Name",
  //   platform: "upwork",
  // },
];

const platformLabel: Record<string, string> = {
  upwork: "via Upwork",
  linkedin: "via LinkedIn",
  direct: "",
};

export function Testimonials(): React.ReactElement | null {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            What clients say
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            In their own words.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.08}>
              <div className="h-full p-6 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-all duration-300 flex flex-col">
                <p className="text-3xl text-accent/30 font-serif leading-none mb-3 select-none">
                  &ldquo;
                </p>
                <p className="text-sm text-muted leading-relaxed flex-1 mb-6">
                  {t.quote}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-card-border">
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </p>
                  </div>
                  {t.platform && t.platform !== "direct" && (
                    <span className="text-[10px] font-mono text-muted/50 border border-card-border rounded px-2 py-0.5">
                      {platformLabel[t.platform]}
                    </span>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
