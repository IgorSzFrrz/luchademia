import { isSupabaseConfigured, supabase } from './supabase';
import type { BattleStatus, ParticipantStatus, UUID } from '../types/domain';

export type BattleTimelineDay = {
  day_number: number;
  battle_day: string;
  my_checkin_at: string | null;
  opponent_checkin_at: string | null;
  my_damage: number;
  opponent_damage: number;
};

export type BattleDetail = {
  battle_id: UUID;
  battle_status: BattleStatus;
  duration_days: number;
  hp_base: number;
  starts_at: string;
  ends_at: string;
  day_window_start_hour: number;
  day_window_end_hour: number;
  daily_damage_per_hour: number;
  pvp_grace_hours: number;
  pvp_damage_per_hour: number;
  no_show_penalty: number;
  my_user_id: UUID;
  my_name: string;
  my_avatar_url: string | null;
  my_hp: number;
  my_status: ParticipantStatus;
  opponent_user_id: UUID | null;
  opponent_name: string | null;
  opponent_avatar_url: string | null;
  opponent_hp: number | null;
  opponent_status: ParticipantStatus | null;
  timeline: BattleTimelineDay[];
};

export async function getBattleDetail(battleId: UUID): Promise<BattleDetail | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .rpc('get_1v1_battle_detail', { p_battle_id: battleId })
    .maybeSingle<BattleDetail>();

  if (error) throw error;

  return data ?? null;
}
