-- Luchademia — schema inicial do MVP
-- Cobre: profiles, gyms, battles (1v1 e BR), participants, checkins, damage_events.
-- Mecânica de dano (job de meia-noite, triggers de check-in) é implementada
-- em Edge Functions / pg_cron e ficará em migrations posteriores.

create extension if not exists "pgcrypto";
create extension if not exists "postgis";

------------------------------------------------------------
-- gyms
------------------------------------------------------------
create table public.gyms (
  id              uuid primary key default gen_random_uuid(),
  google_place_id text unique not null,
  name            text not null,
  address         text,
  lat             double precision not null,
  lng             double precision not null,
  geog            geography(point, 4326) generated always as
                    (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  created_at      timestamptz not null default now()
);

create index gyms_geog_idx on public.gyms using gist (geog);

------------------------------------------------------------
-- profiles (1:1 com auth.users)
------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  avatar_url    text,
  gym_id        uuid references public.gyms(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index profiles_gym_idx on public.profiles(gym_id);

-- Cria profile automaticamente no signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

------------------------------------------------------------
-- battles
------------------------------------------------------------
create type battle_type as enum ('1v1', 'br');
create type battle_status as enum ('pending', 'active', 'finished', 'cancelled');

create table public.battles (
  id                       uuid primary key default gen_random_uuid(),
  type                     battle_type not null,
  status                   battle_status not null default 'pending',
  duration_days            int not null check (duration_days in (5, 10, 15, 30)),
  hp_base                  int not null,
  starts_at                timestamptz not null,
  ends_at                  timestamptz not null,
  day_window_start_hour    int not null default 5 check (day_window_start_hour between 0 and 23),
  day_window_end_hour      int not null default 23 check (day_window_end_hour between 1 and 24),
  daily_damage_per_hour    int not null default 1,
  pvp_grace_hours          int not null default 4,
  pvp_damage_per_hour      int not null default 2,
  no_show_penalty          int not null default 20,
  created_by               uuid not null references public.profiles(id) on delete cascade,
  created_at               timestamptz not null default now()
);

create index battles_status_idx on public.battles(status);
create index battles_created_by_idx on public.battles(created_by);

------------------------------------------------------------
-- battle_participants
------------------------------------------------------------
create type participant_status as enum (
  'invited', 'accepted', 'declined',
  'alive', 'eliminated', 'winner'
);

create table public.battle_participants (
  id              uuid primary key default gen_random_uuid(),
  battle_id       uuid not null references public.battles(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  status          participant_status not null default 'invited',
  hp_current      int not null,
  eliminated_at   timestamptz,
  final_position  int,
  joined_at       timestamptz not null default now(),
  unique (battle_id, user_id)
);

create index bp_battle_idx on public.battle_participants(battle_id);
create index bp_user_idx on public.battle_participants(user_id);

------------------------------------------------------------
-- checkins (1 por usuário por dia de batalha)
------------------------------------------------------------
create table public.checkins (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  gym_id          uuid not null references public.gyms(id) on delete restrict,
  battle_day      date not null,
  arrived_at      timestamptz not null,
  confirmed_at    timestamptz,
  lat             double precision not null,
  lng             double precision not null,
  is_suspicious   boolean not null default false,
  unique (user_id, battle_day)
);

create index checkins_user_day_idx on public.checkins(user_id, battle_day);

------------------------------------------------------------
-- damage_events (auditável: cada -HP tem origem)
------------------------------------------------------------
create type damage_source as enum ('daily', 'pvp', 'no_show');

create table public.damage_events (
  id                uuid primary key default gen_random_uuid(),
  battle_id         uuid not null references public.battles(id) on delete cascade,
  participant_id    uuid not null references public.battle_participants(id) on delete cascade,
  source            damage_source not null,
  source_user_id    uuid references public.profiles(id) on delete set null,
  amount            int not null check (amount > 0),
  battle_day        date not null,
  applied_at        timestamptz not null default now()
);

create index de_battle_day_idx on public.damage_events(battle_id, battle_day);
create index de_participant_idx on public.damage_events(participant_id);

------------------------------------------------------------
-- ROW LEVEL SECURITY
------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.gyms                enable row level security;
alter table public.battles             enable row level security;
alter table public.battle_participants enable row level security;
alter table public.checkins            enable row level security;
alter table public.damage_events       enable row level security;

-- profiles: todos veem (lookup público), só dono edita
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

-- gyms: leitura pública; escrita só via service_role (admin/onboarding)
create policy "gyms_select_all" on public.gyms for select using (true);

-- battles: leitura para participantes ou batalhas pending públicas (Buscar)
create policy "battles_select_visible" on public.battles for select using (
  status = 'pending'
  or exists (
    select 1 from public.battle_participants bp
    where bp.battle_id = battles.id and bp.user_id = auth.uid()
  )
);
create policy "battles_insert_self" on public.battles for insert with check (created_by = auth.uid());
create policy "battles_update_creator" on public.battles for update using (created_by = auth.uid());

-- battle_participants: visível para qualquer participante da mesma batalha
create policy "bp_select_battle_members" on public.battle_participants for select using (
  exists (
    select 1 from public.battle_participants me
    where me.battle_id = battle_participants.battle_id and me.user_id = auth.uid()
  )
);
create policy "bp_insert_self" on public.battle_participants for insert with check (user_id = auth.uid());
create policy "bp_update_self" on public.battle_participants for update using (user_id = auth.uid());

-- checkins: dono escreve; participantes da mesma batalha leem
create policy "checkins_select_own" on public.checkins for select using (user_id = auth.uid());
create policy "checkins_insert_own" on public.checkins for insert with check (user_id = auth.uid());

-- damage_events: leitura para qualquer participante; escrita só service_role
create policy "de_select_battle_members" on public.damage_events for select using (
  exists (
    select 1 from public.battle_participants me
    where me.battle_id = damage_events.battle_id and me.user_id = auth.uid()
  )
);
