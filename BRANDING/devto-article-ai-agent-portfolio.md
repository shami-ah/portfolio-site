---
title: I Built a Portfolio with a Live AI Agent — Here's How
published: false
tags: ai, webdev, react, portfolio
cover_image: (use your og.png URL after deploying)
---

Most developer portfolios are dead pages. A list of projects, a contact form, maybe a blog. You visit, skim, leave. Nobody remembers.

I wanted mine to feel like a system booting up — because that's what I build for a living.

## What makes it different

When you land on my portfolio, an AI agent boots in real-time. A particle burst fires, the hero content streams in, and the agent settles into position. It's not decoration. The agent watches which section you're viewing and offers context-specific responses.

Scroll to projects? It offers to explain architecture decisions. Reach the contact section? It suggests booking a call. It's a router, not a chatbot — free-text questions get forwarded to a full chat interface powered by Claude.

## The scrollytelling projects section

I killed the card grid. Each project gets a full-viewport panel that slides over the previous one as you scroll. Inside each panel:

- An architecture diagram (rendered with Mermaid, theme-aware for dark/light mode)
- Three real metrics (not feature lists — things like "100+ clients, no sales team")
- Click-to-expand modals for technical decisions, features, and results

This was the hardest part to get right. Scroll locking, iOS compatibility, z-index management across 4 flagship projects — it took multiple iterations.

## The boot sequence

The first thing you see isn't a hero section. It's a boot overlay:

1. Agent button appears with a breathing animation
2. 0.8 seconds later, the overlay collapses
3. A particle burst (40 particles, spring easing) fires from the agent position
4. The hero content streams in — badge, then title, then description, staggered
5. Agent tooltip appears: "ask me anything — I'm live"

Reboot triggers the exact same sequence. It's designed to feel like a system coming online, not a page loading.

I used Framer Motion for all animations. The key trick for making the reboot work identically was an epoch counter that forces React to remount components via key changes — without it, Framer Motion skips animations it thinks already ran.

## The design system: Obsidian Gold

Everything uses two colors:
- Background: `#0c0c0e` (near-black)
- Accent: `#d4a853` (warm gold)

No blue. No gradients. No glass-morphism. Just dark surfaces with gold highlights. Every card has a subtle 3D tilt on hover using a custom `useTilt` hook.

The constraint forced better decisions. When you only have one accent color, every use of it has to earn its place.

## Tech stack

- **Next.js 16** with static export (no server needed)
- **React 19** with Framer Motion for all animations
- **TypeScript** everywhere — zero `any` types
- **Mermaid.js** for architecture diagrams (dark/light theme-aware)
- **Claude API** for the AI agent (~$0.02 per conversation)
- **Self-hosted** on Docker + Traefik (my own infrastructure)

Static export means the entire site is pre-rendered HTML. The only dynamic part is the AI chat, which calls a Cloudflare Pages Function.

## The CV drawer

Instead of a separate page, the CV lives in a slide-out drawer. One click exports it as a perfectly formatted A4 PDF via a hidden iframe. It took 4 iterations to get the print font sizing right (10-11px body, 12-13px headers) for single-page density.

## What I learned

**Constraint breeds creativity.** The one-accent-color rule, the no-subpages rule (everything on the homepage), the "agent is a router not a responder" rule — each constraint eliminated decision fatigue and produced a more focused result.

**Scroll-driven UX is fragile.** iOS Safari, viewport units, scroll locking across modals and drawers — every edge case compounds. I built a shared `useScrollLock` hook and applied it across all 5 interactive panels.

**Your portfolio IS the demo.** If you build AI systems, your portfolio should use AI. If you build developer tools, your portfolio should feel like a tool. Don't describe what you do — demonstrate it.

## The numbers

- 70+ commits in the final sprint
- 4 flagship projects with production metrics
- 6 design phases from blank canvas to shipped
- 1 AI agent that knows everything about my work

The site is live. The agent is real. Come break it.

---

*I'm an AI engineer building production AI systems. If you're hiring or want to collaborate, the agent on my portfolio can tell you everything — or you can just book a call.*
