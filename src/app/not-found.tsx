import Link from "next/link";

export default function NotFound(): React.ReactElement {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-accent text-sm uppercase tracking-[0.3em] mb-4">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Page not found.
        </h1>
        <p className="text-muted text-sm md:text-base mb-8 leading-relaxed">
          The route you requested doesn&apos;t exist. It may have been moved or
          removed.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Back to portfolio
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-card-border text-sm text-muted hover:text-foreground hover:border-accent/20 transition-colors"
          >
            View projects
          </Link>
        </div>
        <p className="mt-12 font-mono text-xs text-muted/40">
          &gt; GET {"{"}path{"}"} &mdash; 404 Not Found
        </p>
      </div>
    </main>
  );
}
