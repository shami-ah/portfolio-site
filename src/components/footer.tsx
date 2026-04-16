export function Footer(): React.ReactElement {
  return (
    <footer className="relative overflow-hidden border-t border-card-border">
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-accent/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-6 py-16 md:py-20">
        {/* Signature display */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-mono text-accent uppercase tracking-[0.3em] mb-2">
              Engr.
            </p>
            <h2 className="text-[44px] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.92] mb-4">
              Ahtesham
              <br />
              <span className="text-muted/60">Ahmad.</span>
            </h2>
            <p className="text-xs md:text-sm font-mono text-muted/60 uppercase tracking-wider">
              AI Automation Architect · Islamabad, PK · remote-first
            </p>
          </div>

          {/* Status block */}
          <div className="flex flex-col gap-3 md:text-right shrink-0">
            <div className="inline-flex items-center gap-2 self-start md:self-end text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400">open to opportunities</span>
            </div>
            <a
              href="mailto:shami8024@gmail.com"
              className="text-sm md:text-base text-foreground hover:text-accent transition-colors"
            >
              shami8024@gmail.com
            </a>
            <a
              href="https://calendly.com/shami8024/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline underline-offset-4"
            >
              book a 15-min call →
            </a>
          </div>
        </div>

        {/* Divider + meta row */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-muted/40">
            © {new Date().getFullYear()} Ahtesham Ahmad · built with Next.js,
            deployed on Cloudflare
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/shami-ah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-muted/40 hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-muted/40 hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://www.upwork.com/freelancers/~01bd0ab6e093ea2d49"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-muted/40 hover:text-accent transition-colors"
            >
              Upwork
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
