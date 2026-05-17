import { Text, View } from 'react-native';
import { CrownTopIcon, LuchaMask, ScreenShell } from '../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';

const TOP = [
  { pos: 1, name: 'Mariana', gym: 'BIO RITMO F.L.', wr: 87, w: 27, l: 4, hot: true },
  { pos: 2, name: 'Pedro', gym: 'SMART FIT V.M.', wr: 84, w: 21, l: 4 },
  { pos: 3, name: 'Diego', gym: 'CROSSFIT P.', wr: 78, w: 14, l: 4 },
  { pos: 4, name: 'Helena', gym: 'SMART FIT V.M.', wr: 71, w: 12, l: 5 },
  { pos: 5, name: 'Artur', gym: 'BODYTECH', wr: 68, w: 17, l: 8 },
  { pos: 6, name: 'Lucas', gym: 'SELFIT', wr: 65, w: 13, l: 7 },
  { pos: 7, name: 'Bruno', gym: 'SMART FIT V.M.', wr: 64, w: 12, l: 4, you: true },
  { pos: 8, name: 'Sofia', gym: 'BIO RITMO', wr: 62, w: 18, l: 11 },
];

const TABS = [
  { l: 'Individual', a: true },
  { l: 'Battle Royale', a: false },
  { l: 'Academia', a: false },
];

export function RankingScreen() {
  const LD = useLD();
  return (
    <ScreenShell>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, letterSpacing: -0.5, lineHeight: 36 }}>RANKING</Text>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 6 }}>
          Você é o <Text style={{ color: LD.gold, fontFamily: FONT_UI_BOLD }}>#7</Text> · top 5% no Brasil.
        </Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, borderBottomWidth: 1, borderBottomColor: LD.border }}>
        {TABS.map((t) => (
          <View
            key={t.l}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: t.a ? LD.gold : 'transparent',
              marginBottom: -1,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 11,
                color: t.a ? LD.text : LD.textMuted,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {t.l}
            </Text>
          </View>
        ))}
      </View>

      {/* Podium */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, justifyContent: 'center' }}>
          {/* #2 */}
          <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <LuchaMask name="Pedro" size={48} />
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text }}>PEDRO</Text>
            <View
              style={{
                width: '100%',
                height: 60,
                backgroundColor: LD.surface2,
                borderWidth: 1,
                borderColor: LD.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: '#C0C5CC', lineHeight: 28 }}>#2</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1, marginTop: 2 }}>84%</Text>
            </View>
          </View>
          {/* #1 */}
          <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <View style={{ position: 'relative' }}>
              <LuchaMask name="Mariana" size={64} />
              <View style={{ position: 'absolute', top: -16, alignSelf: 'center' }}>
                <CrownTopIcon gold={LD.gold} deep={LD.goldDeep} blood={LD.blood} />
              </View>
            </View>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.gold }}>MARIANA</Text>
            <View
              style={{
                width: '100%',
                height: 90,
                backgroundColor: LD.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: FONT_DISP, fontSize: 42, color: LD.textInk, lineHeight: 42 }}>#1</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textInk, letterSpacing: 1, marginTop: 2, fontWeight: '700' }}>
                87% WR
              </Text>
            </View>
          </View>
          {/* #3 */}
          <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <LuchaMask name="Diego" size={48} />
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text }}>DIEGO</Text>
            <View
              style={{
                width: '100%',
                height: 40,
                backgroundColor: LD.surface2,
                borderWidth: 1,
                borderColor: LD.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: '#A87F4D', lineHeight: 22 }}>#3</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1, marginTop: 2 }}>78%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 6, paddingBottom: 6 }}>
          <Text style={{ width: 28, fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>#</Text>
          <Text style={{ flex: 1, fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>NOME</Text>
          <Text style={{ width: 60, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>WR</Text>
          <Text style={{ width: 50, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>W·L</Text>
        </View>

        {TOP.slice(3).map((p) => (
          <View
            key={p.pos}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 6,
              paddingVertical: 10,
              backgroundColor: p.you ? LD.tintGold : 'transparent',
              borderWidth: 1,
              borderColor: p.you ? LD.gold : 'transparent',
              borderBottomWidth: 1,
              borderBottomColor: p.you ? LD.gold : LD.surface2,
            }}
          >
            <Text style={{ width: 28, fontFamily: FONT_DISP, fontSize: 16, color: p.you ? LD.gold : LD.textDim }}>#{p.pos}</Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LuchaMask name={p.name} size={26} />
              <View style={{ minWidth: 0, flex: 1 }}>
                <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: p.you ? LD.gold : LD.text }}>
                  {p.name}{p.you ? ' · você' : ''}
                </Text>
                <Text numberOfLines={1} style={{ fontFamily: FONT_MONO, fontSize: 8, color: LD.textMuted, letterSpacing: 1, marginTop: 1 }}>
                  {p.gym}
                </Text>
              </View>
            </View>
            <Text
              style={{
                width: 60,
                textAlign: 'right',
                fontFamily: FONT_DISP,
                fontSize: 16,
                color: p.wr > 70 ? LD.vital : LD.text,
              }}
            >
              {p.wr}%
            </Text>
            <Text style={{ width: 50, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 11, color: LD.textDim }}>
              {p.w}·{p.l}
            </Text>
          </View>
        ))}

        <View
          style={{
            marginTop: 14,
            padding: 10,
            backgroundColor: LD.surface,
            borderWidth: 1,
            borderColor: LD.border,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textDim, letterSpacing: 0.5 }}>
            MÍN. 10 BATALHAS PRA APARECER · ATUALIZADO 14:02
          </Text>
        </View>
      </View>
    </ScreenShell>
  );
}
