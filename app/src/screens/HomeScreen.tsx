import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import {
  BigNumber,
  CrossIcon,
  HPBar,
  LuchaMask,
  Pill,
  PinIcon,
  ScreenShell,
  SectionLabel,
  StarIcon,
} from '../components';
import {
  useLD,
  FONT_DISP,
  FONT_MONO,
  FONT_MONO_BOLD,
  FONT_UI_SEMI,
  FONT_UI_BOLD,
} from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Battle1v1 = {
  id: string;
  type: '1v1';
  name: string;
  opp: string;
  you: number;
  oppHp: number;
  max: number;
  days: string;
  youStatus: 'attack' | 'safe' | 'danger';
  lastEvent: string;
};

type BattleBR = {
  id: string;
  type: 'br';
  participants: number;
  you: number;
  max: number;
  days: string;
  position: number;
  alive: number;
  lastEvent: string;
};

const BATTLES_1V1: Battle1v1[] = [
  {
    id: 'b1',
    type: '1v1',
    name: 'Bruno',
    opp: 'Mariana',
    you: 88,
    oppHp: 124,
    max: 200,
    days: '4 / 5',
    youStatus: 'danger',
    lastEvent: 'Mariana atacando há 1h42 · −2 HP/h',
  },
];

const BATTLES_BR: BattleBR[] = [
  {
    id: 'b2',
    type: 'br',
    participants: 6,
    you: 240,
    max: 400,
    days: '2 / 10',
    position: 2,
    alive: 5,
    lastEvent: '3 atacando você · Diego ainda não checou',
  },
];

export function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const LD = useLD();

  return (
    <ScreenShell>
      {/* Header strip */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <LuchaMask name="Bruno" size={32} />
          <View>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
              SMART FIT V. MADALENA
            </Text>
            <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.text }}>Bruno · W12 L4</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: LD.surface2,
            borderWidth: 1,
            borderColor: LD.border,
          }}
        >
          <StarIcon color={LD.gold} size={12} />
          <Text style={{ fontFamily: FONT_DISP, fontSize: 14, color: LD.gold }}>12</Text>
        </View>
      </View>

      {/* TODAY hero card */}
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 16,
          padding: 20,
          backgroundColor: LD.surface,
          borderWidth: 1,
          borderColor: LD.borderHi,
        }}
      >
        <Text
          style={{
            position: 'absolute',
            top: 8,
            right: 12,
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: LD.blood,
            letterSpacing: 2,
          }}
        >
          HOJE · QUI 21/05
        </Text>
        <SectionLabel color={LD.textDim} style={{ marginTop: 10 }}>
          VOCÊ AINDA NÃO CHECOU
        </SectionLabel>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
          <BigNumber value="−3" color={LD.blood} size={68} />
          <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim }}>HP perdidos hoje</Text>
        </View>

        <View
          style={{
            marginTop: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: LD.bg,
            borderWidth: 1,
            borderColor: LD.border,
            borderStyle: 'dashed',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>JANELA</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 13, color: LD.text, marginTop: 2 }}>05:00 → 23:00</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>FECHA EM</Text>
            <Text style={{ fontFamily: FONT_MONO_BOLD, fontSize: 13, color: LD.gold, marginTop: 2 }}>15:36:12</Text>
          </View>
        </View>

        <Pressable
          onPress={() => nav.navigate('Checkin', { screen: 'Arrival' })}
          style={{
            marginTop: 14,
            backgroundColor: LD.gold,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <PinIcon color={LD.textInk} size={18} />
          <Text
            style={{
              fontFamily: FONT_UI_BOLD,
              fontSize: 14,
              color: LD.textInk,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Dar check-in
          </Text>
        </Pressable>

        <Text
          style={{
            marginTop: 8,
            textAlign: 'center',
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: LD.textMuted,
            letterSpacing: 1,
          }}
        >
          VOCÊ ESTÁ A 280 m DA ACADEMIA
        </Text>
      </View>

      {/* Battles */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <SectionLabel>2 BATALHAS ATIVAS</SectionLabel>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.gold, letterSpacing: 1 }}>VER TUDO →</Text>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {BATTLES_1V1.map((b) => (
          <Pressable key={b.id} onPress={() => nav.navigate('BattleDetail', { battleId: b.id })}>
            <BattleCard1v1 b={b} />
          </Pressable>
        ))}
        {BATTLES_BR.map((b) => (
          <Pressable key={b.id} onPress={() => nav.navigate('BattleDetail', { battleId: b.id })}>
            <BattleCardBR b={b} />
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

function BattleCard1v1({ b }: { b: Battle1v1 }) {
  const LD = useLD();
  const pillVariant = b.youStatus === 'attack' ? 'attack' : b.youStatus === 'danger' ? 'danger' : 'safe';
  const pillText = b.youStatus === 'attack' ? 'Atacando' : b.youStatus === 'danger' ? '−2 HP/h' : 'Seguro';

  return (
    <View
      style={{
        backgroundColor: LD.surface,
        borderWidth: 1,
        borderColor: LD.border,
        padding: 14,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <LuchaMask name={b.name} size={32} />
          <View>
            <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 11, color: LD.text }}>VOCÊ</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.text, lineHeight: 18 }}>{b.you}</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.textMuted }}> /{b.max}</Text>
            </View>
          </View>
        </View>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.textMuted, letterSpacing: 1 }}>VS</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 11, color: LD.text }}>{b.opp.toUpperCase()}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.text, lineHeight: 18 }}>{b.oppHp}</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.textMuted }}> /{b.max}</Text>
            </View>
          </View>
          <LuchaMask name={b.opp} size={32} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 6 }}>
        <View style={{ flex: 1 }}>
          <HPBar value={b.you} max={b.max} segments={8} height={10} showNumeric={false} align="right" />
        </View>
        <View style={{ flex: 1 }}>
          <HPBar value={b.oppHp} max={b.max} segments={8} height={10} showNumeric={false} />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: LD.border,
        }}
      >
        <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
          DIA {b.days}
        </Text>
        <Pill variant={pillVariant}>{pillText}</Pill>
      </View>
    </View>
  );
}

