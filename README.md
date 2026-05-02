# QC Framework for AI-Generated Mathematics

> **Interactive Portfolio** — Nguyen Ngoc Huynh
> Personal Project — Mathematics Content QA

[![CI](https://github.com/stable-nnhuynh/QC-Framework-for-AI-Generated-Mathematics/actions/workflows/ci.yml/badge.svg)](https://github.com/stable-nnhuynh/QC-Framework-for-AI-Generated-Mathematics/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A production-grade Quality Control Framework for AI-generated mathematics. An interactive dashboard demonstrating expertise in mathematical content QA, error taxonomy design, and expert audit workflows.

---

## Quick Start

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What It Does

| Module | Description |
|---|---|
| **Error Taxonomy** | 4 error codes (LOG-01, CAL-02, SYM-03, GAP-04) with expandable descriptions and severity levels |
| **SOP Workflow** | 3-phase expert checklist: Audit, Correct & Rewrite, Benchmark |
| **Case Studies** | Side-by-side AI errors vs Expert corrections with hover tooltips and score comparison |

### Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Error Taxonomy  │────>│  SOP Workflow    │────>│  Case Studies    │
│  (4 codes)       │     │  (3 phases)      │     │  (2 annotated)   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

## Features

- KaTeX rendering for all LaTeX formulas (matrices, eigenvalues, proofs)
- Red vs Green comparison panels (AI output vs Expert corrected)
- Hover error tooltips with detailed explanations
- Framer Motion animations on tab transitions
- PDF export via browser print
- Mobile-first responsive design with dark mode
- TypeScript strict (zero `any` types)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| UI | Radix UI (Tabs, Tooltip) |
| Math | KaTeX |
| Animations | Framer Motion |

## Wiki

Comprehensive documentation is available in the [`wiki/`](wiki/) directory:

| Document | Content |
|---|---|
| [Home](wiki/Home.md) | Project overview, problem statement, navigation |
| [Architecture](wiki/Architecture.md) | System design, rendering pipeline, dependency graph |
| [Component Guide](wiki/Component-Guide.md) | API reference for every React component |
| [Data Schema](wiki/Data-Schema.md) | JSON structures for taxonomy and case studies |
| [Deployment](wiki/Deployment.md) | Vercel, GitHub Pages, Netlify deployment guides |
| [Contributing](wiki/Contributing.md) | Conventional commits, adding content, PR checklist |

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # SEO metadata + KaTeX CSS
│   │   ├── page.tsx            # Main dashboard (3 tabs)
│   │   └── globals.css         # Tailwind + KaTeX overrides
│   ├── components/
│   │   ├── math-display/       # KaTeX renderer (inline + block)
│   │   ├── audit-card/         # Before/After comparison
│   │   ├── taxonomy-table/     # Error classification table
│   │   ├── sop-workflow/       # 3-step SOP stepper
│   │   └── ui/error-tooltip.tsx
│   ├── data/
│   │   ├── error-taxonomy.json # 4 error codes
│   │   └── golden-datasets.json # 2 case studies
│   └── lib/utils.ts
├── .github/workflows/ci.yml    # GitHub Actions CI
├── wiki/                       # Project wiki
├── README.md
└── package.json
```

## Deployment

### Vercel (1-Click)

1. Push to GitHub
2. [vercel.com/new](https://vercel.com/new) -> import repo -> Deploy

### GitHub Pages

Add `output: "export"` to `next.config.mjs`, then `npm run build` deploys to `out/`.

See [wiki/Deployment.md](wiki/Deployment.md) for detailed instructions.

## CI/CD

This project includes a GitHub Actions workflow that runs on every push and PR:

- ESLint (`npm run lint`)
- TypeScript check (`tsc --noEmit`)
- Production build (`npm run build`)

## License

MIT
