-- MVP daily damage job and individual ranking RPC.
-- The processing function is idempotent per battle/day via battle_day_processes.

create table if not exists public.battle_day_processes (
  battle_id uuid not null references public.battles(id) on delete cascade,
  battle_day date not null,
  processed_at timestamptz not null default now(),
  primary key (battle_id, battle_day)
);

alter table public.battle_day_processes enable row level security;

create policy "bdp_select_battle_members" on public.battle_day_processes for select using (
  exists (
    select 1
    from public.battle_participants me
    where me.battle_id = battle_day_processes.battle_id
      and me.user_id = auth.uid()
  )
);

create or replace function public.apply_daily_battle_damage(
  p_battle_day date default ((now() at time zone 'America/Sao_Paulo')::date - 1)
)
returns table (
  processed_battles int,
  damage_events_created int,
  participants_eliminated int,
  battles_finished int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  battle_row public.battles%rowtype;
  target_row public.battle_participants%rowtype;
  attacker_row public.battle_participants%rowtype;
  target_checkin public.checkins%rowtype;
  attacker_checkin public.checkins%rowtype;
  window_start timestamptz;
  window_end timestamptz;
  target_stop timestamptz;
  grace_end timestamptz;
  damage_amount int;
  active_count int;
  created_count int := 0;
  eliminated_count int := 0;
  processed_count int := 0;
  finished_count int := 0;
  winner_participant_id uuid;
begin
  for battle_row in
    select *
    from public.battles b
    where b.status = 'active'
      and p_battle_day >= (b.starts_at at time zone 'America/Sao_Paulo')::date
      and p_battle_day < (b.ends_at at time zone 'America/Sao_Paulo')::date
    order by b.starts_at, b.id
  loop
    insert into public.battle_day_processes (battle_id, battle_day)
    values (battle_row.id, p_battle_day)
    on conflict do nothing;

    if not found then
      continue;
    end if;

    processed_count := processed_count + 1;
    window_start := ((p_battle_day::timestamp + make_interval(hours => battle_row.day_window_start_hour)) at time zone 'America/Sao_Paulo');
    window_end := ((p_battle_day::timestamp + make_interval(hours => battle_row.day_window_end_hour)) at time zone 'America/Sao_Paulo');

    for target_row in
      select *
      from public.battle_participants bp
      where bp.battle_id = battle_row.id
        and bp.status = 'alive'
      order by bp.joined_at, bp.id
    loop
      select * into target_checkin
      from public.checkins c
      where c.user_id = target_row.user_id
        and c.battle_day = p_battle_day;

      target_stop := least(coalesce(target_checkin.arrived_at, window_end), window_end);

      damage_amount := greatest(
        0,
        floor(extract(epoch from (target_stop - window_start)) / 3600)::int
      ) * battle_row.daily_damage_per_hour;

      if damage_amount > 0 then
        insert into public.damage_events (
          battle_id,
          participant_id,
          source,
          amount,
          battle_day
        )
        values (
          battle_row.id,
          target_row.id,
          'daily',
          damage_amount,
          p_battle_day
        );
        created_count := created_count + 1;
      end if;

      if target_checkin.id is null and battle_row.no_show_penalty > 0 then
        insert into public.damage_events (
          battle_id,
          participant_id,
          source,
          amount,
          battle_day
        )
        values (
          battle_row.id,
          target_row.id,
          'no_show',
          battle_row.no_show_penalty,
          p_battle_day
        );
        created_count := created_count + 1;
      end if;

      for attacker_row in
        select *
        from public.battle_participants bp
        where bp.battle_id = battle_row.id
          and bp.status = 'alive'
          and bp.user_id <> target_row.user_id
        order by bp.joined_at, bp.id
      loop
        select * into attacker_checkin
        from public.checkins c
        where c.user_id = attacker_row.user_id
          and c.battle_day = p_battle_day;

        if attacker_checkin.id is null then
          continue;
        end if;

        grace_end := attacker_checkin.arrived_at + make_interval(hours => battle_row.pvp_grace_hours);

        damage_amount := greatest(
          0,
          floor(extract(epoch from (target_stop - grace_end)) / 3600)::int
        ) * battle_row.pvp_damage_per_hour;

        if damage_amount > 0 then
          insert into public.damage_events (
            battle_id,
            participant_id,
            source,
            source_user_id,
            amount,
            battle_day
          )
          values (
            battle_row.id,
            target_row.id,
            'pvp',
            attacker_row.user_id,
            damage_amount,
            p_battle_day
          );
          created_count := created_count + 1;
        end if;
      end loop;
    end loop;

    update public.battle_participants bp
    set hp_current = greatest(0, bp.hp_current - totals.amount)
    from (
      select participant_id, sum(amount)::int as amount
      from public.damage_events
      where battle_id = battle_row.id
        and battle_day = p_battle_day
      group by participant_id
    ) totals
    where bp.id = totals.participant_id
      and bp.status = 'alive';

    update public.battle_participants
    set
      status = 'eliminated',
      eliminated_at = now(),
      final_position = 2
    where battle_id = battle_row.id
      and status = 'alive'
      and hp_current <= 0;

    get diagnostics damage_amount = row_count;
    eliminated_count := eliminated_count + damage_amount;

    select count(*) into active_count
    from public.battle_participants
    where battle_id = battle_row.id
      and status = 'alive';

    if active_count <= 1
      or p_battle_day >= ((battle_row.ends_at at time zone 'America/Sao_Paulo')::date - 1)
    then
      select bp.id into winner_participant_id
      from public.battle_participants bp
      where bp.battle_id = battle_row.id
        and bp.status in ('alive', 'winner')
      order by bp.hp_current desc, bp.joined_at asc, bp.id asc
      limit 1;

      update public.battle_participants
      set
        status = case when id = winner_participant_id then 'winner'::participant_status else 'eliminated'::participant_status end,
        final_position = case when id = winner_participant_id then 1 else 2 end,
        eliminated_at = case when id = winner_participant_id then eliminated_at else coalesce(eliminated_at, now()) end
      where battle_id = battle_row.id
        and status in ('alive', 'eliminated', 'winner');

      update public.battles
      set status = 'finished'
      where id = battle_row.id
        and status = 'active';

      get diagnostics damage_amount = row_count;
      finished_count := finished_count + damage_amount;
    end if;
  end loop;

  return query
  select processed_count, created_count, eliminated_count, finished_count;
end;
$$;

create or replace function public.list_individual_rankings(
  p_gym_id uuid default null,
  p_min_finished int default 0
)
returns table (
  rank_position bigint,
  user_id uuid,
  display_name text,
  avatar_url text,
  gym_id uuid,
  gym_name text,
  wins bigint,
  losses bigint,
  total_battles bigint,
  win_rate numeric
)
language sql
security definer
set search_path = public
stable
as $$
  with finished_results as (
    select
      p.id as user_id,
      p.display_name,
      p.avatar_url,
      p.gym_id,
      g.name as gym_name,
      count(*) filter (where b.id is not null and bp.status = 'winner') as wins,
      count(*) filter (where b.id is not null and bp.status = 'eliminated') as losses
    from public.profiles p
    left join public.gyms g on g.id = p.gym_id
    left join public.battle_participants bp on bp.user_id = p.id
    left join public.battles b on b.id = bp.battle_id and b.status = 'finished'
    where (p_gym_id is null or p.gym_id = p_gym_id)
    group by p.id, p.display_name, p.avatar_url, p.gym_id, g.name
  ),
  scored as (
    select
      *,
      (wins + losses) as total_battles,
      case
        when (wins + losses) = 0 then 0::numeric
        else round((wins::numeric / (wins + losses)::numeric) * 100, 1)
      end as win_rate
    from finished_results
    where (wins + losses) >= greatest(p_min_finished, 0)
  )
  select
    rank() over (order by win_rate desc, wins desc, total_battles desc, display_name asc) as rank_position,
    user_id,
    display_name,
    avatar_url,
    gym_id,
    gym_name,
    wins,
    losses,
    total_battles,
    win_rate
  from scored
  where total_battles > 0
  order by rank_position asc, display_name asc
  limit 100;
$$;

grant execute on function public.apply_daily_battle_damage(date) to authenticated;
grant execute on function public.list_individual_rankings(uuid, int) to authenticated;
