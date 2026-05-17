import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AppNavigator } from './AppNavigator';
import { useAuth } from '../store/auth';
import { useLD } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// TEMP: skip auth gate so the design can be explored end-to-end in dev.
// Set to false once Google OAuth is wired in.
const SHOW_APP_BY_DEFAULT = true;

export function RootNavigator() {
  const LD = useLD();
  const { session, loading, init } = useAuth();

  useEffect(() => {
    init().catch(() => undefined);
  }, [init]);

  const navTheme = LD.mode === 'light'
    ? { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: LD.bg, card: LD.surface, text: LD.text, border: LD.border, primary: LD.gold } }
    : { ...DarkTheme,   colors: { ...DarkTheme.colors,   background: LD.bg, card: LD.surface, text: LD.text, border: LD.border, primary: LD.gold } };

  if (loading && !SHOW_APP_BY_DEFAULT) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: LD.bg }}>
        <ActivityIndicator color={LD.gold} />
      </View>
    );
  }

  const authed = SHOW_APP_BY_DEFAULT || !!session;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authed ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
