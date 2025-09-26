# codeWinter ❄️ — AGENTS Playbook

## Project Snapshot

- **Product:** AI-powered PRD generator driven by feature graphs.
- **Stack:** Next.js App Router, TypeScript, Tailwind (dark-first), Zustand, Supabase, React Flow, Gemini API.
- **KPI Targets:** First PRD ≤ 3 minutes (p95), ≥80% sessions export ≥1 PRD, PRD generation success ≥98%.

## Source of Truth

- Product requirements: `../code_winter_❄️_prd_v_1.md`
- Execution plan: `../agent-task-checklist.md`
- Scope confirmation: `../docs/scope-alignment.md`
- Repo docs: `README.md`, `.env.local`, `src/lib/env.ts`

Agents must reconcile any new ideas against these documents before implementing changes. When in doubt, capture questions in a shared notes section or inline TODO and flag for the next agent.

## Daily Flow

1. **Sync intent:** Read the PRD section relevant to your task and review unchecked items in the checklist.
2. **Plan:** Break work into sub-steps (small enough to ship in ≤60 minutes).
3. **Implement:** Keep changes scoped to a single checklist item whenever possible.
4. **Validate:** Run `npm run lint`, `npm run typecheck`, and targeted tests before handing off.
5. **Annotate:** Update `agent-task-checklist.md` (mark status, add bullet notes) and record learnings in commit messages.
6. **Handoff:** Summarize what changed, what’s next, and blockers in your final message.

## Coding Conventions

- Use TypeScript everywhere; avoid `any` unless temporarily gating work-in-progress.
- Favor functional React components with explicit prop types.
- Keep components small; lift shared logic into `src/lib/**` or `src/components/**`.
- Tailwind first; only add CSS-in-JS if utility classes become unreadable.
- Align naming with PRD terminology (project, feature, graph, PRD, Gemini key).
- Maintain dark-first styling and confirm contrast ratios meet WCAG AA.

## Supabase & Secrets

- Access Supabase via helpers in `src/lib/supabase/*`.
- Never log secrets; ensure encrypted storage for Gemini keys.
- Add schema/RLS changes through migrations (Supabase CLI or SQL files) and document assumptions.

## Graph & PRD Domain Contracts

- Graph nodes correspond to features (unique `id`, `title`, `status`).
- Edges derived from LLM must be validated; invalid relationships get dropped with audit logging.
- PRDs contain Markdown, summary, and JSON schema; regeneration must soft-delete previous markdown for 7 days.
- Deterministic filenames for downloaded PRDs (`<project>__<feature>.md`).

## Testing Expectations

- Unit tests for validators, stores, and API handlers.
- Integration coverage for Supabase RLS.
- Playwright path: sign-in → project creation → graph render → PRD generation → download.
- Include acceptance criteria from the PRD in automated or manual test notes.

## Collaboration Notes

- Only check items in `agent-task-checklist.md` when fully validated.
- If a task spans multiple sessions, append `- [ ] Follow-up:` bullets with context.
- Document decisions that diverge from the PRD in `docs/` (create `decision-log.md` if needed).
- Use environment validation (`src/lib/env.ts`) to gate features relying on secrets.

## Deployment & Telemetry

- Vercel + Supabase expected. Ensure required env vars exist before pushing.
- Rate limiting and retries are part of the PRD; capture metrics once telemetry is wired.
- Smoke tests after deploy: auth flow → project form → graph view → PRD generation → download.

Let’s keep the vibe high: communicate changes crisply, leave the repo ready for the next agent, and ship PRDs that feel handcrafted yet scalable.
