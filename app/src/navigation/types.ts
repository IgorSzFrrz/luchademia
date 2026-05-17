import type { NavigatorScreenParams } from '@react-navigation/native';

export type CheckinStackParamList = {
  Arrival: undefined;
  Stay: undefined;
  Done: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  BattleDetail: { battleId?: string };
  Checkin: NavigatorScreenParams<CheckinStackParamList>;
  Conquistas: undefined;
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
