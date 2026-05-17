import { View, Text } from 'react-native';
import { useLD, FONT_MONO, FONT_MONO_BOLD } from '../theme';

type Props = {
  value: number;
  max?: number;
  segments?: number;
  height?: number;
  showNumeric?: boolean;
  align?: 'left' | 'right';
  label?: string;
};

export function HPBar({
  value,
  max = 100,
  segments = 10,
  height = 14,
  showNumeric = true,
  align = 'left',
  label,
}: Props) {
  const LD = useLD();
  const pct = Math.max(0, Math.min(1, value / max));
  const filledExact = pct * segments;
  const color = pct > 0.5 ? LD.hpHi : pct > 0.25 ? LD.hpMid : LD.hpLow;
  const reversed = align === 'right';

  return (
    <View style={{ width: '100%', gap: 4 }}>
      {(label || showNumeric) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: align === 'right' ? 'flex-end' : 'space-between',
          }}
        >
          {label && align !== 'right' && (
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.5, color: LD.textDim }}>
              {label}
            </Text>
          )}
          {showNumeric && (
            <Text style={{ fontFamily: FONT_MONO_BOLD, fontSize: 10 }}>
              <Text style={{ color }}>{Math.round(value)}</Text>
              <Text style={{ color: LD.textMuted }}> / {max}</Text>
            </Text>
          )}
          {label && align === 'right' && (
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.5, color: LD.textDim }}>
              {label}
            </Text>
          )}
        </View>
      )}
      <View
        style={{
          flexDirection: reversed ? 'row-reverse' : 'row',
          gap: 2,
          height,
          backgroundColor: LD.surface,
          padding: 2,
          borderWidth: 1,
          borderColor: LD.border,
        }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const floor = Math.floor(filledExact);
          const frac = i < floor ? 1 : i === floor ? filledExact - floor : 0;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                position: 'relative',
                backgroundColor: LD.surface2,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  [reversed ? 'right' : 'left']: 0,
                  width: `${frac * 100}%`,
                  backgroundColor: color,
                }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

type LineProps = { value: number; max?: number; color?: string; height?: number };

export function HPLine({ value, max = 100, color, height = 4 }: LineProps) {
  const LD = useLD();
  const pct = Math.max(0, Math.min(1, value / max));
  const c = color ?? (pct > 0.5 ? LD.hpHi : pct > 0.25 ? LD.hpMid : LD.hpLow);
  return (
    <View style={{ height, width: '100%', backgroundColor: LD.surface2, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${pct * 100}%`, backgroundColor: c }} />
    </View>
  );
}
