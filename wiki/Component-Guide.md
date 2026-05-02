# Component Guide

## Component Overview

All components follow a feature-based folder structure: `src/components/<feature>/index.tsx`.

---

## 1. MathDisplay

**Path:** `src/components/math-display/index.tsx`

Renders a single LaTeX expression using KaTeX.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `math` | `string` | required | LaTeX string (without `$...$` delimiters) |
| `display` | `boolean` | `false` | Use display mode for larger, centered rendering |
| `className` | `string` | `""` | Additional CSS classes |

### Example

```tsx
import { MathDisplay } from "@/components/math-display";

// Inline mode
<MathDisplay math="\lambda^2 - 7\lambda + 10 = 0" />

// Display mode (centered, larger)
<MathDisplay math="\lambda^2 - 7\lambda + 10 = 0" display />
```

### How It Works

- Uses `useRef` to get a DOM element
- `useEffect` calls `katex.render()` on mount and when `math` changes
- `throwOnError: false` prevents crashes on invalid LaTeX — falls back to plain text
- `strict: false` allows relaxed KaTeX parsing

---

## 2. MathBlock

**Path:** `src/components/math-display/index.tsx`

Renders a block of text with mixed inline and display LaTeX.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `string` | required | Text with `$...$` and `$$...$$` delimiters |
| `className` | `string` | `""` | Additional CSS classes |

### Example

```tsx
import { MathBlock } from "@/components/math-display";

<MathBlock
  content="Let $A$ be a matrix. Then:
$$\det(A - \lambda I) = 0$$
The eigenvalues are $\lambda_1$ and $\lambda_2$."
/>
```

### How It Works

- Splits content by regex: `/(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/g`
- Iterates parts: display math (`$$..$$`) gets `<div>` with `displayMode: true`, inline math (`$..$`) gets `<span>` with `displayMode: false`, text gets plain `<span>`
- Uses `dangerouslySetInnerHTML` alternative: manual DOM manipulation with `document.createElement`

---

## 3. TaxonomyTable

**Path:** `src/components/taxonomy-table/index.tsx`

Interactive table displaying error codes with expandable detail rows.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ErrorItem[]` | required | Array of error taxonomy entries |

### Data Shape (ErrorItem)

```ts
interface ErrorItem {
  code: string;       // "CAL-02"
  category: string;   // "Calculation Error"
  description: string; // Full description
  severity: string;   // "High" | "Medium" | "Low"
  color: string;      // "#ef4444"
  icon: string;       // "brain" | "calculator" | "code" | "book-open"
}
```

### Behavior

- Each row is a clickable button
- Clicking toggles the expanded description panel
- Framer Motion animates row entrance (staggered by index) and expansion height
- Color-coded severity badges

---

## 4. AuditCard

**Path:** `src/components/audit-card/index.tsx`

Side-by-side comparison of AI output vs. expert correction.

### Props

| Prop | Type | Description |
|---|---|---|
| `aiSteps` | `Step[]` | Array of AI solution steps (some flagged with errors) |
| `expertSteps` | `Step[]` | Array of corrected expert steps |
| `aiScore` | `number` | AI's rubric score (0-5) |
| `expertScore` | `number` | Expert's rubric score (0-5) |
| `maxScore` | `number` | Maximum possible score |
| `auditSummary` | `AuditSummary` | Errors found, root cause, impact analysis |

### Step Shape

```ts
interface Step {
  label: string;          // "Characteristic Equation"
  math: string;           // "\det(A - \lambda I) = 0"
  hasError?: boolean;     // true if this step contains an error
  errorCode?: string;     // "CAL-02"
  errorNote?: string;     // Human-readable explanation
}
```

### Visual Features

- **Red panel** — AI output with error-highlighted steps
- **Green panel** — Expert corrected version
- **Animated score bars** — Fills proportionally to score/maxScore
- **ErrorTooltip** — Hover over `[CAL-02]` tag for explanation
- **Audit Summary** — Root cause and impact analysis at bottom

---

## 5. SOPWorkflow

**Path:** `src/components/sop-workflow/index.tsx`

3-step interactive stepper with checklists.

### Props

| Prop | Type | Description |
|---|---|---|
| `activeStep` | `number` | Currently visible step (1, 2, or 3) |
| `onStepClick` | `(step: number) => void` | Callback when user clicks a step |

### Steps

| Step | Title | Focus |
|---|---|---|
| 1 | Audit | Cross-reference with textbook, trace logic |
| 2 | Correct & Rewrite | Fix errors, optimize LaTeX and pedagogy |
| 3 | Benchmark | Score on 5-point rubric |

### Visual Features

- Stepper pills with completed/in-progress/upcoming states
- Checkmark icons on completed steps
- Animated checklist items stagger in
- Hover highlights on checkbox rows

---

## 6. ErrorTooltip

**Path:** `src/components/ui/error-tooltip.tsx`

Radix Tooltip wrapper for error code tags.

### Props

| Prop | Type | Description |
|---|---|---|
| `code` | `string` | Error code string (e.g., "CAL-02") |
| `note` | `string` | Detailed explanation shown in tooltip |

### Behavior

- Renders a red pill-shaped button with the error code
- On hover (or focus): shows a dark tooltip with code and note
- `delayDuration: 200ms` prevents accidental triggers
- Uses Radix Portal for correct z-index stacking

---

## Styling Conventions

| Convention | Example |
|---|---|
| Dark mode | `bg-white dark:bg-zinc-900` |
| Responsive text | `text-sm sm:text-base` |
| Hover states | `hover:bg-zinc-200 dark:hover:bg-zinc-700` |
| Focus rings | Implicit via Radix UI accessibility |
| Color semantic | Red=error, Green=success, Blue=info, Amber=warning |
| Border | `border-zinc-200 dark:border-zinc-800` |
| Rounded corners | `rounded-xl` for cards, `rounded-lg` for inner blocks |
