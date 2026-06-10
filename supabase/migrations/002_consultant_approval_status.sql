alter table public.profiles
add column if not exists status text;

update public.profiles
set status = case
  when role = 'owner' then 'active'
  when active = true then 'active'
  else 'inactive'
end
where status is null;

alter table public.profiles
alter column status set default 'pending';

alter table public.profiles
alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_status_check'
  ) then
    alter table public.profiles
    add constraint profiles_status_check
    check (status in ('pending', 'active', 'inactive', 'deleted'));
  end if;
end
$$;

alter table public.access_logs
drop constraint if exists access_logs_event_type_check;

alter table public.access_logs
add constraint access_logs_event_type_check
check (
  event_type in (
    'consultant_created', 'consultant_registered', 'consultant_approved',
    'consultant_disabled', 'consultant_enabled', 'consultant_deleted',
    'access_created', 'access_revoked', 'pin_success', 'pin_failed',
    'pin_locked', 'pin_expired', 'viewer_session_created'
  )
);

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and active = true
    and status = 'active';
$$;

-- Esta migración conserva perfiles, accesos y logs históricos.
-- El borrado de consultores es una baja lógica ejecutada server-side.
