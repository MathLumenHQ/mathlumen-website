create table if not exists public.request_rate_limits (
  key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index if not exists request_rate_limits_reset_at_idx
  on public.request_rate_limits(reset_at);
