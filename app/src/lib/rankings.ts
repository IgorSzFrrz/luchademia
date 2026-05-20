import { isSupabaseConfigured, supabase } from './supabase';
import { demoRankings, isDemoDataEnabled } from './demo';
import type { UUID } from '../types/domain';

export type IndividualRanking = {
  rank_position: number;
  user_id: UUID;
  display_name: string;
  avatar_url: string | null;
  gym_id: UUID | null;
  gym_name: string | null;
  wins: number;
  losses: number;
  total_battles: number;
  win_rate: number;
};

export async function listIndividualRankings(params?: {
  gymId?: UUID | null;
  minFinished?: number;
}): Promise<IndividualRanking[]> {
  if (isDemoDataEnabled) return demoRankings;

  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.rpc('list_individual_rankings', {
    p_gym_id: params?.gymId ?? null,
    p_min_finished: params?.minFinished ?? 0,
  });

  if (error) throw error;

  return (data ?? []) as IndividualRanking[];
}
