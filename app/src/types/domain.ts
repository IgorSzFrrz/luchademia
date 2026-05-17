export type UUID = string;
export type ISODate = string;

export interface Profile {
  id: UUID;
  display_name: string;
  avatar_url: string | null;
  gym_id: UUID | null;
  created_at: ISODate;
}

export interface Gym {
  id: UUID;
  google_place_id: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
}

export type BattleType = '1v1' | 'br';
export type BattleStatus = 'pending' | 'active' | 'finished' | 'cancelled';

export interface Battle {
  id: UUID;
  type: BattleType;
  status: BattleStatus;
  duration_days: number;
  hp_base: number;
  starts_at: ISODate;
  ends_at: ISODate;
  day_window_start_hour: number;
  day_window_end_hour: number;
  daily_damage_per_hour: number;
  pvp_grace_hours: number;
  pvp_damage_per_hour: number;
  no_show_penalty: number;
  created_by: UUID;
  created_at: ISODate;
}

export type ParticipantStatus = 'invited' | 'accepted' | 'declined' | 'alive' | 'eliminated' | 'winner';

export interface BattleParticipant {
  id: UUID;
  battle_id: UUID;
  user_id: UUID;
  status: ParticipantStatus;
  hp_current: number;
  eliminated_at: ISODate | null;
  final_position: number | null;
}

export interface Checkin {
  id: UUID;
  user_id: UUID;
  gym_id: UUID;
  battle_day: ISODate;
  arrived_at: ISODate;
  confirmed_at: ISODate | null;
  lat: number;
  lng: number;
  is_suspicious: boolean;
}
