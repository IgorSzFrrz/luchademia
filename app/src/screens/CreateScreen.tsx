import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CheckIcon, ChevronDownIcon, ScreenShell, SectionLabel } from '../components';
import { createOpen1v1Battle } from '../lib/battles';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';

const DURATIONS = [
  { d: 5, hp: 200 },
  { d: 10, hp: 400 },
  { d: 15, hp: 600 },
  { d: 30, hp: 1200 },
];

export function CreateScreen() {
  const LD = useLD();
  const [duration, setDuration] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hp = duration * 40;

  const createBattle = async () => {
    setSubmitting(true);
    setStatus(null);
    setError(null);
    try {
      await createOpen1v1Battle(duration);
      setStatus('Desafio 1v1 aberto. Ele ja aparece em Buscar para outros usuarios.');
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'Nao foi possivel criar a batalha.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenShell>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, letterSpacing: -0.5, lineHeight: 36 }}>
          CRIAR BATALHA
        </Text>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 6 }}>
          MVP: crie um desafio 1v1 aberto.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 18 }}>
        <View>
          <SectionLabel style={{ marginBottom: 8 }}>TIPO</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TypeCard label="1V1" sub="Duelo direto" active />
            <TypeCard label="BR" sub="V1" disabled />
          </View>
        </View>

        <View>
          <SectionLabel style={{ marginBottom: 8 }}>DURACAO · HP TOTAL</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {DURATIONS.map((p) => {
              const active = p.d === duration;

              return (
                <Pressable
                  key={p.d}
                  onPress={() => setDuration(p.d)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    alignItems: 'center',
                    backgroundColor: active ? LD.gold : LD.surface,
                    borderWidth: 1,
                    borderColor: active ? LD.gold : LD.border,
                  }}
                >
                  <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: active ? LD.textInk : LD.text, lineHeight: 22 }}>
                    {p.d}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 9,
                      color: active ? LD.textInk : LD.textDim,
                      letterSpacing: 1,
                      marginTop: 2,
                      opacity: 0.8,
                    }}
                  >
                    {p.hp} HP
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <SectionLabel style={{ marginBottom: 8 }}>ADVERSARIO</SectionLabel>
          <View
            style={{
              padding: 14,
              backgroundColor: LD.surface,
              borderWidth: 1,
              borderColor: LD.border,
            }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 13, color: LD.text }}>Desafio aberto</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, marginTop: 6, lineHeight: 16 }}>
              Qualquer usuario autenticado pode aceitar pela tela Buscar. Convite direto entra depois.
            </Text>
          </View>
        </View>

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
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text }}>Parametros avancados</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2, letterSpacing: 1 }}>
              JANELA · DANO · GRACA · NO-SHOW
            </Text>
          </View>
          <ChevronDownIcon color={LD.textDim} />
        </View>
      </View>

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
                DESAFIO <Text style={{ color: LD.blood }}>1V1</Text> ABERTO
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: LD.gold, lineHeight: 28 }}>{duration}D</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1, marginTop: 2 }}>{hp} HP</Text>
            </View>
          </View>
          <Pressable
            disabled={submitting}
            onPress={createBattle}
            style={{ backgroundColor: submitting ? LD.surface3 : LD.gold, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 14,
                color: submitting ? LD.textDim : LD.textInk,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {submitting ? 'Criando...' : 'Abrir desafio'}
            </Text>
          </Pressable>
          {status ? <Feedback text={status} /> : null}
          {error ? <Feedback text={error} danger /> : null}
        </View>
      </View>
    </ScreenShell>
  );
}

function TypeCard({ label, sub, active, disabled }: { label: string; sub: string; active?: boolean; disabled?: boolean }) {
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
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: active ? LD.gold : LD.text, lineHeight: 22 }}>{label}</Text>
      <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 11, color: LD.textDim, marginTop: 4 }}>{sub}</Text>
      {active ? (
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <CheckIcon color={LD.gold} size={14} />
        </View>
      ) : null}
    </View>
  );
}

function Feedback({ text, danger }: { text: string; danger?: boolean }) {
  const LD = useLD();

  return (
    <Text style={{ marginTop: 10, fontFamily: FONT_MONO, fontSize: 10, color: danger ? LD.blood : LD.vital, lineHeight: 16 }}>
      {text}
    </Text>
  );
}
