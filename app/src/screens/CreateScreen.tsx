import { Pressable, Text, View } from 'react-native';
import { CheckIcon, ChevronDownIcon, LuchaMask, ScreenShell, SectionLabel } from '../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';

const DURATIONS = [
  { d: 5, hp: 200, a: false },
  { d: 10, hp: 400, a: true },
  { d: 15, hp: 600, a: false },
  { d: 30, hp: 1200, a: false },
];

export function CreateScreen() {
  const LD = useLD();
  return (
    <ScreenShell>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, letterSpacing: -0.5, lineHeight: 36 }}>
          CRIAR BATALHA
        </Text>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 6 }}>Você tem 7 slots livres.</Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 18 }}>
        {/* TIPO */}
        <View>
          <SectionLabel style={{ marginBottom: 8 }}>TIPO</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TypeCard label="1V1" sub="Duelo direto" active />
            <TypeCard label="BR" sub="3 a 10 pessoas" />
          </View>
        </View>

        {/* DURAÇÃO */}
        <View>
          <SectionLabel style={{ marginBottom: 8 }}>DURAÇÃO · HP TOTAL</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {DURATIONS.map((p) => (
              <View
                key={p.d}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: 'center',
                  backgroundColor: p.a ? LD.gold : LD.surface,
                  borderWidth: 1,
                  borderColor: p.a ? LD.gold : LD.border,
                }}
              >
                <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: p.a ? LD.textInk : LD.text, lineHeight: 22 }}>{p.d}</Text>
                <Text
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 9,
                    color: p.a ? LD.textInk : LD.textDim,
                    letterSpacing: 1,
                    marginTop: 2,
                    opacity: 0.8,
                  }}
                >
                  {p.hp} HP
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ADVERSÁRIO */}
        <View>
          <SectionLabel style={{ marginBottom: 8 }}>ADVERSÁRIO</SectionLabel>
          <View
            style={{
              padding: 14,
              backgroundColor: LD.surface,
              borderWidth: 1,
              borderColor: LD.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <LuchaMask name="Helena" size={36} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 13, color: LD.text }}>Helena</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2, letterSpacing: 1 }}>
                SMART FIT V. MADALENA · W4 L6
              </Text>
            </View>
            <Pressable style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: LD.border }}>
              <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.textDim, letterSpacing: 1, textTransform: 'uppercase' }}>
                Trocar
              </Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: LD.border }} />
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>OU</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: LD.border }} />
          </View>
          <Pressable
            style={{
              marginTop: 8,
              paddingVertical: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: LD.border,
              borderStyle: 'dashed',
            }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 12,
                color: LD.textDim,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Gerar link de convite
            </Text>
          </Pressable>
        </View>

        {/* AVANÇADO collapsed */}
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: LD.surface,
            borderWidth: 1,
            borderColor: LD.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text }}>Parâmetros avançados</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2, letterSpacing: 1 }}>
              JANELA · DANO · GRAÇA · NO-SHOW
            </Text>
          </View>
          <ChevronDownIcon color={LD.textDim} />
        </View>
      </View>

      {/* Resumo */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
        <View
          style={{
            padding: 16,
            backgroundColor: LD.surface2,
            borderWidth: 1,
            borderColor: LD.gold,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <View>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>RESUMO</Text>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.text, lineHeight: 18, marginTop: 4 }}>
                BRUNO <Text style={{ color: LD.blood }}>VS</Text> HELENA
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: LD.gold, lineHeight: 28 }}>10D</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1, marginTop: 2 }}>400 HP</Text>
            </View>
          </View>
          <Pressable style={{ backgroundColor: LD.gold, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 14, color: LD.textInk, letterSpacing: 1, textTransform: 'uppercase' }}>
              Enviar desafio
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenShell>
  );
}

function TypeCard({ label, sub, active }: { label: string; sub: string; active?: boolean }) {
  const LD = useLD();
  return (
    <View
      style={{
        flex: 1,
        padding: 14,
        backgroundColor: active ? LD.surface2 : LD.surface,
        borderWidth: 1,
        borderColor: active ? LD.gold : LD.border,
        position: 'relative',
      }}
    >
      <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: active ? LD.gold : LD.text, lineHeight: 22 }}>{label}</Text>
      <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 11, color: LD.textDim, marginTop: 4 }}>{sub}</Text>
      {active && (
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <CheckIcon color={LD.gold} size={14} />
        </View>
      )}
    </View>
  );
}
