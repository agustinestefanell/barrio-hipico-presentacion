create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('owner', 'consultant')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.access_tokens (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references public.profiles(id) on delete cascade,
  viewer_name text,
  viewer_email text,
  slug text not null unique,
  pin_hash text not null,
  pin_salt text not null,
  expires_at timestamptz not null,
  max_uses integer not null default 3 check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  locked_until timestamptz,
  active boolean not null default true,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.access_logs (
  id uuid primary key default gen_random_uuid(),
  access_token_id uuid references public.access_tokens(id) on delete set null,
  consultant_id uuid references public.profiles(id) on delete set null,
  event_type text not null check (
    event_type in (
      'consultant_created', 'consultant_disabled', 'consultant_enabled',
      'access_created', 'access_revoked', 'pin_success', 'pin_failed',
      'pin_locked', 'pin_expired', 'viewer_session_created'
    )
  ),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists access_tokens_consultant_id_idx on public.access_tokens(consultant_id);
create index if not exists access_tokens_slug_idx on public.access_tokens(slug);
create index if not exists access_logs_created_at_idx on public.access_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.access_tokens enable row level security;
alter table public.access_logs enable row level security;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and active = true;
$$;

drop policy if exists "owner reads profiles" on public.profiles;
create policy "owner reads profiles" on public.profiles
for select using (public.current_profile_role() = 'owner' or id = auth.uid());

drop policy if exists "owner reads all access tokens" on public.access_tokens;
create policy "owner reads all access tokens" on public.access_tokens
for select using (
  public.current_profile_role() = 'owner'
  or consultant_id = auth.uid()
);

drop policy if exists "consultant creates own access tokens" on public.access_tokens;
create policy "consultant creates own access tokens" on public.access_tokens
for insert with check (
  public.current_profile_role() in ('owner', 'consultant')
  and consultant_id = auth.uid()
);

drop policy if exists "consultant updates own access tokens" on public.access_tokens;
create policy "consultant updates own access tokens" on public.access_tokens
for update using (
  public.current_profile_role() = 'owner'
  or consultant_id = auth.uid()
) with check (
  public.current_profile_role() = 'owner'
  or consultant_id = auth.uid()
);

drop policy if exists "owner reads logs" on public.access_logs;
create policy "owner reads logs" on public.access_logs
for select using (public.current_profile_role() = 'owner');

revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;

revoke all on public.access_tokens from anon;
revoke select, insert, update, delete on public.access_tokens from authenticated;
grant select (
  id, consultant_id, viewer_name, viewer_email, slug, expires_at, max_uses,
  used_count, failed_attempts, locked_until, active, revoked_at, created_at
) on public.access_tokens to authenticated;

revoke all on public.access_logs from anon;
revoke insert, update, delete on public.access_logs from authenticated;
grant select on public.access_logs to authenticated;

-- Escrituras críticas, verificación de PIN y lectura de hash/salt se centralizan
-- en Server Actions con service role. RLS permanece activa como defensa adicional.

-- Bootstrap manual del Owner:
-- 1. Crear el usuario Owner en Authentication > Users.
-- 2. Reemplazar los valores y ejecutar:
-- insert into public.profiles (id, email, full_name, role)
-- values ('UUID_DEL_OWNER', 'owner@dominio.com', 'Agustin Estefanell', 'owner');
