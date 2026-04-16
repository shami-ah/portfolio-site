export function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-card-border">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-5 flex items-center justify-between gap-4">
        <p className="text-[11px] font-mono text-muted/40">
          © {new Date().getFullYear()} Ahtesham Ahmad
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
    </footer>
  );
}
