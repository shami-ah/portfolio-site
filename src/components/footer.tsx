export function Footer(): React.ReactElement {
  return (
    <footer className="relative overflow-hidden border-t border-card-border">
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-accent/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-6 py-16 md:py-20">
        {/* Signature display + portrait */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-16">
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

          {/* Portrait on the right */}
          <div className="relative shrink-0 self-start md:self-auto">
            <div className="absolute -inset-5 bg-gradient-to-br from-accent/20 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="relative w-[140px] h-[140px] md:w-[200px] md:h-[200px] rounded-2xl overflow-hidden border border-accent/25 shadow-2xl shadow-accent/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ahtesham.jpg"
                alt="Ahtesham Ahmad"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
            </div>
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
