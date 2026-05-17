import { ScrollView, Text, View } from 'react-native';
import { LuchaMask, ScreenShell } from '../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';

type Opportunity = {
  name: string;
  type: '1v1' | 'br';
  duration: number;
  gym: string;
  record?: string;
  count?: string;
  stake: string;
  hot?: boolean;
  danger?: boolean;
};

const OPPS: Opportunity[] = [
  { name: 'Lucas', type: '1v1', duration: 5, gym: 'Mesma academia', record: '8-2', stake: '+15 pts', hot: true },
  { name: 'Helena', type: '1v1', duration: 10, gym: 'Mesma academia', record: '4-6', stake: '+22 pts' },
  { name: 'Diego', type: 'br', duration: 7, gym: 'Sala Cycle', count: '4/6 pessoas', stake: '+30 pts' },
  { name: 'Pedro', type: '1v1', duration: 15, gym: 'Bio Ritmo F.L.', record: '21-3', stake: '+50 pts', danger: true },
  { name: 'BR Sexta', type: 'br', duration: 5, gym: 'Mesma academia', count: '3/8 pessoas', stake: '+18 pts' },
];

const FILTERS = [
  { l: 'Todos', a: false },
  { l: '1v1', a: true },
  { l: 'BR', a: false },
  { l: '5 DIAS', a: false },
  { l: '10 DIAS', a: false },
];

export function SearchScreen() {
  const LD = useLD();
  return (
    <ScreenShell>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, letterSpacing: -0.5, lineHeight: 36 }}>
          BUSCAR ADVERSÁRIOS
        </Text>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 6 }}>5 batalhas abertas agora.</Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 18, borderBottomWidth: 1, borderBottomColor: LD.border }}>
        <Tab label="Minha academia" count={3} active />
        <Tab label="Todas" count={47} />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 14, gap: 6 }}
      >
        {FILTERS.map((f) => (
          <View
            key={f.l}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: f.a ? LD.gold : LD.surface,
              borderWidth: 1,
              borderColor: f.a ? LD.gold : LD.border,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 10,
                color: f.a ? LD.textInk : LD.textDim,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {f.l}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Opportunities */}
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {OPPS.map((o) => (
          <View
            key={o.name}
            style={{
              backgroundColor: LD.surface,
              borderWidth: 1,
              borderColor: o.hot ? LD.gold : o.danger ? LD.bloodDeep : LD.border,
              padding: 14,
              flexDirection: 'row',
              gap: 12,
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {o.hot && (
              <View style={{ position: 'absolute', top: -1, right: -1, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: LD.gold }}>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 8, color: LD.textInk, letterSpacing: 1, fontWeight: '700' }}>
                  ACEITA AGORA
                </Text>
              </View>
            )}
            {o.danger && (
              <View style={{ position: 'absolute', top: -1, right: -1, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: LD.blood }}>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 8, color: '#fff', letterSpacing: 1, fontWeight: '700' }}>FERA</Text>
              </View>
            )}
            <LuchaMask name={o.name} size={48} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 14, color: LD.text }}>{o.name}</Text>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}> · {o.gym.toUpperCase()}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: LD.surface3 }}>
                  <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.gold, letterSpacing: 1 }}>{o.type.toUpperCase()}</Text>
                </View>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>{o.duration} DIAS</Text>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>
                  · {o.record || o.count}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.gold, lineHeight: 18 }}>{o.stake}</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 8, color: LD.textMuted, letterSpacing: 1, marginTop: 2 }}>SE VENCER</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

function Tab({ label, count, active }: { label: string; count: number; active?: boolean }) {
  const LD = useLD();
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: active ? LD.gold : 'transparent',
        marginBottom: -1,
      }}
    >
      <Text
        style={{
          fontFamily: FONT_UI_BOLD,
          fontSize: 12,
          color: active ? LD.text : LD.textMuted,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label} <Text style={{ color: active ? LD.gold : LD.textMuted }}>· {count}</Text>
      </Text>
    </View>
  );
}
