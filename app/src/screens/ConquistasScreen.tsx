import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CheckIcon, HPLine, LockIcon, SectionLabel } from '../components';
import { ScreenShell } from '../components/ScreenShell';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Conquistas'>;

type Achievement =
  | { state: 'unlocked'; icon: string; title: string; desc: string }
  | { state: 'progress'; icon: string; title: string; desc: string; progress: number; target: number }
  | { state: 'locked' };

const ACHIEVEMENTS: Achievement[] = [
  { state: 'unlocked', icon: '⚔', title: 'PRIMEIRO SANGUE', desc: 'Venceu sua primeira batalha.' },
  { state: 'unlocked', icon: '★', title: 'GLADIADOR I', desc: '5 vitórias em batalhas.' },
  { state: 'progress', icon: '◆', title: 'GLADIADOR II', desc: '10 vitórias em batalhas.', progress: 12, target: 25 },
  { state: 'progress', icon: '⚡', title: 'MADRUGADOR', desc: 'Check-in antes das 7h por 5 dias.', progress: 3, target: 5 },
  { state: 'unlocked', icon: '7', title: 'SEMANA CHEIA', desc: '7 dias consecutivos de check-in.' },
  { state: 'progress', icon: '30', title: '30 DIAS', desc: '30 dias consecutivos.', progress: 23, target: 30 },
  { state: 'locked' },
  { state: 'progress', icon: '♛', title: 'REI DA ACADEMIA', desc: 'Nº1 no ranking da sua academia.', progress: 7, target: 1 },
  { state: 'locked' },
  { state: 'locked' },
];

const FILTERS = ['Todas', 'Frequência', 'Batalhas', 'BR', 'Ranking'];

export function ConquistasScreen({ navigation }: Props) {
  const LD = useLD();

  return (
    <ScreenShell>
      <View style={{ paddingHorizontal: 20 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border, alignSelf: 'flex-start', marginBottom: 12 }}
        >
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
            ‹ Perfil
          </Text>
        </Pressable>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, lineHeight: 36, letterSpacing: -0.5 }}>CONQUISTAS</Text>

        {/* Progress */}
        <View
          style={{
            marginTop: 14,
            padding: 12,
            backgroundColor: LD.surface,
            borderWidth: 1,
            borderColor: LD.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <View>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>TOTAL</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 26, color: LD.gold, lineHeight: 26 }}>12</Text>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 16, color: LD.textMuted }}>/48</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <HPLine value={12} max={48} color={LD.gold} height={4} />
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1, marginTop: 6 }}>
              3 SECRETAS RESTAM
            </Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 14, gap: 6 }}
        >
          {FILTERS.map((f, i) => (
            <View
              key={f}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: i === 0 ? LD.gold : LD.surface,
                borderWidth: 1,
                borderColor: i === 0 ? LD.gold : LD.border,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_UI_BOLD,
                  fontSize: 10,
                  color: i === 0 ? LD.textInk : LD.textDim,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {f}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Grid */}
      <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {ACHIEVEMENTS.map((a, i) => (
          <View key={i} style={{ flexBasis: '48%', flexGrow: 1 }}>
            <AchievementCard a={a} />
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

function AchievementCard({ a }: { a: Achievement }) {
  const LD = useLD();

  if (a.state === 'locked') {
    return (
      <View
        style={{
          padding: 14,
          backgroundColor: LD.surface,
          borderWidth: 1,
          borderColor: LD.border,
          opacity: 0.5,
          minHeight: 130,
          gap: 6,
        }}
      >
        <View style={{ width: 36, height: 36, backgroundColor: LD.surface3, alignItems: 'center', justifyContent: 'center' }}>
          <LockIcon color={LD.textMuted} />
        </View>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: LD.textMuted, lineHeight: 22 }}>???</Text>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1, marginTop: 'auto' }}>SEGREDO</Text>
      </View>
    );
  }

  if (a.state === 'progress') {
    const pct = a.progress / a.target;
    return (
      <View
        style={{
          padding: 14,
          backgroundColor: LD.surface,
          borderWidth: 1,
          borderColor: LD.border,
          gap: 6,
          minHeight: 130,
        }}
      >
        <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: LD.text, lineHeight: 28 }}>{a.icon}</Text>
        <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text }}>{a.title}</Text>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 10, color: LD.textDim, lineHeight: 13, flex: 1 }}>{a.desc}</Text>
        <HPLine value={pct * 100} max={100} color={LD.gold} height={3} />
        <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.gold, letterSpacing: 1, marginTop: 2 }}>
          {a.progress}/{a.target}
        </Text>
      </View>
    );
  }

  // unlocked
  return (
    <View
      style={{
        padding: 14,
        backgroundColor: LD.surface2,
        borderWidth: 1,
        borderColor: LD.gold,
        gap: 6,
        minHeight: 130,
      }}
    >
      <View style={{ position: 'absolute', top: 6, right: 6 }}>
        <CheckIcon color={LD.gold} />
      </View>
      <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: LD.gold, lineHeight: 28 }}>{a.icon}</Text>
      <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text }}>{a.title}</Text>
      <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 10, color: LD.textDim, lineHeight: 13, flex: 1 }}>{a.desc}</Text>
      <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.gold, letterSpacing: 1 }}>DESBLOQUEADO · 12/MAI</Text>
    </View>
  );
}
