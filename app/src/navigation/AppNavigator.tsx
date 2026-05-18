import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { CheckinNavigator } from './CheckinNavigator';
import { BattleDetailScreen } from '../screens/BattleDetailScreen';
import { ConquistasScreen } from '../screens/ConquistasScreen';
import { ChangeGymScreen } from '../screens/ChangeGymScreen';
import { InviteBattleScreen } from '../screens/InviteBattleScreen';
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
      <Stack.Screen
        name="ChangeGym"
        component={ChangeGymScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="InviteBattle"
        component={InviteBattleScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
