import type { Session, User } from '@supabase/supabase-js';
import type { Gym, Profile, UUID } from '../types/domain';
import type { HomeBattle, HomeData } from './home';
import type { OpenBattle } from './battles';
import type { IndividualRanking } from './rankings';
import type { ProfileDashboard } from './profile';
import type { BattleDetail } from './battleDetail';

export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_DATA;
export const isDemoDataEnabled = DEMO_MODE === 'app' || DEMO_MODE === 'onboarding';
export const isDemoAppMode = DEMO_MODE === 'app';
export const isDemoOnboardingMode = DEMO_MODE === 'onboarding';

export const DEMO_USER_ID = '11111111-1111-4111-8111-111111111111' as UUID;
export const DEMO_GYM_ID = '22222222-2222-4222-8222-222222222222' as UUID;
export const DEMO_BATTLE_ID = '33333333-3333-4333-8333-333333333333' as UUID;

export const demoUser = {
  id: DEMO_USER_ID,
  aud: 'authenticated',
  email: 'igor@luchademia.app',
  app_metadata: { provider: 'google', providers: ['google'] },
  user_metadata: { full_name: 'Igor Luchador' },
  created_at: '2026-05-01T12:00:00.000Z',
} as User;

export const demoSession = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  user: demoUser,
} as Session;

export const demoProfile: Profile = {
  id: DEMO_USER_ID,
  display_name: 'Igor Luchador',
  avatar_url: null,
  gym_id: DEMO_GYM_ID,
  created_at: '2026-05-01T12:00:00.000Z',
};

export const demoGyms: Gym[] = [
  {
    id: DEMO_GYM_ID,
    google_place_id: 'demo-smart-fit-vila-madalena',
    name: 'Smart Fit Vila Madalena',
    address: 'Rua Harmonia, 530 - Sao Paulo',
    lat: -23.55594,
    lng: -46.69063,
  },
  {
    id: '22222222-2222-4222-8222-222222222223',
    google_place_id: 'demo-bluefit-pinheiros',
    name: 'Bluefit Pinheiros',
    address: 'Av. Reboucas, 2970 - Sao Paulo',
    lat: -23.56568,
    lng: -46.69338,
  },
  {
    id: '22222222-2222-4222-8222-222222222224',
    google_place_id: 'demo-bio-ritmo-paulista',
    name: 'Bio Ritmo Paulista',
    address: 'Av. Paulista, 2073 - Sao Paulo',
    lat: -23.55868,
    lng: -46.65968,
  },
];

const now = new Date();
const today = now.toISOString().slice(0, 10);
const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
const tomorrow = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
const twoDays = new Date(now.getTime() + 2 * 86400000).toISOString().slice(0, 10);

export function demoHomeData(): HomeData {
  return {
    profile: {
      id: DEMO_USER_ID,
      display_name: 'Igor Luchador',
      avatar_url: null,
      gym_id: DEMO_GYM_ID,
      gym_name: 'Smart Fit Vila Madalena',
    },
    checkedToday: false,
    todayCheckin: null,
    battles: [
      {
        battle_id: DEMO_BATTLE_ID,
        battle_status: 'active',
        duration_days: 10,
        hp_base: 400,
        starts_at: `${yesterday}T08:00:00.000Z`,
        ends_at: `${twoDays}T23:00:00.000Z`,
        my_participant_id: '44444444-4444-4444-8444-444444444441',
        my_hp: 356,
        my_status: 'alive',
        opponent_id: '55555555-5555-4555-8555-555555555551',
        opponent_name: 'Ana Punho',
        opponent_avatar_url: null,
        opponent_hp: 312,
        opponent_status: 'alive',
      },
      {
        battle_id: '33333333-3333-4333-8333-333333333334',
        battle_status: 'pending',
        duration_days: 5,
        hp_base: 200,
        starts_at: `${today}T08:00:00.000Z`,
        ends_at: `${twoDays}T23:00:00.000Z`,
        my_participant_id: '44444444-4444-4444-8444-444444444442',
        my_hp: 200,
        my_status: 'accepted',
        opponent_id: null,
        opponent_name: null,
        opponent_avatar_url: null,
        opponent_hp: null,
        opponent_status: null,
      },
    ],
  };
}

export const demoOpenBattles: OpenBattle[] = [
  {
    battle_id: '33333333-3333-4333-8333-333333333335',
    creator_id: '55555555-5555-4555-8555-555555555552',
    creator_name: 'Bruno Barra',
    creator_avatar_url: null,
    gym_id: DEMO_GYM_ID,
    gym_name: 'Smart Fit Vila Madalena',
    duration_days: 10,
    hp_base: 400,
    created_at: `${today}T10:00:00.000Z`,
  },
  {
    battle_id: '33333333-3333-4333-8333-333333333336',
    creator_id: '55555555-5555-4555-8555-555555555553',
    creator_name: 'Lia Roundhouse',
    creator_avatar_url: null,
    gym_id: DEMO_GYM_ID,
    gym_name: 'Smart Fit Vila Madalena',
    duration_days: 5,
    hp_base: 200,
    created_at: `${today}T11:30:00.000Z`,
  },
  {
    battle_id: '33333333-3333-4333-8333-333333333337',
    creator_id: '55555555-5555-4555-8555-555555555554',
    creator_name: 'Caio Jab',
    creator_avatar_url: null,
    gym_id: '22222222-2222-4222-8222-222222222223',
    gym_name: 'Bluefit Pinheiros',
    duration_days: 15,
    hp_base: 600,
    created_at: `${today}T12:15:00.000Z`,
  },
];

