-- Core schema: players, games, stat_lines, admins.
-- Public read access; writes restricted to members of the admins table.

create table public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  nickname text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  game_number int not null unique,
  played_on date not null,
  location text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.stat_lines (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  singles int not null default 0 check (singles >= 0),
  doubles int not null default 0 check (doubles >= 0),
  triples int not null default 0 check (triples >= 0),
  hr int not null default 0 check (hr >= 0),
  rbi int not null default 0 check (rbi >= 0),
  runs int not null default 0 check (runs >= 0),
  bb int not null default 0 check (bb >= 0),
  k int not null default 0 check (k >= 0),
  sb int not null default 0 check (sb >= 0),
  cs int not null default 0 check (cs >= 0),
  outs int not null default 0 check (outs >= 0),
  unique (game_id, player_id)
);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.players enable row level security;
alter table public.games enable row level security;
alter table public.stat_lines enable row level security;
alter table public.admins enable row level security;

-- security definer so RLS on admins doesn't block the check itself
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

create policy "Public read players" on public.players
  for select using (true);
create policy "Admins write players" on public.players
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read games" on public.games
  for select using (true);
create policy "Admins write games" on public.games
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read stat_lines" on public.stat_lines
  for select using (true);
create policy "Admins write stat_lines" on public.stat_lines
  for all using (public.is_admin()) with check (public.is_admin());

-- Admins can see the admin list; rows are added via the Supabase dashboard
-- (or SQL editor), not through the app.
create policy "Admins read admins" on public.admins
  for select using (public.is_admin());
