import { Text, View, ViewStyle } from 'react-native';
import { useLD, FONT_DISP, FONT_UI_SEMI } from '../theme';

type Props = {
  value: string | number;
  color?: string;
  size?: number;
  prefix?: string;
  suffix?: string;
  style?: ViewStyle;
};

export function BigNumber({ value, color, size = 64, prefix, suffix, style }: Props) {
  const LD = useLD();
  const c = color ?? LD.text;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }, style]}>
      {prefix && (
        <Text style={{ fontFamily: FONT_DISP, fontSize: size * 0.5, color: LD.textMuted }}>{prefix}</Text>
      )}
      <Text style={{ fontFamily: FONT_DISP, fontSize: size, lineHeight: size * 0.95, color: c, letterSpacing: -1 }}>
        {value}
      </Text>
      {suffix && (
        <Text
          style={{
            fontFamily: FONT_UI_SEMI,
            fontSize: size * 0.35,
            color: LD.textDim,
            letterSpacing: 1,
          }}
        >
          {suffix}
        </Text>
      )}
    </View>
  );
}
