# LaTeX Coding Standard for MathGPT Quality Assurance

**Document ID:** LCS-2024-001
**Version:** 1.0
**Author:** Huynh — Mathematics Content Specialist
**Scope:** All AI-generated and Expert-reviewed mathematical content for MathGPT.ai

---

## 1. General Principles

1. **Readability over brevity.** LaTeX source code must be readable by non-expert reviewers.
2. **Consistency within a single solution.** Never mix notation styles mid-solution.
3. **Render-safe output.** Every LaTeX expression must compile without errors in KaTeX and MathJax.
4. **OpenStax alignment.** Notation must match the conventions used in OpenStax textbooks.

---

## 2. Inline vs. Display Math

| Context | Mode | Syntax |
|---|---|---|
| Short expressions within a sentence ($x = 5$, $\lambda_1$) | Inline | `$...$` |
| Equations that are referenced or multi-term | Display | `$$...$$` |
| Multi-step derivations | Aligned Display | `$$\begin{aligned}...\end{aligned}$$` |

**Rule:** Any expression containing fractions, summations, integrals, or matrices **must** use display mode.

**Anti-pattern:**
```
The eigenvalues are found by solving $\det(A - \lambda I) = \lambda^2 - 5\lambda + 6 = (\lambda - 2)(\lambda - 3) = 0$
```

**Correct pattern:**
```
The eigenvalues are found by solving:
$$\det(A - \lambda I) = \lambda^2 - 5\lambda + 6 = (\lambda - 2)(\lambda - 3) = 0$$
```

---

## 3. Matrix Notation

### 3.1 Standard Matrix Environments

Use `pmatrix` for general matrices and `bmatrix` for augmented/coefficient matrices:

```latex
$$A = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix}$$
```

```latex
$$\left[\begin{array}{cc|c} 1 & 2 & 3 \\ 4 & 5 & 6 \end{array}\right]$$
```

### 3.2 Naming Conventions

| Symbol | Usage | Example |
|---|---|---|
| $A, B, C$ | Matrices (uppercase bold or italic) | $A \in \mathbb{R}^{m \times n}$ |
| $\mathbf{v}, \mathbf{u}, \mathbf{w}$ | Vectors (lowercase bold) | $\mathbf{v} \in \mathbb{R}^n$ |
| $\lambda, \mu$ | Eigenvalues | $\lambda_1, \lambda_2, \ldots$ |
| $I_n$ | Identity matrix of size $n$ | $I_3$ |
| $\mathbf{0}$ | Zero vector/matrix | Context-dependent |

### 3.3 Forbidden Patterns

- Do **not** use `\matrix` (deprecated).
- Do **not** use `array` environment for standard matrices — use `pmatrix` or `bmatrix`.
- Do **not** omit subscripts when multiple eigenvalues/eigenvectors exist.

---

## 4. Equation Alignment

For multi-step solutions, use the `aligned` environment with alignment at the `=` sign:

```latex
$$\begin{aligned}
\det(A - \lambda I) &= \det\begin{pmatrix} 1-\lambda & 2 \\ 3 & 4-\lambda \end{pmatrix} \\
&= (1-\lambda)(4-\lambda) - (2)(3) \\
&= \lambda^2 - 5\lambda + 4 - 6 \\
&= \lambda^2 - 5\lambda - 2
\end{aligned}$$
```

**Rules:**
- Align at the `&=` operator.
- One logical step per line.
- Use `\\` for line breaks — never manual spacing hacks.

---

## 5. Theorem and Definition Formatting

Use the following template for theorems:

```
**Theorem (Name).** *Statement of the theorem in italics.*
```

Example:

```
**Theorem (Rank-Nullity).** *Let $T: V \to W$ be a linear transformation 
where $V$ is a finite-dimensional vector space. Then:*
$$\dim(\ker T) + \dim(\operatorname{im} T) = \dim V$$
```

---

## 6. Operator Formatting

Always use `\operatorname{}` or predefined commands for standard operators:

| Correct | Incorrect |
|---|---|
| `\det(A)` | `det(A)` |
| `\dim(V)` | `dim(V)` |
| `\ker(T)` | `ker(T)` |
| `\operatorname{rank}(A)` | `rank(A)` |
| `\operatorname{null}(A)` | `null(A)` |
| `\operatorname{tr}(A)` | `tr(A)` |
| `\gcd(a, b)` | `gcd(a, b)` |
| `\lim_{x \to a}` | `lim_{x \to a}` |

---

## 7. Solution Structure Template

Every AI-generated solution must follow this structure:

```
### Problem
[Restate the problem clearly]

### Solution

**Step 1: [Step Title]**
[Explanation + Math]

**Step 2: [Step Title]**
[Explanation + Math]

...

**Step N: [Step Title]**
[Explanation + Math]

### Verification
[Substitute back or apply a sanity check to confirm correctness]

### Final Answer
$$\boxed{...}$$
```

---

## 8. Common LaTeX Pitfalls (Quick Reference)

| Issue | Wrong | Correct |
|---|---|---|
| Missing braces in fractions | `\frac a b` | `\frac{a}{b}` |
| No space after text commands | `\text{for all}x` | `\text{for all } x` |
| Wrong delimiter sizing | `(\frac{a}{b})` | `\left(\frac{a}{b}\right)` |
| Plain text in math mode | `$if x > 0$` | `$\text{if } x > 0$` |
| Double subscript | `a_i_j` | `a_{ij}` or `a_{i,j}` |
| Missing `\cdot` for dot product | `u v` | `\mathbf{u} \cdot \mathbf{v}` |

---

## 9. Version Control and Review Tags

When an Expert reviews a solution, they must annotate changes using:

```
<!-- AUDIT: ERR-LOG-001 | Fixed logical hallucination in Step 3 -->
<!-- AUDIT: ERR-NTN-002 | Standardized vector notation to bold lowercase -->
```

This enables automated tracking via the Error Taxonomy CSV pipeline.

---

**End of Document**
