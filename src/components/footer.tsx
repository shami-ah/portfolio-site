export function Footer(): React.ReactElement {
  const years = new Date().getFullYear() - 2019;
  return (
    <footer className="border-t border-card-border">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <p className="text-small font-mono text-muted/40">
            © {new Date().getFullYear()} Ahtesham Ahmad
          </p>
          <p className="text-small font-mono text-muted/30 hidden sm:block">
            &gt; system uptime: {years} years
          </p>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="/uses"
            className="text-small font-mono text-muted/40 hover:text-accent transition-colors"
          >
            &gt; Uses
          </a>
          <a
            href="https://github.com/shami-ah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-small font-mono text-muted/40 hover:text-accent transition-colors"
          >
            &gt; GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-small font-mono text-muted/40 hover:text-accent transition-colors"
          >
            &gt; LinkedIn
          </a>
          <a
            href="https://www.upwork.com/freelancers/~01bd0ab6e093ea2d49"
            target="_blank"
            rel="noopener noreferrer"
            className="text-small font-mono text-muted/40 hover:text-accent transition-colors"
          >
            &gt; Upwork
          </a>
        </div>
      </div>
    </footer>
  );
}
