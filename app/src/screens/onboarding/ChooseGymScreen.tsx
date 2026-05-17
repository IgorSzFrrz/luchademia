import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckIcon, ChevronLeftIcon, SectionLabel } from '../../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { OnboardingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ChooseGym'>;

const GYMS = [
  { name: 'Smart Fit — Vila Madalena', dist: '0.4 km', selected: true, members: 1248 },
  { name: 'Bio Ritmo Faria Lima', dist: '0.9 km', members: 892 },
  { name: 'Selfit Pinheiros', dist: '1.2 km', members: 421 },
  { name: 'Academia BodyTech', dist: '1.8 km', members: 311 },
  { name: 'CrossFit Pinheiros', dist: '2.1 km', members: 47 },
];

export function ChooseGymScreen({ navigation }: Props) {
  const LD = useLD();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Header bar */}
          <View style={{ paddingHorizontal: 24, paddingTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 32,
                height: 32,
                borderWidth: 1,
                borderColor: LD.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeftIcon color={LD.text} />
            </Pressable>
            <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ flex: 1, height: 3, backgroundColor: i <= 1 ? LD.gold : LD.surface2 }} />
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
            <SectionLabel>PASSO 2 DE 3</SectionLabel>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 40, lineHeight: 38, color: LD.text, marginTop: 8, letterSpacing: -0.5 }}>
              ESCOLHA SEU{'\n'}RINGUE
            </Text>
            <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 10, lineHeight: 18 }}>
              Sua academia define onde o check-in vale. Você pode trocar depois.
            </Text>
          </View>

          {/* Map */}
          <View
            style={{
              marginHorizontal: 24,
              marginTop: 20,
              height: 140,
              borderWidth: 1,
              borderColor: LD.border,
              backgroundColor: LD.surface,
            }}
          >
            <Svg width="100%" height="100%" viewBox="0 0 320 140" preserveAspectRatio="none">
              {[20, 60, 100, 140, 180, 220, 260, 300].map((x) => (
                <Line key={'v' + x} x1={x} y1={0} x2={x} y2={140} stroke={LD.surface2} strokeWidth={1} />
              ))}
              {[20, 50, 80, 110, 140].map((y) => (
                <Line key={'h' + y} x1={0} y1={y} x2={320} y2={y} stroke={LD.surface2} strokeWidth={1} />
              ))}
              <Line x1={0} y1={70} x2={320} y2={70} stroke={LD.border} strokeWidth={3} />
              <Line x1={160} y1={0} x2={160} y2={140} stroke={LD.border} strokeWidth={3} />
              <Circle cx={160} cy={70} r={22} fill={LD.gold} fillOpacity={0.15} />
              <Circle cx={160} cy={70} r={6} fill={LD.gold} stroke={LD.bg} strokeWidth={2} />
              <Circle cx={100} cy={40} r={4} fill={LD.blood} />
              <Circle cx={220} cy={100} r={4} fill={LD.blood} />
              <Circle cx={60} cy={110} r={4} fill={LD.blood} />
            </Svg>
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: LD.bg,
                borderWidth: 1,
                borderColor: LD.border,
              }}
            >
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>VOCÊ AQUI</Text>
            </View>
          </View>

          {/* Gym list */}
          <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 8 }}>
            {GYMS.map((g, i) => (
              <View
                key={g.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: g.selected ? LD.surface2 : LD.surface,
                  borderWidth: 1,
                  borderColor: g.selected ? LD.gold : LD.border,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: g.selected ? LD.gold : LD.surface3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_DISP,
                      fontSize: 18,
                      color: g.selected ? LD.textInk : LD.textDim,
                    }}
                  >
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.text }}
                  >
                    {g.name}
                  </Text>
                  <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2, letterSpacing: 1 }}>
                    {g.dist} · {g.members} LUCHADORES
                  </Text>
                </View>
                {g.selected && <CheckIcon color={LD.gold} size={18} />}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
          <Pressable
            onPress={() => navigation.navigate('Ready')}
            style={{ backgroundColor: LD.gold, paddingVertical: 16, alignItems: 'center' }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 14,
                color: LD.textInk,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Confirmar Smart Fit Vila Madalena →
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