export const demoRankings: IndividualRanking[] = [
  { rank_position: 1, user_id: '55555555-5555-4555-8555-555555555552', display_name: 'Bruno Barra', avatar_url: null, gym_id: DEMO_GYM_ID, gym_name: 'Smart Fit Vila Madalena', wins: 12, losses: 2, total_battles: 14, win_rate: 86 },
  { rank_position: 2, user_id: DEMO_USER_ID, display_name: 'Igor Luchador', avatar_url: null, gym_id: DEMO_GYM_ID, gym_name: 'Smart Fit Vila Madalena', wins: 9, losses: 3, total_battles: 12, win_rate: 75 },
  { rank_position: 3, user_id: '55555555-5555-4555-8555-555555555553', display_name: 'Lia Roundhouse', avatar_url: null, gym_id: DEMO_GYM_ID, gym_name: 'Smart Fit Vila Madalena', wins: 8, losses: 4, total_battles: 12, win_rate: 67 },
  { rank_position: 4, user_id: '55555555-5555-4555-8555-555555555554', display_name: 'Ana Punho', avatar_url: null, gym_id: DEMO_GYM_ID, gym_name: 'Smart Fit Vila Madalena', wins: 7, losses: 5, total_battles: 12, win_rate: 58 },
  { rank_position: 5, user_id: '55555555-5555-4555-8555-555555555555', display_name: 'Caio Jab', avatar_url: null, gym_id: DEMO_GYM_ID, gym_name: 'Bluefit Pinheiros', wins: 5, losses: 6, total_battles: 11, win_rate: 45 },
];

export const demoProfileDashboard: ProfileDashboard = {
  user_id: DEMO_USER_ID,
  display_name: 'Igor Luchador',
  avatar_url: null,
  gym_id: DEMO_GYM_ID,
  gym_name: 'Smart Fit Vila Madalena',
  created_at: '2026-05-01T12:00:00.000Z',
  wins: 9,
  losses: 3,
  total_battles: 12,
  win_rate: 75,
  checkins_total: 24,
  current_streak: 6,
  best_streak: 11,
  rank_position: 2,
  recent_battles: [
    { battle_id: DEMO_BATTLE_ID, battle_status: 'active', type: '1v1', duration_days: 10, result: 'active', opponent_name: 'Ana Punho', opponent_hp: 312, my_hp: 356, created_at: `${yesterday}T08:00:00.000Z`, ended_at: `${twoDays}T23:00:00.000Z` },
    { battle_id: '33333333-3333-4333-8333-333333333338', battle_status: 'finished', type: '1v1', duration_days: 5, result: 'win', opponent_name: 'Caio Jab', opponent_hp: 0, my_hp: 84, created_at: '2026-05-11T08:00:00.000Z', ended_at: '2026-05-16T23:00:00.000Z' },
    { battle_id: '33333333-3333-4333-8333-333333333339', battle_status: 'finished', type: '1v1', duration_days: 10, result: 'loss', opponent_name: 'Lia Roundhouse', opponent_hp: 44, my_hp: 0, created_at: '2026-04-28T08:00:00.000Z', ended_at: '2026-05-08T23:00:00.000Z' },
  ],
};

export function demoBattleDetail(): BattleDetail {
  return {
    battle_id: DEMO_BATTLE_ID,
    battle_status: 'active',
    duration_days: 10,
    hp_base: 400,
    starts_at: `${yesterday}T08:00:00.000Z`,
    ends_at: `${twoDays}T23:00:00.000Z`,
    day_window_start_hour: 5,
    day_window_end_hour: 23,
    daily_damage_per_hour: 1,
    pvp_grace_hours: 2,
    pvp_damage_per_hour: 4,
    no_show_penalty: 40,
    my_user_id: DEMO_USER_ID,
    my_name: 'Igor Luchador',
    my_avatar_url: null,
    my_hp: 356,
    my_status: 'alive',
    opponent_user_id: '55555555-5555-4555-8555-555555555551',
    opponent_name: 'Ana Punho',
    opponent_avatar_url: null,
    opponent_hp: 312,
    opponent_status: 'alive',
    timeline: [
      { day_number: 1, battle_day: yesterday, my_checkin_at: `${yesterday}T12:12:00.000Z`, opponent_checkin_at: null, my_damage: 0, opponent_damage: 40 },
      { day_number: 2, battle_day: today, my_checkin_at: null, opponent_checkin_at: `${today}T11:04:00.000Z`, my_damage: 44, opponent_damage: 0 },
      { day_number: 3, battle_day: tomorrow, my_checkin_at: null, opponent_checkin_at: null, my_damage: 0, opponent_damage: 0 },
      { day_number: 4, battle_day: twoDays, my_checkin_at: null, opponent_checkin_at: null, my_damage: 0, opponent_damage: 0 },
    ],
  };
}
