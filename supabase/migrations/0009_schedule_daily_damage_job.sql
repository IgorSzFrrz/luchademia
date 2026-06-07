-- Run battle damage processing once per closed Sao Paulo day.
-- 03:10 UTC is 00:10 in America/Sao_Paulo.

create extension if not exists pg_cron;

do $$
declare
  existing_job record;
begin
  for existing_job in
    select jobid
    from cron.job
    where jobname = 'luchademia-daily-battle-damage'
  loop
    perform cron.unschedule(existing_job.jobid);
  end loop;
end;
$$;

select cron.schedule(
  'luchademia-daily-battle-damage',
  '10 3 * * *',
  $$select public.apply_daily_battle_damage();$$
);
