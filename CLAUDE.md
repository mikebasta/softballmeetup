# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stats site for the San Francisco Softball Meetup pickup games. Next.js (App Router, TypeScript,
Tailwind 4) + Supabase (Postgres + auth). Public users browse stats/games/players; admins sign in
to manage the roster, create games, and enter stats. There is **no Meetup.com integration** —
their API requires a paid Pro subscription, so all data is managed in-app.

This is a 2026 rewrite of an abandoned Gatsby 1.x + AWS Amplify app (see git history before the
`rejuvenation` branch if archaeology is needed).

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build
- `npm test` — vitest unit tests; single file: `npx vitest run src/lib/stats.test.ts`
- `npm run lint` — ESLint
- `npx supabase start` / `stop` — local Supabase stack (requires Docker)
- `npx supabase db reset` — recreate local DB from `supabase/migrations/` + `supabase/seed.sql`

Local env: copy `.env.example` to `.env.local` and fill in the API URL + anon key printed by
`supabase start`. Seeded local admin login: `admin@example.com` / `password123`.

## Architecture

**Authorization lives in Postgres RLS, not app code.** All tables are publicly readable; writes
require the signed-in user to have a row in `admins` (checked by the `is_admin()` security-definer
function). The middleware (`src/proxy.ts`) and admin layout only handle UX (redirects/messages) —
never treat them as the security boundary. Schema changes go in new files under
`supabase/migrations/` (never edit applied migrations); `supabase/seed.sql` is local-dev only
(it creates a demo admin with a known password).

**Data model:** `players`, `games`, and `stat_lines` (one row per player per game, unique on
`game_id, player_id`). Only counting stats are stored (`singles, doubles, triples, hr, rbi, runs,
bb, k, sb, cs, outs`); everything derived (H, AB, AVG, OBP, SLG, OPS) is computed in
`src/lib/stats.ts` — keep all stat math there (it's the unit-tested single source of truth;
note: AB = H + outs + k, walks excluded). `src/lib/leaderboard.ts` aggregates lines into
per-player totals rows.

**Data flow:** server components fetch via `src/lib/queries.ts` (uses the server Supabase client
in `src/lib/supabase/server.ts`); pages export `dynamic = 'force-dynamic'` because content changes
with DB writes. Mutations are server actions in `src/app/admin/actions.ts` which run as the
logged-in admin (RLS enforces the write permission) and `revalidatePath` the affected public
pages. The browser Supabase client (`src/lib/supabase/client.ts`) is only used for auth on
`/login`.

**Key UI pieces:** `src/components/StatsTable.tsx` (client, TanStack Table, sortable) for /stats;
`src/components/StatLineTable.tsx` (server-rendered) for box scores and player game logs;
`src/app/admin/games/[id]/StatEntryGrid.tsx` (client) is the spreadsheet-style entry grid — an
all-zero row means "no stats for this game" and deletes any previously saved row on save.

## Gotchas

- Next 16 uses `src/proxy.ts` (default-export `proxy` function), not `middleware.ts`.
- `params` in page components is a Promise — `await` it.
- Empty `stat_lines` rows are never stored; absence of a row = didn't play.
- Deactivated players stay on /stats and in old box scores; they're only hidden from the entry
  grid (unless they already have a line for that game).
