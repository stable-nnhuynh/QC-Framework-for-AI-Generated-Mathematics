# Data Schema

## Overview

All content data is stored as static JSON files under `src/data/`. This allows content to be edited independently from React code, and enables future migration to a CMS or API.

---

## error-taxonomy.json

**File:** `src/data/error-taxonomy.json`

**Purpose:** Defines the 4 error codes used in the Math Error Taxonomy (MET).

### Schema

```json
[
  {
    "code": "string",       // Unique identifier, e.g. "LOG-01"
    "category": "string",   // Human-readable category name
    "description": "string", // Full description with example
    "severity": "string",   // "High" | "Medium" | "Low"
    "color": "string",      // Hex color code for UI styling
    "icon": "string"        // Icon key: "brain" | "calculator" | "code" | "book-open"
  }
]
```

### Current Entries

| Code | Category | Severity |
|---|---|---|
| LOG-01 | Logical Hallucination | High |
| CAL-02 | Calculation Error | High |
| SYM-03 | LaTeX / Notation | Medium |
| GAP-04 | Pedagogical Gap | Medium |

### How to Add New Error Codes

Add a new object to the array:

```json
{
  "code": "NEW-05",
  "category": "New Category",
  "description": "Description with example.",
  "severity": "Medium",
  "color": "#8b5cf6",
  "icon": "brain"
}
```

The `color` and `icon` fields map directly to the `TaxonomyTable` component's rendering logic.

---

## golden-datasets.json

**File:** `src/data/golden-datasets.json`

**Purpose:** Contains case study data — problem statements, AI raw output with errors, expert corrections, and audit summaries.

### Schema

```json
[
  {
    "id": "string",              // Unique case ID, e.g. "case-001"
    "title": "string",           // Display title
    "topic": "string",           // Full topic classification
    "source": "string",          // Source reference (e.g. "OpenStax...")
    "problem": "string",         // LaTeX problem statement with $...$ and $$...$$
    "aiOutput": {
      "steps": [
        {
          "label": "string",     // Step description
          "math": "string",      // LaTeX expression
          "hasError": boolean,   // true if this step is wrong
          "errorCode": "string", // Error code if hasError
          "errorNote": "string"  // Human-readable explanation
        }
      ],
      "score": number,           // AI's rubric score (0-5)
      "maxScore": number         // Maximum possible score
    },
    "expertOutput": {
      "steps": [
        {
          "label": "string",
          "math": "string"
          // Expert steps NEVER have errors
        }
      ],
      "score": number,           // Expert's score (always max)
      "maxScore": number
    },
    "auditSummary": {
      "errorsFound": ["string"], // Array of error codes
      "rootCause": "string",     // Detailed analysis
      "impact": "string"         // Consequence description
    }
  }
]
```

### Current Case Studies

| ID | Title | AI Score | Errors |
|---|---|---|---|
| case-001 | Eigenvalues of a 2x2 Matrix | 2/5 | CAL-02 |
| case-002 | Subspace Verification & Basis | 2/5 | GAP-04, CAL-02 |

### How to Add New Case Studies

1. Add a new object to the top-level array
2. Ensure `id` is unique (format: `case-NNN`)
3. The `problem` field supports mixed text + LaTeX:
   ```
   "Let $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$. Find eigenvalues."
   ```
   - Use `\\` for literal backslashes in JSON strings
   - Use `\\\\` for LaTeX `\\` line breaks inside matrices
4. AI steps can have `hasError: true` with `errorCode` and `errorNote`
5. Expert steps should be complete and correct

### LaTeX Escaping in JSON

Because JSON uses `\` as an escape character, LaTeX commands need double-escaping:

| LaTeX | In JSON string |
|---|---|
| `\lambda` | `\\lambda` |
| `\begin{pmatrix}` | `\\begin{pmatrix}` |
| `\\` (matrix row break) | `\\\\` |
| `$\det(A)$` | `$\\det(A)$` |

---

## Type Safety

Both JSON files are imported with `resolveJsonModule: true` in `tsconfig.json`, enabling full TypeScript autocomplete and type checking:

```ts
import errorTaxonomy from "@/data/error-taxonomy.json";
// errorTaxonomy is typed as ErrorItem[]

import goldenDatasets from "@/data/golden-datasets.json";
// goldenDatasets is typed as CaseStudy[]
```

TypeScript will flag:
- Missing required fields
- Wrong types (e.g., `score: "five"` instead of `score: 5`)
- Invalid enum values (though severity is still `string` — could be improved to a union type)
