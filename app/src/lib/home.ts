import { isSupabaseConfigured, supabase } from './supabase';
import type { UUID } from '../types/domain';

export type HomeProfile = {
  id: UUID;
  display_name: string;
  avatar_url: string | null;
  gym_id: UUID | null;
  gym_name: string | null;
};

export type HomeBattle = {
  battle_id: UUID;
  battle_status: 'pending' | 'active';
  duration_days: number;
  hp_base: number;
  starts_at: string;
  ends_at: string;
  my_participant_id: UUID;
  my_hp: number;
  my_status: 'accepted' | 'alive';
  opponent_id: UUID | null;
  opponent_name: string | null;
  opponent_avatar_url: string | null;
  opponent_hp: number | null;
  opponent_status: 'invited' | 'accepted' | 'alive' | 'eliminated' | 'winner' | null;
};

export type TodayCheckin = {
  id: UUID;
  battle_day: string;
  confirmed_at: string | null;
  arrived_at: string;
};

export type HomeData = {
  profile: HomeProfile | null;
  checkedToday: boolean;
  todayCheckin: TodayCheckin | null;
  battles: HomeBattle[];
};

function localDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function getTodayKey() {
  return localDateKey();
}

export function getWindowStatus(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const secondsNow =
    Number(values.hour ?? 0) * 3600 +
    Number(values.minute ?? 0) * 60 +
    Number(values.second ?? 0);
  const start = 5 * 3600;
  const end = 23 * 3600;
  const secondsUntilClose = Math.max(0, end - secondsNow);
  const openedSeconds = Math.max(0, Math.min(secondsNow, end) - start);

  return {
    isOpen: secondsNow >= start && secondsNow < end,
    hpLostToday: Math.floor(openedSeconds / 3600),
    secondsUntilClose,
  };
}

export function formatSeconds(seconds: number) {
  const safe = Math.max(0, seconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remainingSeconds = safe % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export async function loadHomeData(userId: UUID): Promise<HomeData> {
  if (!isSupabaseConfigured) {
    return { profile: null, checkedToday: false, todayCheckin: null, battles: [] };
  }

  const today = localDateKey();
  const [profileResult, checkinResult, battlesResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, display_name, avatar_url, gym_id, gyms(name)')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('checkins')
      .select('id, battle_day, arrived_at, confirmed_at')
      .eq('user_id', userId)
      .eq('battle_day', today)
      .maybeSingle<TodayCheckin>(),
    supabase.rpc('list_my_1v1_battles'),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (checkinResult.error) throw checkinResult.error;
  if (battlesResult.error) throw battlesResult.error;

  const profileRow = profileResult.data as {
    id: UUID;
    display_name: string;
    avatar_url: string | null;
    gym_id: UUID | null;
    gyms?: { name?: string | null } | null;
  } | null;

  return {
    profile: profileRow
      ? {
          id: profileRow.id,
          display_name: profileRow.display_name,
          avatar_url: profileRow.avatar_url,
          gym_id: profileRow.gym_id,
          gym_name: profileRow.gyms?.name ?? null,
        }
      : null,
    checkedToday: !!checkinResult.data?.confirmed_at,
    todayCheckin: checkinResult.data ?? null,
    battles: (battlesResult.data ?? []) as HomeBattle[],
  };
}
