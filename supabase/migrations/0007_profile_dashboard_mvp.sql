-- MVP profile dashboard RPC.

create or replace function public.get_profile_dashboard()
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  gym_id uuid,
  gym_name text,
  created_at timestamptz,
  wins bigint,
  losses bigint,
  total_battles bigint,
  win_rate numeric,
  checkins_total bigint,
  current_streak int,
  best_streak int,
  rank_position bigint,
  recent_battles jsonb
)
language sql
security definer
set search_path = public
stable
as $$
  with me as (
    select
      p.id,
      p.display_name,
      p.avatar_url,
      p.gym_id,
      g.name as gym_name,
      p.created_at
    from public.profiles p
    left join public.gyms g on g.id = p.gym_id
    where p.id = auth.uid()
  ),
  battle_stats as (
    select
      me.id as user_id,
      count(*) filter (where b.status = 'finished' and bp.status = 'winner') as wins,
      count(*) filter (where b.status = 'finished' and bp.status = 'eliminated') as losses
    from me
    left join public.battle_participants bp on bp.user_id = me.id
    left join public.battles b on b.id = bp.battle_id
    group by me.id
  ),
  confirmed_checkins as (
    select distinct c.battle_day
    from public.checkins c
    join me on me.id = c.user_id
    where c.confirmed_at is not null
  ),
  checkin_stats as (
    select count(*) as checkins_total
    from confirmed_checkins
  ),
  streak_scan as (
    select
      offset_day,
      (((now() at time zone 'America/Sao_Paulo')::date - offset_day)::date) as day_key
    from generate_series(0, 365) as offset_day
  ),
  current_streak_calc as (
    select
      coalesce(
        min(offset_day) filter (where cc.battle_day is null),
        366
      )::int as current_streak
    from streak_scan ss
    left join confirmed_checkins cc on cc.battle_day = ss.day_key
  ),
  streak_groups as (
    select
      battle_day,
      battle_day - (row_number() over (order by battle_day))::int as streak_group
    from confirmed_checkins
  ),
  best_streak_calc as (
    select coalesce(max(streak_len), 0)::int as best_streak
    from (
      select count(*)::int as streak_len
      from streak_groups
      group by streak_group
    ) streaks
  ),
  ranking as (
    select lir.user_id, lir.rank_position
    from public.list_individual_rankings(null, 0) lir
    join me on me.id = lir.user_id
  ),
  recent as (
    select
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'battle_id', b.id,
            'battle_status', b.status,
            'type', b.type,
            'duration_days', b.duration_days,
            'result', case
              when b.status <> 'finished' then 'active'
              when bp.status = 'winner' then 'win'
              else 'loss'
            end,
            'opponent_name', opponent_profile.display_name,
            'opponent_hp', opponent.hp_current,
            'my_hp', bp.hp_current,
            'created_at', b.created_at,
            'ended_at', b.ends_at
          )
          order by b.created_at desc
        ) filter (where b.id is not null),
        '[]'::jsonb
      ) as recent_battles
    from me
    left join public.battle_participants bp on bp.user_id = me.id
    left join public.battles b on b.id = bp.battle_id
    left join public.battle_participants opponent
      on opponent.battle_id = b.id
      and opponent.user_id <> me.id
    left join public.profiles opponent_profile on opponent_profile.id = opponent.user_id
  )
  select
    me.id as user_id,
    me.display_name,
    me.avatar_url,
    me.gym_id,
    me.gym_name,
    me.created_at,
    bs.wins,
    bs.losses,
    (bs.wins + bs.losses) as total_battles,
    case
      when (bs.wins + bs.losses) = 0 then 0::numeric
      else round((bs.wins::numeric / (bs.wins + bs.losses)::numeric) * 100, 1)
    end as win_rate,
    cs.checkins_total,
    csc.current_streak,
    bsc.best_streak,
    ranking.rank_position,
    recent.recent_battles
  from me
  cross join battle_stats bs
  cross join checkin_stats cs
  cross join current_streak_calc csc
  cross join best_streak_calc bsc
  cross join recent
  left join ranking on ranking.user_id = me.id;
$$;

grant execute on function public.get_profile_dashboard() to authenticated;
