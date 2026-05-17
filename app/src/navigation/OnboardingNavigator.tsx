import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { ChooseGymScreen } from '../screens/onboarding/ChooseGymScreen';
import { ReadyScreen } from '../screens/onboarding/ReadyScreen';
import { useAuth } from '../store/auth';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const session = useAuth((state) => state.session);

  return (
    <Stack.Navigator
      initialRouteName={session ? 'ChooseGym' : 'Welcome'}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ChooseGym" component={ChooseGymScreen} />
      <Stack.Screen name="Ready" component={ReadyScreen} />
    </Stack.Navigator>
  );
}
