import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { CheckinNavigator } from './CheckinNavigator';
import { BattleDetailScreen } from '../screens/BattleDetailScreen';
import { ConquistasScreen } from '../screens/ConquistasScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="BattleDetail" component={BattleDetailScreen} />
      <Stack.Screen
        name="Checkin"
        component={CheckinNavigator}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="Conquistas" component={ConquistasScreen} />
    </Stack.Navigator>
  );
}
