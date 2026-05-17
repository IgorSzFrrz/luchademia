import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CrownTopIcon, LuchaMask, ScreenShell } from '../components';
import { listIndividualRankings, type IndividualRanking } from '../lib/rankings';
import { useAuth } from '../store/auth';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';

const TABS = [
  { label: 'Individual', active: true },
  { label: 'Battle Royale', active: false },
  { label: 'Academia', active: false },
];

export function RankingScreen() {
  const LD = useLD();
  const { user } = useAuth();
  const [rankings, setRankings] = useState<IndividualRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRankings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listIndividualRankings({ minFinished: 0 });
      setRankings(rows);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o ranking.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRankings().catch(() => undefined);
  }, [loadRankings]);

  const podium = rankings.slice(0, 3);
  const tableRows = rankings.slice(3);
  const myRank = useMemo(
    () => rankings.find((row) => row.user_id === user?.id) ?? null,
    [rankings, user?.id]
  );

  return (
    <ScreenShell>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, letterSpacing: -0.5, lineHeight: 36 }}>RANKING</Text>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 6 }}>
          {loading
            ? 'Calculando vitorias...'
            : myRank
              ? `Voce e o #${myRank.rank_position} no ranking individual.`
              : 'Ranking individual baseado em batalhas finalizadas.'}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, borderBottomWidth: 1, borderBottomColor: LD.border }}>
        {TABS.map((tab) => (
          <View
            key={tab.label}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: tab.active ? LD.gold : 'transparent',
              marginBottom: -1,
              opacity: tab.active ? 1 : 0.45,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 11,
                color: tab.active ? LD.text : LD.textMuted,
                letterSpacing: 1,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
              numberOfLines={2}
            >
              {tab.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
        {error ? <StatusBox text={error} danger onRetry={loadRankings} /> : null}
        {!loading && !error && rankings.length === 0 ? (
          <StatusBox text="Nenhuma batalha finalizada ainda. O ranking aparece depois do primeiro resultado." />
        ) : null}
      </View>

      {podium.length > 0 ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, justifyContent: 'center' }}>
            <PodiumSlot player={podium[1]} height={60} tone="#C0C5CC" />
            <PodiumSlot player={podium[0]} height={90} first />
            <PodiumSlot player={podium[2]} height={44} tone="#A87F4D" />
          </View>
        </View>
      ) : null}

      {rankings.length > 0 ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 6, paddingBottom: 6 }}>
            <Text style={{ width: 32, fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>#</Text>
            <Text style={{ flex: 1, fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>NOME</Text>
            <Text style={{ width: 58, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>WR</Text>
            <Text style={{ width: 54, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2 }}>W-L</Text>
          </View>

          {(tableRows.length ? tableRows : rankings).map((player) => (
            <RankingRow key={player.user_id} player={player} isYou={player.user_id === user?.id} />
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
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textDim, letterSpacing: 0.5, textAlign: 'center' }}>
              MVP: SEM MINIMO DE PARTIDAS. V1 USA MIN. 10 BATALHAS.
            </Text>
          </View>
        </View>
      ) : null}
    </ScreenShell>
  );
}

function PodiumSlot({ player, height, first, tone }: {
  player?: IndividualRanking;
  height: number;
  first?: boolean;
  tone?: string;
}) {
  const LD = useLD();

  if (!player) {
    return <View style={{ flex: 1 }} />;
  }

  const name = player.display_name.split(' ')[0] || player.display_name;

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      <View style={{ position: 'relative' }}>
        <LuchaMask name={player.display_name} size={first ? 64 : 48} />
        {first ? (
          <View style={{ position: 'absolute', top: -16, alignSelf: 'center' }}>
            <CrownTopIcon gold={LD.gold} deep={LD.goldDeep} blood={LD.blood} />
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: FONT_UI_BOLD,
          fontSize: first ? 12 : 11,
          color: first ? LD.gold : LD.text,
          textTransform: 'uppercase',
          maxWidth: '100%',
        }}
      >
        {name}
      </Text>
      <View
        style={{
          width: '100%',
          height,
          backgroundColor: first ? LD.gold : LD.surface2,
          borderWidth: first ? 0 : 1,
          borderColor: LD.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: FONT_DISP, fontSize: first ? 42 : 24, color: first ? LD.textInk : tone ?? LD.text, lineHeight: first ? 42 : 24 }}>
          #{player.rank_position}
        </Text>
        <Text style={{ fontFamily: FONT_MONO, fontSize: first ? 10 : 9, color: first ? LD.textInk : LD.textDim, letterSpacing: 1, marginTop: 2 }}>
          {Number(player.win_rate).toFixed(0)}% WR
        </Text>
      </View>
    </View>
  );
}

function RankingRow({ player, isYou }: { player: IndividualRanking; isYou: boolean }) {
  const LD = useLD();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 10,
        backgroundColor: isYou ? LD.tintGold : 'transparent',
        borderWidth: 1,
        borderColor: isYou ? LD.gold : 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: isYou ? LD.gold : LD.surface2,
      }}
    >
      <Text style={{ width: 32, fontFamily: FONT_DISP, fontSize: 16, color: isYou ? LD.gold : LD.textDim }}>
        #{player.rank_position}
      </Text>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <LuchaMask name={player.display_name} size={26} />
        <View style={{ minWidth: 0, flex: 1 }}>
          <Text numberOfLines={1} style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: isYou ? LD.gold : LD.text }}>
            {player.display_name}{isYou ? ' - voce' : ''}
          </Text>
          <Text numberOfLines={1} style={{ fontFamily: FONT_MONO, fontSize: 8, color: LD.textMuted, letterSpacing: 1, marginTop: 1 }}>
            {(player.gym_name ?? 'SEM ACADEMIA').toUpperCase()}
          </Text>
        </View>
      </View>
      <Text
        style={{
          width: 58,
          textAlign: 'right',
          fontFamily: FONT_DISP,
          fontSize: 16,
          color: Number(player.win_rate) >= 70 ? LD.vital : LD.text,
        }}
      >
        {Number(player.win_rate).toFixed(0)}%
      </Text>
      <Text style={{ width: 54, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 11, color: LD.textDim }}>
        {player.wins}-{player.losses}
      </Text>
    </View>
  );
}

function StatusBox({ text, danger, onRetry }: { text: string; danger?: boolean; onRetry?: () => void }) {
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
      {onRetry ? (
        <Pressable onPress={onRetry} style={{ marginTop: 10, alignSelf: 'flex-start', backgroundColor: LD.gold, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.textInk, letterSpacing: 1, textTransform: 'uppercase' }}>
            Tentar de novo
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
