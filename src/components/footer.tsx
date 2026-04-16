"use client";

export function Footer(): React.ReactElement {
  const replayBoot = (): void => {
    sessionStorage.removeItem("boot-seen");
    sessionStorage.removeItem("boot-complete");
    window.location.reload();
  };

  return (
    <footer className="py-6 border-t border-card-border relative z-10">
      <div className="max-w-6xl mx-auto px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="text-xs text-muted/40 font-mono">
          &copy; {new Date().getFullYear()} Ahtesham Ahmad
        </p>

        <div className="flex items-center gap-4 md:gap-5 flex-wrap">
          <a
            href="/journey"
            className="text-xs text-muted/50 hover:text-accent transition-colors font-mono inline-flex items-center gap-1"
          >
            take the tour
            <span>→</span>
          </a>
          <button
            type="button"
            onClick={replayBoot}
            className="text-xs text-muted/40 hover:text-muted transition-colors font-mono inline-flex items-center gap-1"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            replay intro
          </button>
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

      {/* Subtle hint for easter eggs */}
      <p className="text-[10px] text-muted/20 font-mono text-center mt-4 px-4">
        psst… try typing{" "}
        <span className="text-muted/40">shami</span>,{" "}
        <span className="text-muted/40">hire</span>, or{" "}
        <span className="text-muted/40">wow</span> anywhere on this page
      </p>
    </footer>
  );
}
