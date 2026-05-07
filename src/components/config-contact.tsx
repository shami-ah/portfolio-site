"use client";

import { FadeUp } from "./motion";
import { TypeLabel } from "./type-label";

const contactLinks = [
  { key: "email", label: "shami8024@gmail.com", href: "mailto:shami8024@gmail.com" },
  { key: "github", label: "shami-ah", href: "https://github.com/shami-ah" },
  { key: "linkedin", label: "ahtesham-ahmad", href: "https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5" },
  { key: "upwork", label: "100% job success", href: "https://www.upwork.com/freelancers/~01bd0ab6e093ea2d49" },
  { key: "resume", label: "/cv", href: "/cv" },
] as const;

export function ConfigContact(): React.ReactElement {
  return (
    <section id="contact" className="relative overflow-hidden py-20 md:py-32 bg-card/30">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5 md:px-6">
        <FadeUp>
          <TypeLabel
            text="$ cat contact.yaml"
            className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Let&apos;s build something
            <span className="text-accent"> real.</span>
          </h2>
        </FadeUp>

        {/* Single testimonial as social proof line */}
        <FadeUp delay={0.08}>
          <div className="mb-10 md:mb-14">
            <p className="text-sm md:text-base text-muted italic leading-relaxed max-w-2xl">
              &ldquo;The AI layer Ahtesham built saves our team 90 minutes a day.
              No engineer we interviewed designed the human-in-the-loop gate the way he did.&rdquo;
            </p>
            <p className="text-small text-muted/50 font-mono mt-2">
              River Soellner, Founder, More Life Hospitality GmbH
            </p>
          </div>
        </FadeUp>

        {/* CTA card */}
        <FadeUp delay={0.15}>
          <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-card via-card to-accent/[0.03] p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-status/10 border border-accent-status/20 text-accent-status text-caption md:text-xs font-mono mb-4">
                  <span className="w-1.5 h-1.5 bg-accent-status rounded-full animate-pulse" />
                  Available for full-time &amp; contract
                </div>
                <p className="text-base md:text-lg text-foreground font-medium mb-2">
                  I architect the pipeline, build the product around it, and ship to production.
                </p>
                <p className="text-sm text-muted mb-5">
                  One engineer, full ownership, from data model to deployed SaaS.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-small font-mono text-muted/60">
                  {contactLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="hover:text-accent transition-colors"
                    >
                      {link.key}: <span className="text-accent-secondary/70">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="https://ahtesham.dev.wadwarehouse.com/book"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-accent text-background font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-accent/25 transition-all duration-200 text-sm whitespace-nowrap shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a 15-min call
              </a>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
