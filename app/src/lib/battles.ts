import { isSupabaseConfigured, supabase } from './supabase';
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
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.rpc('list_open_1v1_battles');
  if (error) throw error;

  return (data ?? []) as OpenBattle[];
}

export async function createOpen1v1Battle(durationDays: number): Promise<UUID> {
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
  if (!isSupabaseConfigured) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await supabase.rpc('accept_battle', {
    p_battle_id: battleId,
  });
  if (error) throw error;

  return data as UUID;
}
