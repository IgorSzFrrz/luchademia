import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckIcon, Pill, SectionLabel } from '../../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { CheckinStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CheckinStackParamList, 'Done'>;

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function CheckinDoneScreen({ navigation, route }: Props) {
  const LD = useLD();
  const confirmedTime = formatTime(route.params.confirmedAt);

  return (
    <View style={{ flex: 1, backgroundColor: LD.bg }}>
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
            VOCE{'\n'}VOLTOU.
          </Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.gold, letterSpacing: 2, marginTop: 10 }}>
            CHECK-IN · {confirmedTime} · 15 MIN OK
          </Text>

          <View style={{ marginTop: 28, alignSelf: 'stretch', gap: 8 }}>
            <SectionLabel>CONFIRMACAO</SectionLabel>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 12,
                backgroundColor: LD.surface,
                borderWidth: 1,
                borderColor: LD.border,
                gap: 8,
              }}
            >
              <Row label="ACADEMIA" value={route.params.gymName} />
              <Row label="DISTANCIA" value={`${Math.round(route.params.distanceMeters)} m do centro`} />
              <Row label="DIA" value={route.params.battleDay} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 4 }}>
                <Pill variant="safe">Seguro</Pill>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingBottom: 28, gap: 8 }}>
          <Pressable
            onPress={() => navigation.getParent()?.goBack()}
            style={{ backgroundColor: LD.gold, paddingVertical: 16, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 14, color: LD.textInk, letterSpacing: 1, textTransform: 'uppercase' }}>
              Voltar pra Home
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const LD = useLD();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>{label}</Text>
      <Text style={{ flex: 1, textAlign: 'right', fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.text }}>{value}</Text>
    </View>
  );
}
