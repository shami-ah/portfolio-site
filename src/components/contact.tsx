"use client";

import { FadeUp } from "./motion";

const links = [
  {
    label: "Email",
    icon: "\u{1F4E7}",
    href: "mailto:shami8024@gmail.com",
    display: "shami8024@gmail.com",
  },
  {
    label: "LinkedIn",
    icon: "\u{1F517}",
    href: "https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5",
    display: "linkedin.com/in/ahtesham",
  },
  {
    label: "GitHub",
    icon: "\u{1F4BB}",
    href: "https://github.com/shami-ah",
    display: "github.com/shami-ah",
  },
  {
    label: "Upwork",
    icon: "\u{1F4BC}",
    href: "https://www.upwork.com/freelancers/~01bd0ab6e093ea2d49",
    display: "Top Rated Freelancer",
  },
  {
    label: "CV",
    icon: "\u{1F4C4}",
    href: "https://drive.google.com/file/d/1wae_mNcnMBUgFYy2Xs-LKsYsFOsNJQ65/view?usp=sharing",
    display: "Download CV",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let&apos;s build something
            <span className="text-accent"> production-grade.</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-12 leading-relaxed">
            I build AI systems that run businesses autonomously &mdash; not
            demos, not prototypes, production systems with real users. If you
            need an AI automation architect who can own the full stack from
            database to deployment, let&apos;s talk.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-card-border hover:border-accent/30 hover:bg-card-hover transition-all duration-300 group"
              >
                <span className="text-xl">{link.icon}</span>
                <div className="text-left">
                  <p className="text-xs text-muted">{link.label}</p>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors">
                    {link.display}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-sm text-muted">
            <span className="font-medium text-accent">Wadware House</span>
            &mdash; AI Automation Agency (Inquiries welcome)
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
