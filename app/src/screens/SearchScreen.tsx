import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { acceptBattle, listOpen1v1Battles, type OpenBattle } from '../lib/battles';
import { LuchaMask, ScreenShell } from '../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import type { AppStackParamList } from '../navigation/types';

const FILTERS = [
  { l: 'Todos', a: false },
  { l: '1v1', a: true },
  { l: 'BR', a: false },
  { l: '5 DIAS', a: false },
  { l: '10 DIAS', a: false },
];

export function SearchScreen() {
  const LD = useLD();
  const nav = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [battles, setBattles] = useState<OpenBattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBattles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listOpen1v1Battles();
      setBattles(rows);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar batalhas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBattles().catch(() => undefined);
  }, [loadBattles]);

  const handleAccept = async (battleId: string) => {
    setAcceptingId(battleId);
    setError(null);
    try {
      await acceptBattle(battleId);
      await loadBattles();
    } catch (acceptError) {
      const message = acceptError instanceof Error ? acceptError.message : 'Nao foi possivel aceitar a batalha.';
      setError(message);
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <ScreenShell>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, letterSpacing: -0.5, lineHeight: 36 }}>
              BUSCAR ADVERSARIOS
            </Text>
          </View>
          <Pressable
            onPress={() => nav.navigate('InviteBattle')}
            style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: LD.surface, borderWidth: 1, borderColor: LD.border }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.gold, letterSpacing: 1, textTransform: 'uppercase' }}>
              Convite
            </Text>
          </Pressable>
        </View>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 6 }}>
          {loading ? 'Carregando desafios...' : `${battles.length} batalhas abertas agora.`}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 18, borderBottomWidth: 1, borderBottomColor: LD.border }}>
        <Tab label="Minha academia" count={battles.length} active />
        <Tab label="Todas" count={battles.length} />
      </View>

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

      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {error ? <StatusBox text={error} danger /> : null}
        {!loading && !error && battles.length === 0 ? (
          <StatusBox text="Nenhum desafio 1v1 aberto. Crie uma batalha para iniciar o fluxo MVP." />
        ) : null}

        {battles.map((battle) => (
          <View
            key={battle.battle_id}
            style={{
              backgroundColor: LD.surface,
              borderWidth: 1,
              borderColor: LD.border,
              padding: 14,
              flexDirection: 'row',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <LuchaMask name={battle.creator_name} size={48} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 14, color: LD.text }}>{battle.creator_name}</Text>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
                  {' '}· {(battle.gym_name ?? 'SEM ACADEMIA').toUpperCase()}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: LD.surface3 }}>
                  <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.gold, letterSpacing: 1 }}>1V1</Text>
                </View>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>
                  {battle.duration_days} DIAS
                </Text>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>
                  · {battle.hp_base} HP
                </Text>
              </View>
            </View>
            <Pressable
              disabled={acceptingId === battle.battle_id}
              onPress={() => handleAccept(battle.battle_id)}
              style={{
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: acceptingId === battle.battle_id ? LD.surface3 : LD.gold,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_UI_BOLD,
                  fontSize: 10,
                  color: acceptingId === battle.battle_id ? LD.textDim : LD.textInk,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {acceptingId === battle.battle_id ? '...' : 'Aceitar'}
              </Text>
            </Pressable>
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

function StatusBox({ text, danger }: { text: string; danger?: boolean }) {
  const LD = useLD();

  return (
    <View
      style={{
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: LD.surface,
        borderWidth: 1,
        borderColor: danger ? LD.blood : LD.border,
      }}
    >
      <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: danger ? LD.blood : LD.textDim, lineHeight: 16 }}>
        {text}
      </Text>
    </View>
  );
}
