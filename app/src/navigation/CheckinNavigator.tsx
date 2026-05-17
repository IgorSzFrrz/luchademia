import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CheckinArrivalScreen } from '../screens/checkin/CheckinArrivalScreen';
import { CheckinStayScreen } from '../screens/checkin/CheckinStayScreen';
import { CheckinDoneScreen } from '../screens/checkin/CheckinDoneScreen';
import type { CheckinStackParamList } from './types';

const Stack = createNativeStackNavigator<CheckinStackParamList>();

export function CheckinNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Arrival" component={CheckinArrivalScreen} />
      <Stack.Screen name="Stay" component={CheckinStayScreen} />
      <Stack.Screen name="Done" component={CheckinDoneScreen} />
    </Stack.Navigator>
  );
}
