-- MVP check-in RPC.
-- Validates the user's linked gym server-side with PostGIS before writing checkins.

create or replace function public.confirm_checkin(
  p_lat double precision,
  p_lng double precision,
  p_arrived_at timestamptz default now()
)
returns table (
  checkin_id uuid,
  gym_id uuid,
  gym_name text,
  distance_m double precision,
  battle_day date,
  arrived_at timestamptz,
  confirmed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  requester uuid := auth.uid();
  profile_gym_id uuid;
  gym_row public.gyms%rowtype;
  user_geog geography(point, 4326);
  measured_distance double precision;
  day_key date := (now() at time zone 'America/Sao_Paulo')::date;
  written_checkin public.checkins%rowtype;
begin
  if requester is null then
    raise exception 'not_authenticated';
  end if;

  if p_lat is null or p_lng is null then
    raise exception 'missing_coordinates';
  end if;

  select p.gym_id into profile_gym_id
  from public.profiles p
  where p.id = requester;

  if profile_gym_id is null then
    raise exception 'gym_not_linked';
  end if;

  select * into gym_row
  from public.gyms
  where id = profile_gym_id;

  if not found then
    raise exception 'gym_not_found';
  end if;

  user_geog := st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography;
  measured_distance := st_distance(user_geog, gym_row.geog);

  if measured_distance > 100 then
    raise exception 'outside_gym_radius: % meters', round(measured_distance::numeric, 1);
  end if;

  insert into public.checkins (
    user_id,
    gym_id,
    battle_day,
    arrived_at,
    confirmed_at,
    lat,
    lng,
    is_suspicious
  )
  values (
    requester,
    profile_gym_id,
    day_key,
    p_arrived_at,
    now(),
    p_lat,
    p_lng,
    false
  )
  on conflict (user_id, battle_day) do update
  set
    confirmed_at = coalesce(public.checkins.confirmed_at, excluded.confirmed_at),
    lat = excluded.lat,
    lng = excluded.lng
  returning * into written_checkin;

  return query
  select
    written_checkin.id,
    gym_row.id,
    gym_row.name,
    measured_distance,
    written_checkin.battle_day,
    written_checkin.arrived_at,
    written_checkin.confirmed_at;
end;
$$;

grant execute on function public.confirm_checkin(double precision, double precision, timestamptz) to authenticated;
