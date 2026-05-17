import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckIcon, LuchaMask, Pill, SectionLabel } from '../../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { CheckinStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CheckinStackParamList, 'Done'>;

const IMPACT = [
  { name: 'Artur', battle: '1v1 · dia 3/5', status: 'safe' as const, label: 'Já checou às 09:18' },
  { name: 'Mariana', battle: '1v1 · dia 4/5', status: 'attack' as const, label: 'Atacando a partir de 14:42' },
  { name: 'Diego', battle: 'BR · dia 2/10', status: 'attack' as const, label: '+ 4 alvos sem checar' },
];

export function CheckinDoneScreen({ navigation }: Props) {
  const LD = useLD();

  return (
    <View style={{ flex: 1, backgroundColor: LD.bg }}>
      {/* gold radial */}
      <Svg style={{ position: 'absolute', inset: 0 } as any} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="goldglow" cx="50%" cy="28%" r="50%">
            <Stop offset="0%" stopColor={LD.gold} stopOpacity={0.13} />
            <Stop offset="100%" stopColor={LD.gold} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#goldglow)" />
      </Svg>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24, alignItems: 'center' }}>
          {/* Checkmark */}
          <View
            style={{
              width: 88,
              height: 88,
              backgroundColor: LD.gold,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon color={LD.textInk} size={40} weight={4} />
          </View>

          <Text style={{ fontFamily: FONT_DISP, fontSize: 56, lineHeight: 50, color: LD.text, letterSpacing: -1, marginTop: 24, textAlign: 'center' }}>
            VOCÊ{'\n'}VOLTOU.
          </Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.gold, letterSpacing: 2, marginTop: 10 }}>
            CHECK-IN · 10:42 · 15 MIN OK
          </Text>

          {/* Impact list */}
          <View style={{ marginTop: 28, alignSelf: 'stretch', gap: 8 }}>
            <SectionLabel>SEU IMPACTO HOJE</SectionLabel>
            {IMPACT.map((row) => (
              <View
                key={row.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: LD.surface,
                  borderWidth: 1,
                  borderColor: LD.border,
                }}
              >
                <LuchaMask name={row.name} size={30} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.text }}>{row.name}</Text>
                  <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2, letterSpacing: 0.5 }}>
                    {row.battle.toUpperCase()}
                  </Text>
                </View>
                <Pill variant={row.status}>{row.status === 'safe' ? 'Seguro' : 'Atacando'}</Pill>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingBottom: 28, gap: 8 }}>
          <Pressable style={{ backgroundColor: LD.gold, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 14, color: LD.textInk, letterSpacing: 1, textTransform: 'uppercase' }}>
              Compartilhar conquista
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.getParent()?.goBack()}
            style={{ paddingVertical: 14, borderWidth: 1, borderColor: LD.border, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 13, color: LD.textDim, letterSpacing: 1, textTransform: 'uppercase' }}>
              Voltar pra Home
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
