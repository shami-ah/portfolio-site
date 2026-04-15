"use client";

import { FadeUp } from "./motion";

const links = [
  {
    label: "Email",
    href: "mailto:shami8024@gmail.com",
    display: "shami8024@gmail.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5",
    display: "Ahtesham Ahmad",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/shami-ah",
    display: "shami-ah",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~01bd0ab6e093ea2d49",
    display: "100% Job Success",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.795-3.057 2.838-3.057 1.205 0 2.184.977 2.184 2.184 0 1.206-.979 2.218-2.184 2.218zm0-6.732c-2.064 0-3.654 1.326-4.305 3.432a11.39 11.39 0 01-2.102-3.377h-2.1v5.672c0 1.062-.869 1.93-1.93 1.93s-1.93-.868-1.93-1.93V6.481H4.094v5.672c0 2.271 1.86 4.098 4.096 4.098s4.064-1.827 4.064-4.098v-.95a11.65 11.65 0 001.596 2.324l-1.34 6.32h2.171l.97-4.58c1.055.717 2.283 1.146 3.604 1.146 2.406 0 4.37-1.963 4.37-4.369s-1.963-4.318-4.064-4.318z" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: "/cv",
    display: "View CV",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 18 15 15" />
      </svg>
    ),
  },
];

export function Contact(): React.ReactElement {
  return (
    <section id="contact" className="py-24 md:py-32 bg-card/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Contact
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Available — full-time remote &amp; 90-day engagements
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let&apos;s build something
            <span className="text-accent"> real.</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-3 leading-relaxed">
            I design the system architecture, build the AI layer, and ship the
            full product — no hand-holding required. If you need an AI automation
            engineer who owns the outcome, reach out.
          </p>
          <p className="text-xs font-mono text-muted/50 mb-10">
            Response time: &lt;24h
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <a
            href="https://calendly.com/shami8024/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 mb-8 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Book a free 30-min intro call
            <span className="text-white/60 text-sm font-normal group-hover:text-white/80 transition-colors">→</span>
          </a>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-card border border-card-border hover:border-accent/30 hover:bg-card-hover transition-all duration-200 text-sm text-muted hover:text-foreground group"
              >
                <span className="text-muted group-hover:text-accent transition-colors">
                  {link.icon}
                </span>
                <span className="font-medium">{link.display}</span>
              </a>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="text-xs text-muted/60">
            Also available through{" "}
            <span className="text-muted font-medium">Wadware House</span>
            {" "}for agency projects.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
