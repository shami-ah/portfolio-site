export function Footer(): React.ReactElement {
  return (
    <footer className="py-8 border-t border-card-border">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Ahtesham Ahmad. Built with Next.js +
          Framer Motion.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/shami-ah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:shami8024@gmail.com"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
