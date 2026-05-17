import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Line, Polyline, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BigNumber, HPBar, LuchaMask, Pill, SectionLabel } from '../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'BattleDetail'>;

const YOU_HP = [200, 195, 188, 180, 156];
const OPP_HP = [200, 192, 174, 150, 132];

type DayRow = {
  d: number;
  dateLabel: string;
  youAt: string | null;
  oppAt: string | null;
  youDmg: number;
  oppDmg: number;
  note?: string;
  today?: boolean;
  future?: boolean;
};

const DAYS: DayRow[] = [
  { d: 1, dateLabel: 'SEG', youAt: '06:42', oppAt: '07:11', youDmg: -5, oppDmg: -8, note: 'Ambos cedo' },
  { d: 2, dateLabel: 'TER', youAt: '11:50', oppAt: '08:30', youDmg: -7, oppDmg: -18, note: 'Você atrasou' },
  { d: 3, dateLabel: 'QUA', youAt: '07:08', oppAt: '14:20', youDmg: -8, oppDmg: -24, note: 'Artur só foi tarde' },
  { d: 4, dateLabel: 'QUI', youAt: '10:42', oppAt: '10:15', youDmg: -24, oppDmg: -18, note: 'Hoje · Artur foi mais cedo', today: true },
  { d: 5, dateLabel: 'SEX', youAt: null, oppAt: null, youDmg: 0, oppDmg: 0, future: true },
];

export function BattleDetailScreen({ navigation }: Props) {
  const LD = useLD();
  const W = 280;
  const H = 80;
  const max = 200;
  const stepX = W / (YOU_HP.length - 1);

  const youPts = YOU_HP.map((v, i) => `${i * stepX},${H - (v / max) * H}`).join(' ');
  const oppPts = OPP_HP.map((v, i) => `${i * stepX},${H - (v / max) * H}`).join(' ');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
              ‹ Voltar
            </Text>
          </Pressable>
          <Pill variant="live">Ao vivo</Pill>
        </View>

        {/* VS hero */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <LuchaMask name="Bruno" size={64} />
              <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text, letterSpacing: 0.5 }}>BRUNO</Text>
              <BigNumber value="156" color={LD.text} size={36} suffix="/200" />
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 48, color: LD.blood, letterSpacing: -1, lineHeight: 48 }}>VS</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>DIA 4 / 5</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <LuchaMask name="Artur" size={64} />
              <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text, letterSpacing: 0.5 }}>ARTUR</Text>
              <BigNumber value="132" color={LD.text} size={36} suffix="/200" />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <View style={{ flex: 1 }}>
              <HPBar value={156} max={200} segments={10} height={12} showNumeric={false} align="right" />
            </View>
            <View style={{ flex: 1 }}>
              <HPBar value={132} max={200} segments={10} height={12} showNumeric={false} />
            </View>
          </View>
        </View>

        {/* Sparkline card */}
        <View style={{ marginHorizontal: 20, marginBottom: 18, padding: 14, backgroundColor: LD.surface, borderWidth: 1, borderColor: LD.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <SectionLabel>HP AO LONGO DOS DIAS</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Legend swatchColor={LD.gold} label="VOCÊ" />
              <Legend swatchColor={LD.blood} label="ARTUR" />
            </View>
          </View>
          <Svg width="100%" height={80} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            {[0, 0.5, 1].map((p) => (
              <Line key={p} x1={0} y1={H * p} x2={W} y2={H * p} stroke={LD.surface2} strokeWidth={1} />
            ))}
            <Polyline points={youPts} fill="none" stroke={LD.gold} strokeWidth={2.5} />
            <Polyline points={oppPts} fill="none" stroke={LD.blood} strokeWidth={2.5} />
            {YOU_HP.map((v, i) => (
              <Rect key={'y' + i} x={i * stepX - 3} y={H - (v / max) * H - 3} width={6} height={6} fill={LD.gold} />
            ))}
            {OPP_HP.map((v, i) => (
              <Rect key={'o' + i} x={i * stepX - 3} y={H - (v / max) * H - 3} width={6} height={6} fill={LD.blood} />
            ))}
          </Svg>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            {['D1', 'D2', 'D3', 'D4', 'D5'].map((d) => (
              <Text key={d} style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
                {d}
              </Text>
            ))}
          </View>
        </View>

        {/* Timeline */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionLabel style={{ marginBottom: 10 }}>TIMELINE</SectionLabel>
          <View style={{ gap: 8 }}>
            {DAYS.map((d) => {
              const today = !!d.today;
              const future = !!d.future;
              return (
                <View
                  key={d.d}
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    backgroundColor: today ? LD.tintGold : LD.surface,
                    borderWidth: 1,
                    borderColor: today ? LD.gold : future ? LD.surface2 : LD.border,
                    opacity: future ? 0.5 : 1,
                  }}
                >
                  <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 36 }}>
                    <Text style={{ fontFamily: FONT_MONO, fontSize: 8, color: LD.textMuted, letterSpacing: 1 }}>{d.dateLabel}</Text>
                    <Text style={{ fontFamily: FONT_DISP, fontSize: 24, color: today ? LD.gold : LD.text, lineHeight: 24 }}>
                      D{d.d}
                    </Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: LD.border }} />
                  <View style={{ flex: 1 }}>
                    {future ? (
                      <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.textMuted, letterSpacing: 1 }}>
                        AMANHÃ · BATALHA TERMINA
                      </Text>
                    ) : (
                      <>
                        <Row name="Bruno" at={d.youAt!} dmg={d.youDmg} />
                        <Row name="Artur" at={d.oppAt!} dmg={d.oppDmg} mt={4} />
                        {d.note ? (
                          <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 10, color: LD.textDim, marginTop: 6, fontStyle: 'italic' }}>
                            {d.note}
                          </Text>
                        ) : null}
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ name, at, dmg, mt }: { name: string; at: string; dmg: number; mt?: number }) {
  const LD = useLD();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: mt }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <LuchaMask name={name} size={18} />
        <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.text }}>{at}</Text>
      </View>
      <Text style={{ fontFamily: FONT_DISP, fontSize: 16, color: LD.blood }}>{dmg}</Text>
    </View>
  );
}

function Legend({ swatchColor, label }: { swatchColor: string; label: string }) {
  const LD = useLD();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ width: 8, height: 2, backgroundColor: swatchColor }} />
      <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>{label}</Text>
    </View>
  );
}