function BattleCardBR({ b }: { b: BattleBR }) {
  const LD = useLD();
  return (
    <View
      style={{
        backgroundColor: LD.surface,
        borderWidth: 1,
        borderColor: LD.border,
        padding: 14,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ backgroundColor: LD.surface3, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 14, color: LD.text, letterSpacing: 1 }}>
              BR · {b.participants}
            </Text>
          </View>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
            DIA {b.days}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>POS</Text>
          <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: LD.gold, lineHeight: 22 }}>#{b.position}</Text>
        </View>
      </View>

      {/* avatars row */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: b.participants }).map((_, i) => (
          <View key={i} style={{ flex: 1, position: 'relative', opacity: i < b.alive ? 1 : 0.3 }}>
            <LuchaMask name={`BR${i}`} size={36} style={{ width: '100%' as any }} />
            {i >= b.alive && (
              <View
                style={{
                  position: 'absolute',
                  inset: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}
              >
                <CrossIcon color={LD.blood} size={14} />
              </View>
            )}
            {i === 1 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: '50%',
                  marginLeft: -3,
                  width: 6,
                  height: 6,
                  backgroundColor: LD.gold,
                  borderWidth: 1,
                  borderColor: LD.bg,
                  borderRadius: 3,
                }}
              />
            )}
          </View>
        ))}
      </View>

      <HPBar value={b.you} max={b.max} segments={10} height={8} showNumeric label="SEU HP" />

      <View
        style={{
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: LD.border,
        }}
      >
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 11, color: LD.textDim }}>{b.lastEvent}</Text>
      </View>
    </View>
  );
}
