import Link from "next/link";
import { AgentEmoji } from "@/components/agent-bar";

export default function NotFound(): React.ReactElement {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Confused emoji */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center">
            <AgentEmoji size={48} mood="confused" />
          </div>
        </div>

        <p className="font-mono text-accent text-sm uppercase tracking-[0.3em] mb-4">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          I looked everywhere.
        </h1>
        <p className="text-muted text-sm md:text-base mb-8 leading-relaxed">
          This page doesn&apos;t exist. Try asking me instead &mdash; I know
          everything about Ahtesham&apos;s work.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-gradient text-sm font-medium transition-colors"
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
