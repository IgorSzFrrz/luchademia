import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionLabel } from '../../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { CheckinStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CheckinStackParamList, 'Stay'>;

export function CheckinStayScreen({ navigation }: Props) {
  const LD = useLD();
  const total = 15 * 60;
  const remaining = 8 * 60 + 23;
  const pct = 1 - remaining / total;
  const R = 90;
  const C = 2 * Math.PI * R;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => navigation.getParent()?.goBack()}
          style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
        >
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
            Sair
          </Text>
        </Pressable>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textDim, letterSpacing: 1 }}>CHECK-IN 2/3</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' }}>
        <SectionLabel>RELÓGIO RODANDO</SectionLabel>

        {/* Big circular timer */}
        <View style={{ width: 220, height: 220, marginTop: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={220} height={220} viewBox="0 0 200 200" style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={100} cy={100} r={R} fill="none" stroke={LD.surface2} strokeWidth={3} />
            <Circle
              cx={100}
              cy={100}
              r={R}
              fill="none"
              stroke={LD.gold}
              strokeWidth={3}
              strokeDasharray={`${C}`}
              strokeDashoffset={C * (1 - pct)}
            />
            {Array.from({ length: 60 }).map((_, i) => {
              const a = (i / 60) * Math.PI * 2;
              const r1 = 78;
              const r2 = 84;
              const x1 = 100 + Math.cos(a) * r1;
              const y1 = 100 + Math.sin(a) * r1;
              const x2 = 100 + Math.cos(a) * r2;
              const y2 = 100 + Math.sin(a) * r2;
              return (
                <Line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 5 === 0 ? LD.textDim : LD.surface3}
                  strokeWidth={1}
                />
              );
            })}
          </Svg>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, letterSpacing: 2 }}>FALTA</Text>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 64, lineHeight: 60, color: LD.text, marginTop: 4, letterSpacing: -1 }}>
              08:23
            </Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.gold, letterSpacing: 2, marginTop: 4 }}>MIN : SEG</Text>
          </View>
        </View>

        {/* Monitoring strip */}
        <View
          style={{
            marginTop: 36,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: LD.surface,
            borderWidth: 1,
            borderColor: LD.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            alignSelf: 'stretch',
          }}
        >
          <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: LD.vital }} />
            <View
              style={{
                position: 'absolute',
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: LD.vital,
                opacity: 0.4,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text }}>Monitorando posição</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2 }}>
              −23.557, −46.689 · 12 m do centro
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: 16, fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.textDim, textAlign: 'center', lineHeight: 18 }}>
          Pode fechar o app e treinar.{'\n'}3 min de tolerância para banheiro / bebedouro.
        </Text>

        {/* DEV: skip to done */}
        <Pressable
          onPress={() => navigation.navigate('Done')}
          style={{ marginTop: 'auto', paddingVertical: 12 }}
        >
          <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, letterSpacing: 2 }}>
            ▸ AVANÇAR (DEV)
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
