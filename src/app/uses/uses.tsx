"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import { FadeUp } from "@/components/motion";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }): React.ReactElement {
  return (
    <div className="font-mono text-small md:text-small leading-[1.8]">
      <span className="text-foreground/80">{label}</span>
      <span className="text-muted/40"> : </span>
      <span className={accent ? "text-accent" : "text-accent-secondary/80"}>{value}</span>
    </div>
  );
}

function StatStrip({ stats }: { stats: { label: string; value: string }[] }): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-1.5 text-caption font-mono">
          <span className="text-foreground/80 font-semibold">{s.value}</span>
          <span className="text-muted/40">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function CodeLine({ num, children }: { num: number; children: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex leading-[1.75] font-mono text-small px-3 hover:bg-card-hover/30 transition-colors">
      <span className="w-6 text-right mr-3 text-muted/20 select-none shrink-0">{num}</span>
      <span>{children}</span>
    </div>
  );
}

// Syntax tokens
function K({ children }: { children: React.ReactNode }): React.ReactElement { return <span className="text-accent">{children}</span>; }
function S({ children }: { children: React.ReactNode }): React.ReactElement { return <span className="text-accent-secondary">{children}</span>; }
function V({ children }: { children: React.ReactNode }): React.ReactElement { return <span className="text-foreground/60">{children}</span>; }
function C({ children }: { children: React.ReactNode }): React.ReactElement { return <span className="text-muted/40">{children}</span>; }
function G({ children }: { children: React.ReactNode }): React.ReactElement { return <span className="text-accent-status">{children}</span>; }
function P({ children }: { children: React.ReactNode }): React.ReactElement { return <span className="text-muted/20">{children}</span>; }

/* ------------------------------------------------------------------ */
/*  File definitions                                                   */
/* ------------------------------------------------------------------ */

interface FileEntry {
  id: string;
  name: string;
  path: string;
  iconColor: string;
  folder: "src" | "config" | "docs" | "root";
}

const files: FileEntry[] = [
  { id: "readme", name: "README.md", path: "README.md", iconColor: "text-muted/40", folder: "root" },
  { id: "ecosystem", name: "ecosystem.ts", path: "src/ecosystem.ts", iconColor: "text-accent/60", folder: "src" },
  { id: "wisc", name: "wisc.ts", path: "src/wisc.ts", iconColor: "text-accent-secondary/50", folder: "src" },
  { id: "stack", name: "stack.yaml", path: "config/stack.yaml", iconColor: "text-accent-secondary/40", folder: "config" },
  { id: "workflow", name: "workflow.yaml", path: "config/workflow.yaml", iconColor: "text-accent/40", folder: "config" },
  { id: "environment", name: "environment.yaml", path: "config/environment.yaml", iconColor: "text-muted/40", folder: "config" },
  { id: "philosophy", name: "philosophy.md", path: "docs/philosophy.md", iconColor: "text-accent-status/40", folder: "docs" },
];

/* ------------------------------------------------------------------ */
/*  Code panels (left side of split)                                   */
/* ------------------------------------------------------------------ */

function CodeReadme(): React.ReactElement {
  return (
    <div className="py-2">
      <CodeLine num={1}><C># shami-toolkit</C></CodeLine>
      <CodeLine num={2}><span /></CodeLine>
      <CodeLine num={3}><V>A self-improving AI development ecosystem.</V></CodeLine>
      <CodeLine num={4}><V>Each tool feeds into the next.</V></CodeLine>
      <CodeLine num={5}><span /></CodeLine>
      <CodeLine num={6}><C>## Tools</C></CodeLine>
      <CodeLine num={7}><V>- **Gogaa CLI** writes code</V></CodeLine>
      <CodeLine num={8}><V>- **CodeLens** reviews it</V></CodeLine>
      <CodeLine num={9}><V>- **Rasad** monitors everything</V></CodeLine>
      <CodeLine num={10}><V>- **Patterns** feed back in</V></CodeLine>
      <CodeLine num={11}><span /></CodeLine>
      <CodeLine num={12}><C>## Quick Start</C></CodeLine>
      <CodeLine num={13}><V>```</V></CodeLine>
      <CodeLine num={14}><G>npm install shami-toolkit</G></CodeLine>
      <CodeLine num={15}><V>```</V></CodeLine>
      <CodeLine num={16}><span /></CodeLine>
      <CodeLine num={17}><C>## Author</C></CodeLine>
      <CodeLine num={18}><V>Ahtesham Ahmad · AI Engineer</V></CodeLine>
    </div>
  );
}

