-- Roster carried over from the original site (src/utils/Utils.js).
insert into public.players (name) values
  ('Vien'),
  ('Mike'),
  ('Steven'),
  ('Cory'),
  ('John'),
  ('Jason'),
  ('Wynn'),
  ('Al'),
  ('Carlos'),
  ('Cameron'),
  ('Efrain'),
  ('Kevin H'),
  ('Kevin A'),
  ('Dale'),
  ('James'),
  ('Brendan'),
  ('Eli'),
  ('Hector')
on conflict (name) do nothing;

-- Local-development admin user (email: admin@example.com, password: password123).
-- Hosted projects should create admins through the Supabase dashboard instead.
-- The token columns must be '' rather than NULL or GoTrue fails to
-- read the user ("Database error querying schema").
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token,
  email_change, email_change_token_new, email_change_token_current
) values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated', 'admin@example.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}', '{}',
  '', '', '', '', ''
) on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) values (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub":"11111111-1111-1111-1111-111111111111","email":"admin@example.com"}',
  'email', now(), now(), now()
) on conflict do nothing;

insert into public.admins (user_id)
values ('11111111-1111-1111-1111-111111111111')
on conflict do nothing;
