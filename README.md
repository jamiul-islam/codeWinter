# codeWinter ❄️

CodeWinter is An AI‑powered PRD generator for your coding agents. This repo hosts the web client and Supabase integration scaffolding used to generate feature graphs and PRDs.

## Stack Overview

- Next.js 15 (App Router, Turbopack dev/build)
- TypeScript, Tailwind CSS (v4 preview)
- Zustand state management with middleware utilities
- Supabase client (auth, database, storage) prepared for SSR/Edge usage
- React Flow for the architecture graph experience
- `react-markdown` + `remark-gfm` for PRD rendering

## Development

```bash
npm install       # installs dependencies
npm run dev       # starts the Turbopack dev server on http://localhost:3000
npm run build     # builds the production bundle
npm run start     # serves the production bundle

npm run lint      # Next.js lint rules
npm run typecheck # TypeScript project check
npm run format    # Prettier write
npm run format:check # Prettier check (CI / pre-commit)
```

### Commit Workflow

- Husky + lint-staged enforce ESLint and Prettier on staged files before commit.
- Format or lint manually with the scripts above if the hook blocks your commit.

## Environment Variables

Copy `.env.example` to `.env.local` and populate with project-specific credentials:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_KEY` for encrypting stored Gemini API keys
- `GEMINI_API_KEY` placeholder for local dev
- `RATE_LIMIT_REDIS_URL` if rate limiting is enabled

## Project Structure Highlights

```
web/
├─ src/
│  ├─ app/               # App Router entry points
│  ├─ components/        # UI building blocks (graph, PRD preview, etc.)
│  ├─ lib/
│  │  ├─ supabase/       # SSR/browser Supabase clients & helpers
│  │  └─ store/          # Zustand stores and slices
│  └─ styles/            # Tailwind layer configuration
├─ public/               # Static assets
└─ .husky/               # Git hooks
```

---
