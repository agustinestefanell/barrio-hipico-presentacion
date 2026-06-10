alter table public.access_logs
drop constraint if exists access_logs_event_type_check;

alter table public.access_logs
add constraint access_logs_event_type_check
check (
  event_type in (
    'consultant_created', 'consultant_registered', 'consultant_approved',
    'consultant_disabled', 'consultant_enabled', 'consultant_deleted',
    'access_created', 'access_revoked', 'pin_success', 'pin_failed',
    'pin_locked', 'pin_expired', 'viewer_session_created',
    'consultant_password_recovery_sent', 'consultant_temp_password_set'
  )
);
