import type { NavigatorScreenParams } from '@react-navigation/native';

export type CheckinStackParamList = {
  Arrival: undefined;
  Stay: {
    gymId: string;
    gymName: string;
    gymLat: number;
    gymLng: number;
    latitude: number;
    longitude: number;
    distanceMeters: number;
    arrivedAt: string;
  };
  Done: {
    gymName: string;
    confirmedAt: string;
    distanceMeters: number;
    battleDay: string;
  };
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  BattleDetail: { battleId?: string };
  Checkin: NavigatorScreenParams<CheckinStackParamList>;
  Conquistas: undefined;
  ChangeGym: undefined;
  InviteBattle: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  App: NavigatorScreenParams<AppStackParamList>;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  ChooseGym: undefined;
  Ready: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Ranking: undefined;
  Profile: undefined;
};