function CodeEcosystem(): React.ReactElement {
  return (
    <div className="py-2">
      <CodeLine num={1}><C>// The self-improving AI toolkit</C></CodeLine>
      <CodeLine num={2}><span /></CodeLine>
      <CodeLine num={3}><K>import</K> <V>{`{ Agent }`}</V> <K>from</K> <S>&quot;gogaa-cli&quot;</S></CodeLine>
      <CodeLine num={4}><K>import</K> <V>{`{ Reviewer }`}</V> <K>from</K> <S>&quot;codelens&quot;</S></CodeLine>
      <CodeLine num={5}><K>import</K> <V>{`{ Observer }`}</V> <K>from</K> <S>&quot;rasad&quot;</S></CodeLine>
      <CodeLine num={6}><span /></CodeLine>
      <CodeLine num={7}><K>export const</K> <K>toolkit</K> <P>=</P> <P>{`{`}</P></CodeLine>
      <CodeLine num={8}>  <V>name</V><P>:</P> <S>&quot;shami-toolkit&quot;</S><P>,</P></CodeLine>
      <CodeLine num={9}>  <V>loop</V><P>:</P> <G>true</G><P>,</P></CodeLine>
      <CodeLine num={10}><span /></CodeLine>
      <CodeLine num={11}>  <V>tools</V><P>: [</P></CodeLine>
      <CodeLine num={12}>    Agent<P>({`{`}</P> <V>role</V><P>:</P> <S>&quot;writes code&quot;</S> <P>{`})`}</P><P>,</P></CodeLine>
      <CodeLine num={13}>    Reviewer<P>({`{`}</P> <V>role</V><P>:</P> <S>&quot;reviews it&quot;</S> <P>{`})`}</P><P>,</P></CodeLine>
      <CodeLine num={14}>    Observer<P>({`{`}</P> <V>role</V><P>:</P> <S>&quot;monitors all&quot;</S> <P>{`})`}</P><P>,</P></CodeLine>
      <CodeLine num={15}>  <P>],</P></CodeLine>
      <CodeLine num={16}><span /></CodeLine>
      <CodeLine num={17}>  <C>// patterns feed back into context</C></CodeLine>
      <CodeLine num={18}>  <C>// same bug never generated twice</C></CodeLine>
      <CodeLine num={19}><P>{`}`}</P> <K>satisfies</K> <V>Toolkit</V></CodeLine>
    </div>
  );
}

function CodeWisc(): React.ReactElement {
  return (
    <div className="py-2">
      <CodeLine num={1}><C>// Context engineering framework</C></CodeLine>
      <CodeLine num={2}><span /></CodeLine>
      <CodeLine num={3}><K>export const</K> <K>wisc</K> <P>=</P> <P>{`{`}</P></CodeLine>
      <CodeLine num={4}>  <V>W</V><P>:</P> <S>&quot;Write&quot;</S><P>,</P>   <C>// persist to files</C></CodeLine>
      <CodeLine num={5}>  <V>I</V><P>:</P> <S>&quot;Isolate&quot;</S><P>,</P> <C>// one task per convo</C></CodeLine>
      <CodeLine num={6}>  <V>S</V><P>:</P> <S>&quot;Select&quot;</S><P>,</P>  <C>// path-scoped rules</C></CodeLine>
      <CodeLine num={7}>  <V>C</V><P>:</P> <S>&quot;Compress&quot;</S><P>,</P><C>// lazy-load skills</C></CodeLine>
      <CodeLine num={8}><span /></CodeLine>
      <CodeLine num={9}>  <V>before</V><P>:</P> <S>&quot;72KB&quot;</S><P>,</P></CodeLine>
      <CodeLine num={10}>  <V>after</V><P>:</P> <S>&quot;11.7KB&quot;</S><P>,</P></CodeLine>
      <CodeLine num={11}>  <V>reduction</V><P>:</P> <G>&quot;84%&quot;</G><P>,</P></CodeLine>
      <CodeLine num={12}>  <V>capabilityLoss</V><P>:</P> <G>0</G><P>,</P></CodeLine>
      <CodeLine num={13}><P>{`}`}</P></CodeLine>
    </div>
  );
}

function CodeStack(): React.ReactElement {
  return (
    <div className="py-2">
      <CodeLine num={1}><C># config/stack.yaml</C></CodeLine>
      <CodeLine num={2}><span /></CodeLine>
      <CodeLine num={3}><V>frontend</V><P>:</P></CodeLine>
      <CodeLine num={4}>  <P>-</P> <S>React 19</S></CodeLine>
      <CodeLine num={5}>  <P>-</P> <S>Next.js 16</S></CodeLine>
      <CodeLine num={6}>  <P>-</P> <S>TypeScript</S></CodeLine>
      <CodeLine num={7}>  <P>-</P> <S>Tailwind v4</S></CodeLine>
      <CodeLine num={8}><span /></CodeLine>
      <CodeLine num={9}><V>backend</V><P>:</P></CodeLine>
      <CodeLine num={10}>  <P>-</P> <S>Supabase</S></CodeLine>
      <CodeLine num={11}>  <P>-</P> <S>PostgreSQL</S></CodeLine>
      <CodeLine num={12}>  <P>-</P> <S>Edge Functions</S></CodeLine>
      <CodeLine num={13}><span /></CodeLine>
      <CodeLine num={14}><V>ai</V><P>:</P></CodeLine>
      <CodeLine num={15}>  <P>-</P> <K>Claude</K></CodeLine>
      <CodeLine num={16}>  <P>-</P> <K>OpenAI</K></CodeLine>
      <CodeLine num={17}>  <P>-</P> <K>Groq</K></CodeLine>
      <CodeLine num={18}>  <P>-</P> <K>pgvector</K></CodeLine>
      <CodeLine num={19}><span /></CodeLine>
      <CodeLine num={20}><V>infra</V><P>:</P></CodeLine>
      <CodeLine num={21}>  <P>-</P> <S>Docker</S></CodeLine>
      <CodeLine num={22}>  <P>-</P> <S>GitHub Actions</S></CodeLine>
      <CodeLine num={23}>  <P>-</P> <S>Stripe</S></CodeLine>
    </div>
  );
}

function CodeWorkflow(): React.ReactElement {
  return (
    <div className="py-2">
      <CodeLine num={1}><C># How every feature ships</C></CodeLine>
      <CodeLine num={2}><span /></CodeLine>
      <CodeLine num={3}><V>steps</V><P>:</P></CodeLine>
      <CodeLine num={4}>  <P>-</P> <V>name</V><P>:</P> <S>Product</S></CodeLine>
      <CodeLine num={5}>    <V>do</V><P>:</P> <S>Pin the outcome</S></CodeLine>
      <CodeLine num={6}>  <P>-</P> <V>name</V><P>:</P> <S>Architect</S></CodeLine>
      <CodeLine num={7}>    <V>do</V><P>:</P> <S>Sketch the data flow</S></CodeLine>
      <CodeLine num={8}>  <P>-</P> <V>name</V><P>:</P> <S>Spec</S></CodeLine>
      <CodeLine num={9}>    <V>do</V><P>:</P> <S>Schema + RLS + edge cases</S></CodeLine>
      <CodeLine num={10}>  <P>-</P> <V>name</V><P>:</P> <S>Scaffold</S></CodeLine>
      <CodeLine num={11}>    <V>do</V><P>:</P> <S>Agent generates from spec</S></CodeLine>
      <CodeLine num={12}>  <P>-</P> <V>name</V><P>:</P> <S>Review</S></CodeLine>
      <CodeLine num={13}>    <V>do</V><P>:</P> <S>CodeLens catches bugs</S></CodeLine>
      <CodeLine num={14}>  <P>-</P> <V>name</V><P>:</P> <S>Ship</S></CodeLine>
      <CodeLine num={15}>    <V>do</V><P>:</P> <S>Feature flag, 10%, 100%</S></CodeLine>
    </div>
  );
}

function CodeEnvironment(): React.ReactElement {
  return (
    <div className="py-2">
      <CodeLine num={1}><C># Hardware and dev environment</C></CodeLine>
      <CodeLine num={2}><span /></CodeLine>
      <CodeLine num={3}><V>machine</V><P>:</P> <S>MacBook Pro M-series</S></CodeLine>
      <CodeLine num={4}><V>ram</V><P>:</P> <S>16GB</S></CodeLine>
      <CodeLine num={5}><V>server</V><P>:</P> <S>Ubuntu VPS</S></CodeLine>
      <CodeLine num={6}><span /></CodeLine>
      <CodeLine num={7}><V>shell</V><P>:</P> <S>zsh + Powerlevel10k</S></CodeLine>
      <CodeLine num={8}><V>editor</V><P>:</P> <K>Gogaa CLI + Claude Code</K></CodeLine>
      <CodeLine num={9}><V>fonts</V><P>:</P> <S>JetBrains Mono</S></CodeLine>
      <CodeLine num={10}><V>git</V><P>:</P> <S>dual identity</S></CodeLine>
      <CodeLine num={11}><span /></CodeLine>
      <CodeLine num={12}><V>mobile_dev</V><P>:</P></CodeLine>
      <CodeLine num={13}>  <V>method</V><P>:</P> <S>Tailscale + SSH + tmux</S></CodeLine>
      <CodeLine num={14}>  <V>onboarding</V><P>:</P> <S>10 minutes</S></CodeLine>
    </div>
  );
}

function CodePhilosophy(): React.ReactElement {
  return (
    <div className="py-2">
      <CodeLine num={1}><C># Principles</C></CodeLine>
      <CodeLine num={2}><span /></CodeLine>
      <CodeLine num={3}><V>1. Ship it, then improve it</V></CodeLine>
      <CodeLine num={4}><V>2. Architect first, code second</V></CodeLine>
      <CodeLine num={5}><V>3. If the tool doesn&apos;t exist,</V></CodeLine>
      <CodeLine num={6}><V>   build it</V></CodeLine>
      <CodeLine num={7}><V>4. No `any` in TypeScript, ever</V></CodeLine>
      <CodeLine num={8}><V>5. AI with human gates,</V></CodeLine>
      <CodeLine num={9}><V>   not full automation</V></CodeLine>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Preview panels (right side of split)                               */
/* ------------------------------------------------------------------ */

const loopNodes = [
  { label: "Gogaa CLI", stat: "writes code", color: "border-accent/40 text-accent" },
  { label: "CodeLens", stat: "reviews it", color: "border-accent-secondary/40 text-accent-secondary" },
  { label: "Patterns", stat: "feed back in", color: "border-accent-status/40 text-accent-status" },
  { label: "Rasad", stat: "monitors all", color: "border-accent/40 text-accent" },
];

function PreviewReadme(): React.ReactElement {
  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-2">shami-toolkit</h2>
      <p className="text-xs text-muted leading-relaxed mb-4">A self-improving AI development ecosystem. Every piece was chosen because it makes the others better. Most of the AI tooling here I built myself.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {["Gogaa CLI", "CodeLens", "Rasad", "Claude Code"].map((t) => (
          <span key={t} className="px-2 py-0.5 text-caption font-mono bg-accent/5 text-accent/80 rounded border border-accent/20">{t}</span>
        ))}
      </div>
      <div className="p-3 rounded-lg bg-background/40 border border-card-border/40 font-mono text-caption">
        <div className="text-muted/40 mb-1">$ npm install shami-toolkit</div>
        <div className="text-accent-status/60">+ shami-toolkit@1.0.0</div>
      </div>
      <p className="text-caption text-muted/40 mt-4 font-mono">Ahtesham Ahmad · AI Engineer</p>
    </div>
  );
}

function PreviewEcosystem(): React.ReactElement {
  return (
    <div className="p-5">
      <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-card via-card to-accent/[0.03] p-5">
        <p className="text-caption font-mono text-accent uppercase tracking-[0.2em] mb-3">The loop nobody else has</p>
        <p className="text-sm font-medium mb-1">I built an ecosystem where each tool makes the others better.</p>
        <p className="text-caption text-muted leading-relaxed mb-5">Gogaa writes code. CodeLens reviews it. Patterns feed back via Guardian mode. Rasad monitors every session.</p>
        {/* Globe diagram with orbital pillars */}
        <div className="hidden md:flex relative items-center justify-center py-8">
          {/* Globe: concentric circles */}
          <div className="absolute w-[160px] h-[160px] rounded-full border border-accent/10" />
          <div className="absolute w-[120px] h-[120px] rounded-full border border-accent/8" />
          <div className="absolute w-[80px] h-[80px] rounded-full border border-accent/6" />
          {/* Horizontal + vertical cross lines for globe effect */}
          <div className="absolute w-[160px] h-px bg-accent/8" />
          <div className="absolute w-px h-[160px] bg-accent/8" />
          {/* Elliptical orbits */}
          <div className="absolute w-[160px] h-[100px] rounded-full border border-dashed border-accent/15" />
          <div className="absolute w-[100px] h-[160px] rounded-full border border-dashed border-accent/10" />
          {/* Center label */}
          <div className="absolute text-center z-0">
            <p className="text-caption font-mono text-muted/30 uppercase tracking-[0.3em]">self</p>
            <p className="text-caption font-mono text-muted/30 uppercase tracking-[0.3em]">improving</p>
          </div>
          {/* 4 pillar nodes positioned around the globe */}
          <div className="relative w-[280px] h-[280px]">
            {loopNodes.map((node, i) => {
              const pos = [
                "top-0 left-1/2 -translate-x-1/2 -translate-y-1/3",
                "top-1/2 right-0 translate-x-1/3 -translate-y-1/2",
                "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3",
                "top-1/2 left-0 -translate-x-1/3 -translate-y-1/2",
              ];
              return (
                <div key={node.label} className={`absolute ${pos[i]} z-10 px-3 py-2 rounded-lg border bg-card text-center min-w-[90px] shadow-md ${node.color.split(" ")[0]}`}>
                  <p className={`text-small font-bold ${node.color.split(" ")[1]}`}>{node.label}</p>
                  <p className="text-caption text-muted/50">{node.stat}</p>
                </div>
              );
            })}
          </div>
        </div>
        {/* Mobile fallback */}
        <div className="flex flex-col gap-1.5 md:hidden">
          {loopNodes.map((node) => (
            <div key={node.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-card-border bg-card">
              <span className={`text-xs font-bold ${node.color.split(" ")[1]}`}>{node.label}</span>
              <span className="text-caption text-muted/60">{node.stat}</span>
            </div>
          ))}
        </div>
        {/* Timeline */}
        <div className="mt-4 pt-3 border-t border-card-border/20">
          <p className="text-caption font-mono text-muted/40 uppercase tracking-widest mb-2">In practice</p>
          <div className="flex flex-wrap gap-1 items-center">
            {[
              { t: "9:00", a: "Gogaa scaffolds", c: "text-accent" },
              { t: "9:04", a: "CodeLens reviews", c: "text-accent-secondary" },
              { t: "9:05", a: "2 caught", c: "text-accent-status" },
              { t: "9:06", a: "push", c: "text-foreground/60" },
            ].map((s, i, arr) => (
              <span key={s.t} className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-background/40 border border-card-border/40 text-caption font-mono">
                  <span className="text-muted/40">{s.t}</span> <span className={s.c}>{s.a}</span>
                </span>
                {i < arr.length - 1 && <span className="text-muted/20 text-caption">&rarr;</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewWisc(): React.ReactElement {
  return (
    <div className="p-5">
      <p className="text-caption font-mono text-accent uppercase tracking-[0.15em] mb-3">WISC Framework</p>
      <p className="text-caption text-muted leading-relaxed mb-4">A methodology for managing AI agent context. Cuts 35-40K tokens down to what you need per turn.</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: "W", w: "Write", d: "Persist decisions to files, not conversation" },
          { l: "I", w: "Isolate", d: "One task per conversation. Subagents for research" },
          { l: "S", w: "Select", d: "Path-scoped rules only load when needed" },
          { l: "C", w: "Compress", d: "Agent defs stripped from 58KB to 5KB" },
        ].map((item) => (
          <div key={item.l} className="p-2.5 rounded-lg border border-card-border bg-background/30">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-base font-bold text-accent font-mono">{item.l}</span>
              <span className="text-caption font-semibold text-foreground">{item.w}</span>
            </div>
            <p className="text-caption text-muted leading-relaxed">{item.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-card-border/40 flex items-center gap-2 text-caption font-mono">
        <span className="text-muted/60">result:</span>
        <span className="text-accent-status">72KB &rarr; 11.7KB</span>
        <span className="text-muted/40">&middot;</span>
        <span className="text-muted/60">84% reduction</span>
      </div>
    </div>
  );
}

function PreviewStack(): React.ReactElement {
  return (
    <div className="p-5">
      <p className="text-caption font-mono text-accent uppercase tracking-[0.15em] mb-3">Stack</p>
      <div className="space-y-0.5">
        <Line label="TypeScript" value="types prevent prod bugs, no any ever" />
        <Line label="React 19" value="component model, server components" />
        <Line label="Next.js 16" value="app router, static export" />
        <Line label="Supabase" value="pgvector + RLS + Edge Functions + Auth" />
        <Line label="Tailwind v4" value="utility CSS, design tokens via CSS vars" />
        <Line label="Docker" value="identical env everywhere" />
        <Line label="Stripe" value="billing, Connect, webhooks" accent />
        <Line label="GitHub Actions" value="CI/CD, auto-publish, deploy on push" />
      </div>
    </div>
  );
}

function PreviewWorkflow(): React.ReactElement {
  return (
    <div className="p-5">
      <p className="text-caption font-mono text-accent uppercase tracking-[0.15em] mb-3">How every feature ships</p>
      <div className="space-y-2">
        {[
          { n: "01", l: "Product", d: "Pin the outcome. What does the user see when this works?" },
          { n: "02", l: "Architect", d: "Sketch the data flow. Decide what talks to what." },
          { n: "03", l: "Spec", d: "Schema, RLS, edge cases. The boring stuff that prevents 3 AM debugging." },
          { n: "04", l: "Scaffold", d: "AI agent generates from the spec." },
          { n: "05", l: "Review", d: "CodeLens runs ~430 patterns. Fix before commit." },
          { n: "06", l: "Ship", d: "Feature flag, 10% rollout, then 100%." },
        ].map((s) => (
          <div key={s.n} className="flex gap-2 items-start">
            <span className="text-caption font-mono text-accent/60 tabular-nums pt-0.5 shrink-0">{s.n}</span>
            <div>
              <span className="text-small font-semibold text-foreground">{s.l}</span>
              <span className="text-caption text-muted"> {s.d}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewEnvironment(): React.ReactElement {
  return (
    <div className="p-5">
      <p className="text-caption font-mono text-accent uppercase tracking-[0.15em] mb-3">Hardware &amp; Environment</p>
      <div className="space-y-0.5 mb-4">
        <Line label="machine" value="MacBook Pro M-series, 16GB" />
        <Line label="server" value="Ubuntu VPS, Docker + Traefik + Gitea" />
        <Line label="mobile dev" value="Phone via Tailscale + SSH + tmux" />
        <Line label="container" value="Node 24, Python, Deno, Playwright" />
        <Line label="onboarding" value="clone, setup.sh, start.sh. 10 minutes" />
      </div>
      <p className="text-caption font-mono text-accent uppercase tracking-[0.15em] mb-3">Terminal</p>
      <div className="space-y-0.5">
        <Line label="shell" value="zsh + oh-my-zsh + Powerlevel10k" />
        <Line label="fonts" value="JetBrains Mono, Inter, Space Grotesk" />
        <Line label="git" value="dual identity: shami-ah + fsoell" />
        <Line label="editor" value="Gogaa CLI + Claude Code" accent />
      </div>
    </div>
  );
}

function PreviewPhilosophy(): React.ReactElement {
  return (
    <div className="p-5">
      <p className="text-caption font-mono text-accent uppercase tracking-[0.15em] mb-3">Principles</p>
      <div className="space-y-2">
        {[
          { h: "f4a9c2d", m: "ship it, then improve it", b: "Perfection is the enemy of production." },
          { h: "b1e7a3f", m: "architect first, code second", b: "30 minutes with a whiteboard saves 30 hours." },
          { h: "a0d1e9c", m: "if the tool doesn't exist, build it", b: "CodeLens, Gogaa, Rasad started because nothing else worked." },
          { h: "c3f8b21", m: "no any in TypeScript, ever", b: "It always comes back as a runtime error." },
          { h: "e7d4a90", m: "AI with human gates", b: "The first misread costs you the client." },
        ].map((c) => (
          <div key={c.h} className="font-mono text-small">
            <div className="flex items-baseline gap-2">
              <span className="text-accent-secondary">{c.h}</span>
              <span className="text-foreground/80">{c.m}</span>
            </div>
            <p className="text-caption text-muted/40 pl-16">{c.b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Code + Preview map                                                 */
/* ------------------------------------------------------------------ */

const codePanels: Record<string, () => React.ReactElement> = {
  readme: CodeReadme, ecosystem: CodeEcosystem, wisc: CodeWisc,
  stack: CodeStack, workflow: CodeWorkflow, environment: CodeEnvironment, philosophy: CodePhilosophy,
};

const previewPanels: Record<string, () => React.ReactElement> = {
  readme: PreviewReadme, ecosystem: PreviewEcosystem, wisc: PreviewWisc,
  stack: PreviewStack, workflow: PreviewWorkflow, environment: PreviewEnvironment, philosophy: PreviewPhilosophy,
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function Uses(): React.ReactElement {
  const [activeFile, setActiveFile] = useState("readme");
  const [openTabs, setOpenTabs] = useState<string[]>(["readme"]);
  const [mobileView, setMobileView] = useState<"code" | "preview">("preview");

  const selectFile = (id: string): void => {
    setActiveFile(id);
    if (!openTabs.includes(id)) setOpenTabs((t) => [...t, id]);
  };

  const closeTab = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    const next = openTabs.filter((t) => t !== id);
    setOpenTabs(next);
    if (activeFile === id) setActiveFile(next[next.length - 1] ?? "");
  };

  const activeEntry = files.find((f) => f.id === activeFile);
  const CodePanel = codePanels[activeFile] ?? CodeReadme;
  const PreviewPanel = previewPanels[activeFile] ?? PreviewReadme;
  const lang = activeEntry?.name.endsWith(".yaml") ? "YAML" : activeEntry?.name.endsWith(".md") ? "Markdown" : "TypeScript";

  const folders = ["src", "config", "docs", "root"] as const;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Title bar */}
      <div className="border-b border-card-border bg-card/60 shrink-0">
        <div className="max-w-5xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <Link href="/" aria-label="Close" className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
          </div>
          <span className="text-small font-mono text-muted/40">shami-toolkit</span>
          <Link
            href="/"
            className="text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            ← back to portfolio
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar file tree — desktop only */}
        <div className="w-[190px] border-r border-card-border bg-card shrink-0 hidden lg:flex flex-col font-mono text-caption overflow-y-auto">
          <div className="px-3 py-2 text-caption text-muted/20 uppercase tracking-[1.5px]">Explorer</div>

          {folders.map((folder) => {
            const folderFiles = files.filter((f) => f.folder === folder);
            if (folderFiles.length === 0) return null;
            if (folder === "root") {
              return folderFiles.map((f) => (
                <button key={f.id} type="button" onClick={() => selectFile(f.id)}
                  className={`w-full flex items-center gap-1.5 px-3 py-[3px] text-left transition-all ${activeFile === f.id ? "bg-accent/5 text-accent border-r-2 border-accent" : "text-muted/40 hover:bg-card-hover/40 hover:text-muted/80"}`}>
                  <span className={`text-caption ${f.iconColor}`}>&#9671;</span>{f.name}
                </button>
              ));
            }
            return (
              <div key={folder}>
                <div className="flex items-center gap-1.5 px-3 py-[3px] text-muted/40">
                  <span className="text-caption text-accent/40">&#9662;</span>
                  <span className="font-semibold text-foreground/40">{folder}/</span>
                </div>
                {folderFiles.map((f) => (
                  <button key={f.id} type="button" onClick={() => selectFile(f.id)}
                    className={`w-full flex items-center gap-1.5 pl-6 pr-3 py-[3px] text-left transition-all ${activeFile === f.id ? "bg-accent/5 text-accent border-r-2 border-accent" : "text-muted/40 hover:bg-card-hover/40 hover:text-muted/80"}`}>
                    <span className={`text-caption ${f.iconColor}`}>&#9670;</span>{f.name}
                  </button>
                ))}
              </div>
            );
          })}

          <div className="mt-auto px-3 py-2 border-t border-card-border/20">
            <div className="text-caption text-muted/20 uppercase tracking-[1px] mb-1">Git</div>
            <div className="text-caption text-muted/20 flex items-center gap-1"><span className="w-[3px] h-[3px] rounded-full bg-accent-status" /> main</div>
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile: file picker + view toggle in one compact bar */}
          <div className="flex flex-col md:hidden border-b border-card-border bg-card shrink-0">
            {/* File picker — horizontal scroll */}
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-0.5 px-2 py-1.5 min-w-min">
                {files.map((f) => {
                  const shortName = f.name.replace(/\.(ts|yaml|md)$/, "");
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => selectFile(f.id)}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        activeFile === f.id
                          ? "bg-accent/10 text-accent"
                          : "text-muted/40 active:bg-card-hover/40"
                      }`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* View toggle */}
            <div className="flex border-t border-card-border/20">
              <button
                type="button"
                onClick={() => setMobileView("code")}
                className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  mobileView === "code"
                    ? "text-accent bg-accent/5 border-b-2 border-accent"
                    : "text-muted/40"
                }`}
              >
                {activeEntry?.name ?? "Code"}
              </button>
              <div className="w-px bg-card-border/20" />
              <button
                type="button"
                onClick={() => setMobileView("preview")}
                className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  mobileView === "preview"
                    ? "text-accent bg-accent/5 border-b-2 border-accent"
                    : "text-muted/40"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Desktop: tabs */}
          <div className="hidden md:flex border-b border-card-border bg-card/50 shrink-0 overflow-x-auto">
            {openTabs.map((tabId) => {
              const f = files.find((x) => x.id === tabId);
              if (!f) return null;
              return (
                <button key={tabId} type="button" onClick={() => setActiveFile(tabId)}
                  className={`flex items-center gap-1 px-3 py-[5px] text-caption font-mono border-r border-card-border/20 shrink-0 transition-colors ${activeFile === tabId ? "bg-background text-foreground/80 border-b-2 border-b-accent -mb-px" : "text-muted/40 hover:text-muted/60"}`}>
                  <span className={`text-caption ${f.iconColor}`}>&#9670;</span>
                  {f.name}
                  <span onClick={(e) => closeTab(tabId, e)} className="ml-1 text-small opacity-20 hover:opacity-60 transition-opacity">&times;</span>
                </button>
              );
            })}
          </div>

          {/* Breadcrumb — desktop only */}
          <div className="hidden md:block px-3 py-[3px] text-caption font-mono text-muted/20 border-b border-card-border/20 shrink-0 bg-background/30">
            shami-toolkit <span className="text-muted/20">&rsaquo;</span> {activeEntry?.path}
          </div>

          {/* Split: Code + Preview — or empty state */}
          {activeFile && activeEntry ? (
            <div className="flex-1 flex overflow-hidden">
              {/* Code — shown on md+ always, on mobile when toggled */}
              <div className={`flex-1 overflow-y-auto border-r border-card-border/20 bg-background/40 ${
                mobileView === "code" ? "block" : "hidden md:block"
              }`}>
                <div className="sticky top-0 z-5 px-3 py-[3px] text-caption font-mono text-muted/20 uppercase tracking-[1px] border-b border-card-border/20 bg-background/90 backdrop-blur-sm">
                  {activeEntry.name}
                </div>
                <CodePanel />
              </div>
              {/* Preview — shown on md+ always, on mobile when toggled */}
              <div className={`flex-[1.1] overflow-y-auto ${
                mobileView === "preview" ? "block" : "hidden md:block"
              }`}>
                <div className="sticky top-0 z-5 px-3 py-[3px] text-caption font-mono text-muted/20 uppercase tracking-[1px] border-b border-card-border/20 bg-background/90 backdrop-blur-sm">
                  Preview
                </div>
                <PreviewPanel />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted/20 text-3xl mb-3 font-mono">&#123; &#125;</p>
                <p className="text-sm text-muted/40 font-mono mb-1">No file open</p>
                <p className="text-caption text-muted/20">Select a file from the sidebar to explore</p>
              </div>
            </div>
          )}

          {/* Status bar — compact on mobile */}
          <div className="flex items-center justify-between px-3 py-[2px] border-t border-card-border bg-card/40 shrink-0 text-caption font-mono text-muted/20">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-[3px] h-[3px] rounded-full bg-accent-status" /> main</span>
              <span>{lang}</span>
              <span className="hidden sm:inline">UTF-8</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">shami-toolkit</span>
              <span className="hidden sm:inline">Ln 1, Col 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
