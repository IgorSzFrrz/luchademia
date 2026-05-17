-- MVP home RPCs.

create or replace function public.list_my_1v1_battles()
returns table (
  battle_id uuid,
  battle_status battle_status,
  duration_days int,
  hp_base int,
  starts_at timestamptz,
  ends_at timestamptz,
  my_participant_id uuid,
  my_hp int,
  my_status participant_status,
  opponent_id uuid,
  opponent_name text,
  opponent_avatar_url text,
  opponent_hp int,
  opponent_status participant_status
)
language sql
security definer
set search_path = public
stable
as $$
  select
    b.id as battle_id,
    b.status as battle_status,
    b.duration_days,
    b.hp_base,
    b.starts_at,
    b.ends_at,
    me.id as my_participant_id,
    me.hp_current as my_hp,
    me.status as my_status,
    opponent.user_id as opponent_id,
    opponent_profile.display_name as opponent_name,
    opponent_profile.avatar_url as opponent_avatar_url,
    opponent.hp_current as opponent_hp,
    opponent.status as opponent_status
  from public.battle_participants me
  join public.battles b on b.id = me.battle_id
  left join public.battle_participants opponent
    on opponent.battle_id = b.id
    and opponent.user_id <> me.user_id
  left join public.profiles opponent_profile on opponent_profile.id = opponent.user_id
  where me.user_id = auth.uid()
    and b.type = '1v1'
    and b.status in ('pending', 'active')
    and me.status in ('accepted', 'alive')
  order by
    case b.status when 'active' then 0 else 1 end,
    b.starts_at desc,
    b.created_at desc;
$$;

grant execute on function public.list_my_1v1_battles() to authenticated;
