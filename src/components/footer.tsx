export function Footer(): React.ReactElement {
  return (
    <footer className="py-6 border-t border-card-border relative z-10">
      <div className="max-w-6xl mx-auto px-5 md:px-6 flex items-center justify-between">
        <p className="text-xs text-muted/40 font-mono">
          &copy; {new Date().getFullYear()} Ahtesham Ahmad
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/shami-ah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted/40 hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted/40 hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
