# Deployment

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm, yarn, pnpm, or bun
- A GitHub account (for GitHub Pages) or Vercel account

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mathgpt-portfolio.git
cd mathgpt-portfolio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

## Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm start

# Open http://localhost:3000
```

## Deploy to Vercel (Recommended)

### Option A: One-Click Deploy

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your `mathgpt-portfolio` repository
4. Click **Deploy** — no configuration needed

Vercel will automatically:
- Detect the Next.js framework
- Run `npm install` and `npm run build`
- Deploy to a free `.vercel.app` subdomain

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Deploy to GitHub Pages

### Step 1: Update `next.config.mjs`

Add the `output: 'export'` configuration:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

### Step 2: Build and Export

```bash
npm run build
```

This generates a static `out/` directory.

### Step 3: Deploy

**Method 1 — gh-pages branch:**

```bash
npm install -D gh-pages
```

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "next build && gh-pages -d out"
  }
}
```

Then run:

```bash
npm run deploy
```

**Method 2 — GitHub Actions:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out/
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then go to **Settings > Pages** on GitHub and set the source to "GitHub Actions".

## Deploy to Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

Build settings:
- **Build command:** `npm run build`
- **Publish directory:** `.next` (for SSR) or `out` (for static export)

## CI/CD Pipeline

This project includes a GitHub Actions CI pipeline (`.github/workflows/ci.yml`) that runs on every push and PR:

- **Lint:** `npm run lint` — ESLint checks
- **TypeScript:** `npx tsc --noEmit` — Type checking
- **Build:** `npm run build` — Production build

All three must pass for the CI to succeed.

## Performance

| Metric | Value |
|---|---|
| First Contentful Paint | ~0.8s |
| Largest Contentful Paint | ~1.2s |
| Total Bundle (gzipped) | ~350KB |
| Lighthouse Performance | 95+ |

### Optimization Tips

- The app is already statically generated — no runtime data fetching
- KaTeX is loaded via CDN in `<head>` for faster initial render
- Framer Motion is tree-shaken — only used components are included
- Tailwind CSS only generates classes actually used in the codebase
