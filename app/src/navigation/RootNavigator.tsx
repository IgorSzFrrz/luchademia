import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { ActivityIndicator, View } from 'react-native';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AppNavigator } from './AppNavigator';
import { useAuth } from '../store/auth';
import { useLD } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const LD = useLD();
  const { session, profile, loading, profileLoading, onboardingComplete, init, handleOAuthRedirect } = useAuth();
  const url = Linking.useLinkingURL();

  useEffect(() => {
    init().catch(() => undefined);
  }, [init]);

  useEffect(() => {
    if (url) handleOAuthRedirect(url).catch(() => undefined);
  }, [handleOAuthRedirect, url]);

  const navTheme = LD.mode === 'light'
    ? { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: LD.bg, card: LD.surface, text: LD.text, border: LD.border, primary: LD.gold } }
    : { ...DarkTheme,   colors: { ...DarkTheme.colors,   background: LD.bg, card: LD.surface, text: LD.text, border: LD.border, primary: LD.gold } };

  if (loading || (session && profileLoading && !profile)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: LD.bg }}>
        <ActivityIndicator color={LD.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && profile?.gym_id && onboardingComplete ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
