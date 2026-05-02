# QC Framework for AI-Generated Mathematics — Wiki

## Overview

**QC Framework for AI-Generated Mathematics** is an interactive portfolio dashboard built as a personal project to demonstrate expertise in mathematical content quality assurance, error taxonomy design, and expert audit workflows.

The project showcases a production-grade system for auditing, correcting, and benchmarking AI-generated mathematics solutions — from error classification through expert review workflows.

## Quick Navigation

| Page | Description |
|---|---|
| [Architecture](./Architecture) | Technical design, tech stack, and system overview |
| [Component Guide](./Component-Guide) | Detailed documentation of all UI components |
| [Data Schema](./Data-Schema) | Data structures for error taxonomy and case studies |
| [Deployment](./Deployment) | How to build, deploy, and run the project |
| [Contributing](./Contributing) | Guidelines for contributing to this project |

## Problem Statement

Large Language Models (LLMs) are increasingly used to generate step-by-step mathematics solutions. However, AI-generated mathematical content is prone to specific error types:

- **Logical Hallucinations** — fabricating non-existent theorems
- **Calculation Errors** — arithmetic mistakes in intermediate steps
- **Notation Issues** — malformed LaTeX or inconsistent symbol usage
- **Pedagogical Gaps** — skipping critical steps that students need

This project provides a **complete operational framework** to detect, classify, and correct these errors.

## Solution Architecture

The framework consists of three interconnected modules:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Error Taxonomy  │────>│  SOP Workflow    │────>│  Case Studies    │
│  (4 codes)       │     │  (3 phases)      │     │  (2 annotated)   │
│                  │     │                  │     │                  │
│ LOG-01  Halluc. │     │ 1. Audit        │     │ Before / After   │
│ CAL-02  Calc.   │     │ 2. Correct      │     │ Hover tooltips   │
│ SYM-03  Notation│     │ 3. Benchmark    │     │ Score comparison │
│ GAP-04  Pedag.  │     │                 │     │ Audit summary    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

## Key Features

- **Interactive Error Taxonomy** — Clickable table with expandable descriptions for each error code
- **3-Phase SOP Stepper** — Visual checklist: Audit -> Correct & Rewrite -> Benchmark
- **Side-by-Side Comparison** — Red (AI errors) vs Green (Expert corrected) panels
- **Hover Error Tooltips** — Detailed explanations appear when hovering over error tags
- **KaTeX Rendering** — All LaTeX formulas render natively in the browser
- **Framer Motion Animations** — Smooth transitions between tabs and case studies
- **PDF Export** — One-click browser print to PDF report
- **Responsive Design** — Mobile-first with automatic dark mode

## Project Structure

```
mathgpt-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + SEO metadata
│   │   ├── page.tsx            # Main dashboard (3 tabs)
│   │   └── globals.css         # Tailwind + KaTeX overrides
│   ├── components/
│   │   ├── math-display/       # KaTeX renderer
│   │   ├── audit-card/         # Before/After comparison
│   │   ├── taxonomy-table/     # Error classification table
│   │   ├── sop-workflow/       # 3-step SOP stepper
│   │   └── ui/error-tooltip.tsx # Hover tooltip
│   ├── data/
│   │   ├── error-taxonomy.json # 4 error codes
│   │   └── golden-datasets.json # 2 case studies
│   └── lib/utils.ts            # cn() utility
├── .github/workflows/ci.yml    # GitHub Actions CI
├── wiki/                       # This documentation
├── README.md
└── package.json
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode, no `any`) |
| Styling | Tailwind CSS v4 |
| UI Primitives | Radix UI (Tabs, Tooltip) |
| Math Rendering | KaTeX |
| Animations | Framer Motion |
| Utilities | clsx, tailwind-merge |
| CI/CD | GitHub Actions |
