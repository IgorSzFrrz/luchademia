import { useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { useLD, FONT_UI_BOLD } from '../theme';

export type PillVariant = 'attack' | 'safe' | 'danger' | 'gold' | 'neutral' | 'live';

type Props = {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: 'sm' | 'md';
};

export function Pill({ children, variant = 'neutral', size = 'sm' }: Props) {
  const LD = useLD();
  const styles = {
    attack: { bg: LD.tintAttack, fg: LD.vital, border: LD.tintAttackBorder },
    safe: { bg: LD.surface2, fg: LD.textDim, border: LD.border },
    danger: { bg: LD.tintDanger, fg: LD.blood, border: LD.tintDangerBorder },
    gold: { bg: LD.tintGold, fg: LD.gold, border: LD.tintGoldBorder },
    neutral: { bg: LD.surface2, fg: LD.text, border: LD.border },
    live: { bg: LD.blood, fg: '#FFFFFF', border: LD.blood },
  } as const;
  const s = styles[variant];

  const pad = size === 'sm' ? { paddingVertical: 3, paddingHorizontal: 8 } : { paddingVertical: 5, paddingHorizontal: 12 };
  const fontSize = size === 'sm' ? 9 : 11;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        ...pad,
        backgroundColor: s.bg,
        borderWidth: 1,
        borderColor: s.border,
      }}
    >
      {variant === 'live' && <PulseDot />}
      <Text
        style={{
          fontFamily: FONT_UI_BOLD,
          fontSize,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: s.fg,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function PulseDot() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        opacity,
      }}
    />
  );
}
