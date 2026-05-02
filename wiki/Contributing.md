# Contributing

## Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/add-new-case-study
   ```

2. **Make your changes:**
   - Add new error codes to `src/data/error-taxonomy.json`
   - Add new case studies to `src/data/golden-datasets.json`
   - Modify components in `src/components/`

3. **Verify locally:**
   ```bash
   npm run lint          # ESLint
   npx tsc --noEmit      # TypeScript check
   npm run build         # Production build
   ```

4. **Commit with conventional messages:**
   ```bash
   git add .
   git commit -m "feat: add calculus case study (case-003)"
   git commit -m "fix: correct eigenvalue basis vector in case-002"
   git commit -m "docs: update wiki with component API reference"
   ```

5. **Push and create a Pull Request:**
   ```bash
   git push origin feature/add-new-case-study
   ```

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | When to use | Example |
|---|---|---|
| `feat` | New feature or content | `feat: add vector spaces case study` |
| `fix` | Bug fix | `fix: correct basis vector sign in subspace problem` |
| `docs` | Documentation only | `docs: update architecture diagram` |
| `refactor` | Code restructuring (no behavior change) | `refactor: extract score badge component` |
| `style` | Formatting/tweaks | `style: adjust padding on audit cards` |
| `chore` | Maintenance | `chore: update dependencies` |

## Adding New Content

### Adding an Error Code

Edit `src/data/error-taxonomy.json`:

```json
{
  "code": "NEW-05",
  "category": "Domain Error",
  "description": "AI applies a method outside its valid domain.",
  "severity": "High",
  "color": "#dc2626",
  "icon": "brain"
}
```

Available icon keys: `"brain"`, `"calculator"`, `"code"`, `"book-open"`

### Adding a Case Study

Edit `src/data/golden-datasets.json` and add a new object to the array. See [Data Schema](./Data-Schema) for the full structure.

**Important:** When writing LaTeX in JSON strings, remember to double-escape backslashes:

```json
"problem": "Find eigenvalues of $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$."
```

### Adding a New Component

1. Create directory: `src/components/my-feature/index.tsx`
2. Export as a named component
3. Import in `src/app/page.tsx`
4. Add documentation to `wiki/Component-Guide.md`

## Code Style

- **TypeScript strict mode** — no `any` types
- **No unused variables** — ESLint will catch these
- **Component files** — one component per `index.tsx`
- **Naming** — PascalCase for components, camelCase for variables/functions
- **Props** — use interfaces, not inline types
- **Styling** — Tailwind utility classes only, no CSS modules

## Pull Request Checklist

Before submitting a PR:

- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run build` succeeds
- [ ] New components have wiki documentation
- [ ] Data changes are validated (correct JSON structure, escaped LaTeX)
- [ ] PR description explains what changed and why

## Branch Strategy

- `main` — production-ready code, always builds clean
- `feature/*` — new features (case studies, components, wiki pages)
- `fix/*` — bug fixes
- No version tags needed — this is a portfolio project, not a library
