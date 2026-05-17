import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLD, FONT_DISP, FONT_UI_BOLD } from '../theme';
import { CrownIcon, HomeIcon, MaskIcon, SearchIcon } from '../components/icons';

const ICONS: Record<string, (props: { color: string; size?: number }) => React.ReactElement> = {
  Home: HomeIcon,
  Search: SearchIcon,
  Ranking: CrownIcon,
  Profile: MaskIcon,
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const LD = useLD();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: LD.bg,
        borderTopWidth: 1,
        borderTopColor: LD.border,
      }}
    >
      {state.routes.map((route, idx) => {
        const focused = state.index === idx;
        const isPlus = route.name === 'Create';
        const Icon = ICONS[route.name];
        const labelMap: Record<string, string> = {
          Home: 'Hoje',
          Search: 'Buscar',
          Create: 'Criar',
          Ranking: 'Ranking',
          Profile: 'Perfil',
        };
        const label = labelMap[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', gap: 4 }}
            accessibilityRole="button"
            accessibilityLabel={label}
          >
            {isPlus ? (
              <View
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: focused ? LD.gold : LD.surface3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT_DISP,
                    fontSize: 24,
                    color: focused ? LD.textInk : LD.text,
                    lineHeight: 24,
                  }}
                >
                  +
                </Text>
              </View>
            ) : (
              Icon && <Icon color={focused ? LD.gold : LD.textMuted} size={22} />
            )}
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 9,
                color: focused ? LD.gold : LD.textMuted,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
