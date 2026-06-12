<h1 align="center">Meetup Softball Stats</h1>

<p align="center">
  Stats and box scores for the
  <a href="https://www.meetup.com/san-francisco-softball-players/">San Francisco Softball Meetup</a>
  weekly pickup games.
</p>

Anyone can browse player stats, game box scores, and leaderboards. Admins sign in to manage the
roster, create games, and enter stats in a spreadsheet-style grid.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript, Tailwind CSS) — deployed on Vercel
- [Supabase](https://supabase.com/) — Postgres database + auth, with row-level security
  (public read, admin-only writes)
- [TanStack Table](https://tanstack.com/table) for the sortable stats table
- [Vitest](https://vitest.dev/) for the derived-stats unit tests

> **Note:** The original goal of pulling players/events from the Meetup API was dropped —
> Meetup now requires a paid Pro subscription for API access. Rosters and games are managed
> in-app instead.

## Local development

Prereqs: Node 20+, Docker (for local Supabase).

```bash
npm install

# Start the local Supabase stack (Postgres, auth, API)
npx supabase start
```

`supabase start` prints an **API URL** and **anon key**. Put them in `.env.local`:

```bash
cp .env.example .env.local
# then edit .env.local with the printed values
```

Apply the schema and seed data (roster + a local-only admin account):

```bash
npx supabase db reset
```

Then run the dev server:

```bash
npm run dev
```

- Site: http://localhost:3000
- Local admin login: `admin@example.com` / `password123` (seeded for local dev only)
- Supabase Studio (DB browser): http://localhost:54323

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm test` | Run unit tests (vitest) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier on `src/` |
| `npx supabase db reset` | Recreate local DB from migrations + seed |

## Deploying

1. **Supabase**: create a project at [supabase.com](https://supabase.com), then link and push the schema:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
2. **Create your admin user**: in the Supabase dashboard, Authentication → Users → *Add user*
   (email + password, auto-confirm). Then in the SQL editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
   Add the roster the same way, or through the app's admin page once you're signed in.

   ⚠️ Do **not** run `supabase/seed.sql` against production — it creates a demo admin with a
   known password. Seed data is for local development.
3. **Vercel**: import the GitHub repo at [vercel.com](https://vercel.com), and set the
   environment variables from your Supabase project (Project Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Every push to `master` redeploys the site.

## How data is protected

All authorization lives in Postgres row-level security, not in app code: every table is
publicly readable, and writes require the signed-in user to have a row in the `admins` table
(checked by the `is_admin()` SQL function). The Next.js middleware/admin layout only improve
UX — even a clever client can't write without an admin session.
