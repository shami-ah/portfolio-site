# Portfolio Site

Personal portfolio showcasing AI automation, system architecture, and full-stack engineering work.

**Live**: [portfolio-site-alpha.pages.dev](https://portfolio-site-alpha.pages.dev)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 + Tailwind CSS v4 |
| Animations | Framer Motion |
| Diagrams | Mermaid.js (architecture diagrams in case studies) |
| Hosting | Cloudflare Pages |

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with nav + footer
│   ├── page.tsx            # Home — hero, architecture, skills, experience, contact
│   ├── projects/
│   │   └── [slug]/page.tsx # Dynamic project case study pages
│   └── cv/                 # Resume page
├── components/
│   ├── hero.tsx            # Landing section with stats
│   ├── architecture-diagram.tsx  # Animated pipeline flow
│   ├── projects.tsx        # Project grid with cards
│   ├── skills.tsx          # Skills by domain (AI, Full Stack, Infra, Process)
│   ├── experience.tsx      # Timeline with role achievements
│   ├── building-next.tsx   # Roadmap section (what's in progress)
│   ├── contact.tsx         # Links (email, LinkedIn, GitHub, Upwork, Resume)
│   ├── about.tsx           # Bio with storytelling hook
│   ├── nav.tsx             # Navigation
│   ├── footer.tsx          # Footer
│   └── motion.tsx          # Framer Motion wrapper utilities
├── data/
│   ├── projects.ts         # All project case studies (problem, solution, architecture, stack, results)
│   └── diagrams.ts         # Mermaid diagram definitions per project
└── globals.css             # Tailwind v4 config + custom theme
```

### Content Model

Each project in `data/projects.ts` follows a structured case study format:

```
Problem → Solution → Architecture → Tech Decisions → Stack → Results
```

Architecture diagrams are rendered via Mermaid.js, defined in `data/diagrams.ts` and matched to projects by slug.

## What's Live

- **Hero** with stats: 250+ projects, 5+ years, 98% satisfaction
- **Architecture Pattern**: animated pipeline (Ingest → Classify → Orchestrate → Review → Execute → Observe)
- **6 project case studies** with Mermaid architecture diagrams
- **Skills** organized by domain (AI/ML, Full Stack, Infrastructure, Process)
- **Experience timeline** with achievement bullets
- **"What I'm Building Next"** roadmap section
- **Contact** with 5 links (email, LinkedIn, GitHub, Upwork, Resume)
- **SEO metadata** per page
- **Responsive** mobile design with animations

## System Design

### Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Static export | `next build` → Cloudflare Pages | Portfolio is read-only content — static is fastest, cheapest, and globally distributed via CDN |
| Mermaid for diagrams | Client-side rendering from text definitions | Architecture diagrams stay version-controlled as strings in `data/diagrams.ts` — no image files to maintain |
| Data-driven case studies | Typed `ProjectData[]` array, dynamic `[slug]` routes | Adding a project = adding an object to one file. No new pages, components, or routes needed |
| Framer Motion | Scroll-triggered animations | Adds polish without JavaScript bundle overhead — tree-shakes to only used animation primitives |
| No CMS | Data lives in `src/data/` TypeScript files | Content changes infrequently and is version-controlled — a CMS would add complexity for no benefit |

## Getting Started

### Prerequisites

- Node.js >= 20
- npm

### Install and Run

```bash
git clone https://github.com/shami-ah/portfolio-site.git
cd portfolio-site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Cloudflare Pages

Push to `main` — Cloudflare Pages auto-deploys on push.

## Adding a New Project

1. Add project data to `src/data/projects.ts` following the `ProjectData` interface
2. Add Mermaid diagram to `src/data/diagrams.ts` keyed by slug
3. Build and deploy — the dynamic `[slug]` route handles the rest

## License

All rights reserved.
