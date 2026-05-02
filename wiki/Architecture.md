# Architecture

## System Overview

The MathGPT Quality Framework is a **statically-generated single-page application (SPA)** built with Next.js 16 App Router. The entire app compiles to static HTML at build time, requiring no backend server.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser (Client)                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Header │  │  Tab Nav     │  │  PDF Button  │           │
│  │ (sticky)│  │  (sticky)    │  │  (print API) │           │
│  └─────────┘  └──────────────┘  └──────────────┘           │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Main Content Area                          │ │
│  │                                                         │ │
│  │  ┌─────────────────┐  ┌──────────────────────────┐    │ │
│  │  │ Tab 1: Taxonomy │  │ Tab 2: SOP Workflow      │    │ │
│  │  │                 │  │                          │    │ │
│  │  │ TaxonomyTable   │  │ SOPWorkflow (stepper)    │    │ │
│  │  │ (clickable rows)│  │ (3 phases + checklists)  │    │ │
│  │  └─────────────────┘  └──────────────────────────┘    │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Tab 3: Case Studies                              │  │ │
│  │  │                                                  │  │ │
│  │  │ [Case 1 Button] [Case 2 Button]                 │  │ │
│  │  │                                                  │  │ │
│  │  │ ┌─────────────────┐  ┌───────────────────────┐  │  │ │
│  │  │ │ AI Raw Output   │  │ Expert Corrected      │  │  │ │
│  │  │ │ (red, errors)   │  │ (green, verified)     │  │  │ │
│  │  │ │ [ErrorTooltip]  │  │ MathBlock (KaTeX)     │  │  │ │
│  │  │ └─────────────────┘  └───────────────────────┘  │  │ │
│  │  │ ┌─────────────────────────────────────────────┐ │  │ │
│  │  │ │ Audit Summary (errors, root cause, impact)  │ │  │ │
│  │  │ └─────────────────────────────────────────────┘ │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Data Flow:                                                   │
│  JSON files -> React components -> KaTeX rendering           │
└──────────────────────────────────────────────────────────────┘
```

## Rendering Pipeline

```
JSON Data  →  React Components  →  KaTeX  →  Browser DOM

error-         TaxonomyTable,
taxon-         AuditCard,        katex.      <span>
omy.json       SOPWorkflow       render()    with
               MathDisplay       (sync)      rendered
                                               math

golden-
datasets.json
```

## Key Design Decisions

### 1. Static Site Generation (SSG)

The entire app is pre-rendered at build time. No server-side rendering (SSR) or client-side data fetching is required because:
- All data is embedded in JSON files
- No dynamic user-specific content
- Maximizes performance and minimizes hosting cost (free on Vercel/GitHub Pages)

### 2. KaTeX over MathJax

KaTeX was chosen because:
- **10x faster** rendering than MathJax
- **Smaller bundle** (~60KB vs ~200KB)
- Sufficient coverage for all Linear Algebra / Calculus notation
- Synchronous `render()` API — no async loading states needed

### 3. Radix UI Primitives

Instead of custom tab/tooltip implementations:
- **Accessible by default** — keyboard navigation, ARIA attributes
- **Headless** — full styling control with Tailwind
- **Composition-friendly** — no unexpected side effects

### 4. Client Components Only

The dashboard is marked `"use client"` because:
- Framer Motion requires client-side JS
- Interactive state (active tab, stepper, case selector)
- The static HTML is still fully generated at build time via Next.js hydration

### 5. Data-as-JSON

Case study and taxonomy data is stored as standalone JSON files:
- Separates content from presentation
- Enables future API migration (swap JSON fetch for REST endpoint)
- Allows non-developers to edit data without touching React code
- Directly consumable by AI training pipelines

## Component Dependency Graph

```
page.tsx
├── TaxonomyTable
│   └── (expandable rows)
├── SOPWorkflow
│   └── (stepper + checklists)
├── AuditCard
│   ├── MathDisplay (KaTeX)
│   ├── ErrorTooltip (Radix)
│   └── ScoreBadge (animated progress)
└── MathBlock
    └── KaTeX (inline + display mode)
```

## Build Output

```
npm run build
├── .next/static/          # JS bundles, CSS, KaTeX fonts
├── .next/server/          # SSR functions (minimal for SSG)
└── out/                   # Static export (if configured)

Total bundle: ~350KB (gzipped)
- React + ReactDOM: ~45KB
- KaTeX: ~60KB
- Framer Motion: ~35KB
- App code: ~15KB
- Tailwind CSS: ~8KB
- Radix UI: ~12KB
```
