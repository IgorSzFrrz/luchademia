import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlameIcon, LuchaMask, ScreenShell, SectionLabel } from '../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import { useAuth } from '../store/auth';
import type { AppStackParamList } from '../navigation/types';

const HISTORY = [
  { opp: 'Lucas', type: '1v1', dur: '5d', result: 'V' as const, label: '+12' },
  { opp: 'BR · 6 pessoas', type: 'BR', dur: '7d', result: 'V' as const, label: '#2' },
  { opp: 'Pedro', type: '1v1', dur: '15d', result: 'D' as const, label: '−1' },
  { opp: 'Sofia', type: '1v1', dur: '10d', result: 'V' as const, label: '+44' },
];

export function ProfileScreen() {
  const LD = useLD();
  const nav = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const signOut = useAuth((s) => s.signOut);

  return (
    <ScreenShell paddingTop={0}>
      {/* Hero with gradient */}
      <LinearGradient
        colors={[LD.surface2, LD.bg]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
              Editar
            </Text>
          </Pressable>
          <Pressable
            onPress={signOut}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
              ⚙ Config
            </Text>
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <LuchaMask name="Bruno" size={96} />
          <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, lineHeight: 36, marginTop: 12, letterSpacing: -0.5, textAlign: 'center' }}>
            BRUNO "THE PIVOT"
          </Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.gold, letterSpacing: 2, marginTop: 6 }}>
            RANK #7 · TOP 5%
          </Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, letterSpacing: 1, marginTop: 4 }}>
            SMART FIT VILA MADALENA · DESDE FEV/26
          </Text>
        </View>
      </LinearGradient>

      {/* Stat grid */}
      <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <StatCard label="VITÓRIAS" value="12" accent={LD.vital} />
        <StatCard label="DERROTAS" value="4" accent={LD.blood} />
        <StatCard label="WIN RATE" value="75%" accent={LD.gold} />
        <StatCard label="CHECK-INS" value="89" accent={LD.text} />
      </View>

      {/* Streak card (links to Conquistas) */}
      <Pressable
        onPress={() => nav.navigate('Conquistas')}
        style={{
          marginTop: 12,
          marginHorizontal: 20,
          padding: 14,
          backgroundColor: LD.surface,
          borderWidth: 1,
          borderColor: LD.gold,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <View style={{ width: 44, height: 44, backgroundColor: LD.gold, alignItems: 'center', justifyContent: 'center' }}>
          <FlameIcon color={LD.textInk} size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.textDim }}>SEQUÊNCIA ATUAL</Text>
          <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: LD.gold, lineHeight: 28, marginTop: 2 }}>23 DIAS</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>RECORDE</Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 12, color: LD.text, marginTop: 2 }}>34 dias</Text>
        </View>
      </Pressable>

      {/* Histórico */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <SectionLabel style={{ marginBottom: 10 }}>HISTÓRICO RECENTE</SectionLabel>
        {HISTORY.map((h, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: LD.surface2,
            }}
          >
            <View
              style={{
                width: 26,
                height: 26,
                backgroundColor: h.result === 'V' ? LD.vital : LD.blood,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: FONT_DISP, fontSize: 14, color: '#fff' }}>{h.result}</Text>
            </View>
            <LuchaMask name={h.opp} size={26} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.text }}>{h.opp}</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1, marginTop: 1 }}>
                {h.type} · {h.dur}
              </Text>
            </View>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 12, color: h.result === 'V' ? LD.vital : LD.blood }}>{h.label}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={{
          marginTop: 18,
          marginHorizontal: 20,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: LD.border,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.textDim, letterSpacing: 1, textTransform: 'uppercase' }}>
          Trocar academia
        </Text>
      </Pressable>
    </ScreenShell>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  const LD = useLD();
  return (
    <View
      style={{
        flexBasis: '48%',
        flexGrow: 1,
        padding: 14,
        backgroundColor: LD.surface,
        borderWidth: 1,
        borderColor: LD.border,
      }}
    >
      <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>{label}</Text>
      <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: accent, lineHeight: 36, marginTop: 4 }}>{value}</Text>
    </View>
  );
}
