"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "./motion";
import { TiltCard } from "./tilt-card";
import { TypeLabel } from "./type-label";
import { Calendar, Star } from "lucide-react";
import { openCvDrawer } from "@/components/cv-drawer";

const contactLinks = [
  { key: "email", label: "shami8024@gmail.com", href: "mailto:shami8024@gmail.com" },
  { key: "github", label: "shami-ah", href: "https://github.com/shami-ah" },
  { key: "linkedin", label: "ahtesham-ahmad", href: "https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5" },
  { key: "upwork", label: "100% job success", href: "https://www.upwork.com/freelancers/~01bd0ab6e093ea2d49" },
  { key: "resume", label: "/cv", href: "#cv" },
] as const;

const testimonials = [
  {
    quote: "The AI layer Ahtesham built saves our team 90 minutes a day. No engineer we interviewed designed the human-in-the-loop gate the way he did.",
    name: "River Soellner",
    title: "Founder, More Life Hospitality GmbH",
    flag: "DE",
  },
  {
    quote: "A technical and competent engineer who knows how to deal with specific and in-depth topics. He's well-placed to monitor your teams and your projects.",
    name: "Mouad",
    title: "Client, France",
    flag: "FR",
  },
  {
    quote: "Some aspects of the project were difficult to communicate, but he was very patient and understanding. Very speedy and professional.",
    name: "Chloe",
    title: "Client, United States",
    flag: "US",
  },
  {
    quote: "Delivered exactly what we needed with precision and expertise. The custom AI prompts helped create a powerful project management tool.",
    name: "Joseph",
    title: "Client, United Kingdom",
    flag: "GB",
  },
] as const;

function TestimonialCarousel(): React.ReactElement {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[idx];

  return (
    <div className="mb-10 md:mb-14">
      <div className="relative h-[120px] sm:h-[100px] md:h-[90px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <p className="text-sm md:text-base text-muted italic leading-relaxed max-w-2xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-small text-muted/60 font-mono">
                {t.name}, {t.title}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Dots + rating */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? "bg-accent w-4" : "bg-muted/20 hover:bg-muted/40"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-caption text-muted/40 font-mono">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={10} className={s <= 4 ? "fill-accent/60 text-accent/60" : "fill-accent/30 text-accent/30"} />
            ))}
          </div>
          <span>4.6 / 5</span>
          <span className="text-muted/20 mx-1">·</span>
          <span>19 reviews</span>
        </div>
      </div>
    </div>
  );
}

export function ConfigContact(): React.ReactElement {
  return (
    <section id="contact" className="relative py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
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

        {/* Rotating testimonials */}
        <FadeUp delay={0.08}>
          <TestimonialCarousel />
        </FadeUp>

        {/* CTA card */}
        <FadeUp delay={0.15}>
          <TiltCard className="rounded-xl border border-accent/20 bg-gradient-to-br from-card via-card to-accent/[0.03] p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-status/10 border border-accent-status/20 text-accent-status text-caption md:text-xs font-mono mb-4">
                  <span className="w-1.5 h-1.5 bg-accent-status rounded-full animate-pulse" />
                  Available for full-time &amp; contract
                </div>
                <p className="text-sm text-muted mb-5">
                  One engineer, full ownership, from data model to deployed SaaS.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-small font-mono text-muted/60">
                  {contactLinks.map((link) =>
                    link.key === "resume" ? (
                      <button
                        key={link.key}
                        type="button"
                        data-cv-open="true"
                        onClick={openCvDrawer}
                        className="hover:text-accent transition-colors"
                      >
                        {link.key}: <span className="text-accent-secondary/70">{link.label}</span>
                      </button>
                    ) : (
                      <a
                        key={link.key}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="hover:text-accent transition-colors"
                      >
                        {link.key}: <span className="text-accent-secondary/70">{link.label}</span>
                      </a>
                    )
                  )}
                </div>
              </div>
              <a
                href="https://ahtesham.dev.wadwarehouse.com/book"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-accent text-background font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-accent/25 transition-all duration-200 text-sm whitespace-nowrap shrink-0"
              >
                <Calendar size={16} strokeWidth={1.5} />
                Book a 15-min call
              </a>
            </div>
          </TiltCard>
        </FadeUp>

      </div>
    </section>
  );
}
