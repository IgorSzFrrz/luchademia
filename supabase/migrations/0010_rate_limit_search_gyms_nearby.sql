-- Server-side quota for the Google Places-backed gym search Edge Function.

create table if not exists public.edge_function_rate_limits (
  function_name text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  window_start timestamptz not null,
  request_count int not null check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (function_name, user_id)
);

alter table public.edge_function_rate_limits enable row level security;

revoke all on table public.edge_function_rate_limits from public;
revoke all on table public.edge_function_rate_limits from anon;
revoke all on table public.edge_function_rate_limits from authenticated;

create or replace function public.consume_search_gyms_nearby_quota(
  p_window_seconds int default 3600,
  p_max_requests int default 30
)
returns table (
  allowed boolean,
  remaining int,
  reset_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  requester uuid := auth.uid();
  safe_window_seconds int := least(greatest(coalesce(p_window_seconds, 3600), 60), 86400);
  safe_max_requests int := least(greatest(coalesce(p_max_requests, 30), 1), 1000);
  current_window_start timestamptz;
  current_count int;
begin
  if requester is null then
    raise exception 'not_authenticated';
  end if;

  current_window_start := to_timestamp(
    floor(extract(epoch from now()) / safe_window_seconds) * safe_window_seconds
  );

  insert into public.edge_function_rate_limits (
    function_name,
    user_id,
    window_start,
    request_count,
    updated_at
  )
  values (
    'search-gyms-nearby',
    requester,
    current_window_start,
    1,
    now()
  )
  on conflict (function_name, user_id) do update
  set
    window_start = case
      when edge_function_rate_limits.window_start < current_window_start
        then excluded.window_start
      else edge_function_rate_limits.window_start
    end,
    request_count = case
      when edge_function_rate_limits.window_start < current_window_start
        then 1
      else edge_function_rate_limits.request_count + 1
    end,
    updated_at = now()
  returning request_count into current_count;

  return query
  select
    current_count <= safe_max_requests,
    greatest(safe_max_requests - current_count, 0),
    current_window_start + make_interval(secs => safe_window_seconds);
end;
$$;

revoke all on function public.consume_search_gyms_nearby_quota(int, int) from public;
revoke all on function public.consume_search_gyms_nearby_quota(int, int) from anon;
grant execute on function public.consume_search_gyms_nearby_quota(int, int) to authenticated;
