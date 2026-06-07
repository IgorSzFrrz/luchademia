-- Restrict daily damage processing to trusted jobs only.
-- Authenticated users must not be able to process arbitrary battle days.

alter function public.apply_daily_battle_damage(date)
  rename to apply_daily_battle_damage_unrestricted;

revoke all on function public.apply_daily_battle_damage_unrestricted(date) from public;
revoke all on function public.apply_daily_battle_damage_unrestricted(date) from anon;
revoke all on function public.apply_daily_battle_damage_unrestricted(date) from authenticated;

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
  today_sao_paulo date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if p_battle_day is null then
    raise exception 'missing_battle_day';
  end if;

  if p_battle_day >= today_sao_paulo then
    raise exception 'battle_day_not_closed';
  end if;

  return query
  select *
  from public.apply_daily_battle_damage_unrestricted(p_battle_day);
end;
$$;

revoke all on function public.apply_daily_battle_damage(date) from public;
revoke all on function public.apply_daily_battle_damage(date) from anon;
revoke all on function public.apply_daily_battle_damage(date) from authenticated;
grant execute on function public.apply_daily_battle_damage(date) to service_role;
