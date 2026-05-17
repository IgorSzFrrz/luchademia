-- MVP battle detail RPC.

create or replace function public.get_1v1_battle_detail(p_battle_id uuid)
returns table (
  battle_id uuid,
  battle_status battle_status,
  duration_days int,
  hp_base int,
  starts_at timestamptz,
  ends_at timestamptz,
  day_window_start_hour int,
  day_window_end_hour int,
  daily_damage_per_hour int,
  pvp_grace_hours int,
  pvp_damage_per_hour int,
  no_show_penalty int,
  my_user_id uuid,
  my_name text,
  my_avatar_url text,
  my_hp int,
  my_status participant_status,
  opponent_user_id uuid,
  opponent_name text,
  opponent_avatar_url text,
  opponent_hp int,
  opponent_status participant_status,
  timeline jsonb
)
language sql
security definer
set search_path = public
stable
as $$
  with authorized as (
    select
      b.*,
      me.id as my_participant_id,
      me.user_id as my_user_id,
      me.hp_current as my_hp,
      me.status as my_status,
      my_profile.display_name as my_name,
      my_profile.avatar_url as my_avatar_url,
      opponent.id as opponent_participant_id,
      opponent.user_id as opponent_user_id,
      opponent.hp_current as opponent_hp,
      opponent.status as opponent_status,
      opponent_profile.display_name as opponent_name,
      opponent_profile.avatar_url as opponent_avatar_url
    from public.battles b
    join public.battle_participants me
      on me.battle_id = b.id
      and me.user_id = auth.uid()
    join public.profiles my_profile on my_profile.id = me.user_id
    left join public.battle_participants opponent
      on opponent.battle_id = b.id
      and opponent.user_id <> me.user_id
    left join public.profiles opponent_profile on opponent_profile.id = opponent.user_id
    where b.id = p_battle_id
      and b.type = '1v1'
  ),
  day_rows as (
    select
      a.id as battle_id,
      days.day_number,
      days.battle_day,
      my_checkin.confirmed_at as my_checkin_at,
      opponent_checkin.confirmed_at as opponent_checkin_at,
      coalesce(my_damage.amount, 0) as my_damage,
      coalesce(opponent_damage.amount, 0) as opponent_damage
    from authorized a
    cross join lateral (
      select
        row_number() over ()::int as day_number,
        day_value::date as battle_day
      from generate_series(
        (a.starts_at at time zone 'America/Sao_Paulo')::date,
        (a.starts_at at time zone 'America/Sao_Paulo')::date + (a.duration_days - 1),
        interval '1 day'
      ) as day_value
    ) days
    left join public.checkins my_checkin
      on my_checkin.user_id = a.my_user_id
      and my_checkin.battle_day = days.battle_day
    left join public.checkins opponent_checkin
      on opponent_checkin.user_id = a.opponent_user_id
      and opponent_checkin.battle_day = days.battle_day
    left join lateral (
      select sum(de.amount)::int as amount
      from public.damage_events de
      where de.battle_id = a.id
        and de.participant_id = a.my_participant_id
        and de.battle_day = days.battle_day
    ) my_damage on true
    left join lateral (
      select sum(de.amount)::int as amount
      from public.damage_events de
      where de.battle_id = a.id
        and de.participant_id = a.opponent_participant_id
        and de.battle_day = days.battle_day
    ) opponent_damage on true
  ),
  timeline_json as (
    select
      dr.battle_id,
      jsonb_agg(
        jsonb_build_object(
          'day_number', dr.day_number,
          'battle_day', dr.battle_day,
          'my_checkin_at', dr.my_checkin_at,
          'opponent_checkin_at', dr.opponent_checkin_at,
          'my_damage', dr.my_damage,
          'opponent_damage', dr.opponent_damage
        )
        order by dr.day_number
      ) as timeline
    from day_rows dr
    group by dr.battle_id
  )
  select
    a.id as battle_id,
    a.status as battle_status,
    a.duration_days,
    a.hp_base,
    a.starts_at,
    a.ends_at,
    a.day_window_start_hour,
    a.day_window_end_hour,
    a.daily_damage_per_hour,
    a.pvp_grace_hours,
    a.pvp_damage_per_hour,
    a.no_show_penalty,
    a.my_user_id,
    a.my_name,
    a.my_avatar_url,
    a.my_hp,
    a.my_status,
    a.opponent_user_id,
    a.opponent_name,
    a.opponent_avatar_url,
    a.opponent_hp,
    a.opponent_status,
    coalesce(t.timeline, '[]'::jsonb) as timeline
  from authorized a
  left join timeline_json t on t.battle_id = a.id;
$$;

grant execute on function public.get_1v1_battle_detail(uuid) to authenticated;
