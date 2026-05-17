import { isSupabaseConfigured, supabase } from './supabase';
import type { BattleStatus, BattleType, UUID } from '../types/domain';

export type RecentProfileBattle = {
  battle_id: UUID;
  battle_status: BattleStatus;
  type: BattleType;
  duration_days: number;
  result: 'win' | 'loss' | 'active';
  opponent_name: string | null;
  opponent_hp: number | null;
  my_hp: number;
  created_at: string;
  ended_at: string;
};

export type ProfileDashboard = {
  user_id: UUID;
  display_name: string;
  avatar_url: string | null;
  gym_id: UUID | null;
  gym_name: string | null;
  created_at: string;
  wins: number;
  losses: number;
  total_battles: number;
  win_rate: number;
  checkins_total: number;
  current_streak: number;
  best_streak: number;
  rank_position: number | null;
  recent_battles: RecentProfileBattle[];
};

export async function getProfileDashboard(): Promise<ProfileDashboard | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .rpc('get_profile_dashboard')
    .maybeSingle<ProfileDashboard>();

  if (error) throw error;

  return data ?? null;
}
