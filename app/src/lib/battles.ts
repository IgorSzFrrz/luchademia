import { isSupabaseConfigured, supabase } from './supabase';
import { DEMO_BATTLE_ID, demoOpenBattles, isDemoDataEnabled } from './demo';
import type { UUID } from '../types/domain';

export type OpenBattle = {
  battle_id: UUID;
  creator_id: UUID;
  creator_name: string;
  creator_avatar_url: string | null;
  gym_id: UUID | null;
  gym_name: string | null;
  duration_days: number;
  hp_base: number;
  created_at: string;
};

export async function listOpen1v1Battles(): Promise<OpenBattle[]> {
  if (isDemoDataEnabled) return demoOpenBattles;
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.rpc('list_open_1v1_battles');
  if (error) throw error;

  return (data ?? []) as OpenBattle[];
}

export async function createOpen1v1Battle(durationDays: number): Promise<UUID> {
  if (isDemoDataEnabled) return DEMO_BATTLE_ID;

  if (!isSupabaseConfigured) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await supabase.rpc('create_open_1v1_battle', {
    duration_days: durationDays,
  });
  if (error) throw error;

  return data as UUID;
}

export async function acceptBattle(battleId: UUID): Promise<UUID> {
  if (isDemoDataEnabled) return battleId || DEMO_BATTLE_ID;

  if (!isSupabaseConfigured) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await supabase.rpc('accept_battle', {
    p_battle_id: battleId,
  });
  if (error) throw error;

  return data as UUID;
}

export function createBattleInviteCode(battleId: UUID) {
  return `LUCHA:${battleId}`;
}

export function parseBattleInviteCode(input: string): UUID | null {
  const trimmed = input.trim();
  const match = trimmed.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);

  return match?.[0] ?? null;
}
