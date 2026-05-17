-- MVP battle RPCs.
-- These functions keep cross-user writes behind SECURITY DEFINER boundaries
-- instead of weakening the table-level RLS policies.

create or replace function public.create_1v1_battle(
  opponent_user_id uuid,
  duration_days int
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  requester uuid := auth.uid();
  battle_id uuid;
  base_hp int;
begin
  if requester is null then
    raise exception 'not_authenticated';
  end if;

  if opponent_user_id = requester then
    raise exception 'cannot_challenge_self';
  end if;

  if duration_days not in (5, 10, 15, 30) then
    raise exception 'invalid_duration';
  end if;

  if not exists (select 1 from public.profiles where id = requester) then
    raise exception 'requester_profile_missing';
  end if;

  if not exists (select 1 from public.profiles where id = opponent_user_id) then
    raise exception 'opponent_profile_missing';
  end if;

  base_hp := 40 * duration_days;

  insert into public.battles (
    type,
    status,
    duration_days,
    hp_base,
    starts_at,
    ends_at,
    created_by
  )
  values (
    '1v1',
    'pending',
    duration_days,
    base_hp,
    now(),
    now() + make_interval(days => duration_days),
    requester
  )
  returning id into battle_id;

  insert into public.battle_participants (battle_id, user_id, status, hp_current)
  values
    (battle_id, requester, 'accepted', base_hp),
    (battle_id, opponent_user_id, 'invited', base_hp);

  return battle_id;
end;
$$;

create or replace function public.create_open_1v1_battle(
  duration_days int
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  requester uuid := auth.uid();
  battle_id uuid;
  base_hp int;
begin
  if requester is null then
    raise exception 'not_authenticated';
  end if;

  if duration_days not in (5, 10, 15, 30) then
    raise exception 'invalid_duration';
  end if;

  if not exists (select 1 from public.profiles where id = requester) then
    raise exception 'requester_profile_missing';
  end if;

  base_hp := 40 * duration_days;

  insert into public.battles (
    type,
    status,
    duration_days,
    hp_base,
    starts_at,
    ends_at,
    created_by
  )
  values (
    '1v1',
    'pending',
    duration_days,
    base_hp,
    now(),
    now() + make_interval(days => duration_days),
    requester
  )
  returning id into battle_id;

  insert into public.battle_participants (battle_id, user_id, status, hp_current)
  values (battle_id, requester, 'accepted', base_hp);

  return battle_id;
end;
$$;

create or replace function public.accept_battle(p_battle_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  requester uuid := auth.uid();
  battle_row public.battles%rowtype;
  participant_count int;
begin
  if requester is null then
    raise exception 'not_authenticated';
  end if;

  select * into battle_row
  from public.battles
  where id = p_battle_id
    and type = '1v1'
    and status = 'pending'
  for update;

  if not found then
    raise exception 'battle_not_found';
  end if;

  if requester = battle_row.created_by then
    raise exception 'cannot_accept_own_battle';
  end if;

  select count(*) into participant_count
  from public.battle_participants
  where battle_id = p_battle_id;

  if exists (
    select 1
    from public.battle_participants
    where battle_id = p_battle_id
      and user_id = requester
      and status = 'invited'
  ) then
    update public.battle_participants
    set status = 'accepted'
    where battle_id = p_battle_id
      and user_id = requester
      and status = 'invited';
  elsif participant_count = 1 then
    insert into public.battle_participants (battle_id, user_id, status, hp_current)
    values (p_battle_id, requester, 'accepted', battle_row.hp_base);
  else
    raise exception 'invite_not_found';
  end if;

  if (
    select count(*)
    from public.battle_participants
    where battle_id = p_battle_id
      and status = 'accepted'
  ) = 2 then
    update public.battles
    set
      status = 'active',
      starts_at = now(),
      ends_at = now() + make_interval(days => battle_row.duration_days)
    where id = p_battle_id;

    update public.battle_participants
    set status = 'alive'
    where battle_id = p_battle_id
      and status = 'accepted';
  end if;

  return p_battle_id;
end;
$$;

create or replace function public.list_open_1v1_battles()
returns table (
  battle_id uuid,
  creator_id uuid,
  creator_name text,
  creator_avatar_url text,
  gym_id uuid,
  gym_name text,
  duration_days int,
  hp_base int,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    b.id as battle_id,
    b.created_by as creator_id,
    p.display_name as creator_name,
    p.avatar_url as creator_avatar_url,
    p.gym_id,
    g.name as gym_name,
    b.duration_days,
    b.hp_base,
    b.created_at
  from public.battles b
  join public.profiles p on p.id = b.created_by
  left join public.gyms g on g.id = p.gym_id
  where b.type = '1v1'
    and b.status = 'pending'
    and b.created_by <> auth.uid()
    and (
      select count(*)
      from public.battle_participants bp_count
      where bp_count.battle_id = b.id
    ) = 1
    and exists (
      select 1
      from public.battle_participants creator_bp
      where creator_bp.battle_id = b.id
        and creator_bp.user_id = b.created_by
        and creator_bp.status = 'accepted'
    )
    and not exists (
      select 1
      from public.battle_participants me
      where me.battle_id = b.id
        and me.user_id = auth.uid()
    )
  order by b.created_at desc;
$$;

grant execute on function public.create_1v1_battle(uuid, int) to authenticated;
grant execute on function public.create_open_1v1_battle(int) to authenticated;
grant execute on function public.accept_battle(uuid) to authenticated;
grant execute on function public.list_open_1v1_battles() to authenticated;
