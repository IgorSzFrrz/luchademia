import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlameIcon, LuchaMask, ScreenShell, SectionLabel } from '../components';
import { getProfileDashboard, type ProfileDashboard, type RecentProfileBattle } from '../lib/profile';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import { useAuth } from '../store/auth';
import type { AppStackParamList } from '../navigation/types';

export function ProfileScreen() {
  const LD = useLD();
  const nav = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const signOut = useAuth((state) => state.signOut);
  const authProfile = useAuth((state) => state.profile);
  const [dashboard, setDashboard] = useState<ProfileDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfileDashboard();
      setDashboard(data);
      if (!data) setError('Perfil nao encontrado.');
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o perfil.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => undefined);
    }, [load])
  );

  const displayName = dashboard?.display_name ?? authProfile?.display_name ?? 'Lutador';
  const rankLabel = dashboard?.rank_position ? `RANK #${dashboard.rank_position}` : 'SEM RANK AINDA';
  const memberSince = dashboard?.created_at ? monthYear(dashboard.created_at) : '--';
  const recentBattles = dashboard?.recent_battles ?? [];

  return (
    <ScreenShell paddingTop={0}>
      <LinearGradient
        colors={[LD.surface2, LD.bg]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable
            onPress={load}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
              Atualizar
            </Text>
          </Pressable>
          <Pressable
            onPress={signOut}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 10, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
              Sair
            </Text>
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <LuchaMask name={displayName} size={96} />
          <Text
            numberOfLines={2}
            style={{ fontFamily: FONT_DISP, fontSize: 36, color: LD.text, lineHeight: 36, marginTop: 12, letterSpacing: 0, textAlign: 'center' }}
          >
            {displayName.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.gold, letterSpacing: 2, marginTop: 6 }}>
            {loading ? 'CARREGANDO...' : rankLabel}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, letterSpacing: 1, marginTop: 4, maxWidth: '100%' }}
          >
            {(dashboard?.gym_name ?? 'SEM ACADEMIA').toUpperCase()} - DESDE {memberSince.toUpperCase()}
          </Text>
        </View>
      </LinearGradient>

      {error ? (
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <StatusBox text={error} danger />
        </View>
      ) : null}

      <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <StatCard label="VITORIAS" value={String(dashboard?.wins ?? 0)} accent={LD.vital} />
        <StatCard label="DERROTAS" value={String(dashboard?.losses ?? 0)} accent={LD.blood} />
        <StatCard label="WIN RATE" value={`${Number(dashboard?.win_rate ?? 0).toFixed(0)}%`} accent={LD.gold} />
        <StatCard label="CHECK-INS" value={String(dashboard?.checkins_total ?? 0)} accent={LD.text} />
      </View>

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
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.textDim }}>SEQUENCIA ATUAL</Text>
          <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: LD.gold, lineHeight: 28, marginTop: 2 }}>
            {dashboard?.current_streak ?? 0} DIAS
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>RECORDE</Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 12, color: LD.text, marginTop: 2 }}>{dashboard?.best_streak ?? 0} dias</Text>
        </View>
      </Pressable>

      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <SectionLabel style={{ marginBottom: 10 }}>HISTORICO RECENTE</SectionLabel>
        {recentBattles.length === 0 ? (
          <StatusBox text="Nenhuma batalha recente ainda. Crie ou aceite um desafio para preencher o historico." />
        ) : null}
        {recentBattles.map((battle) => (
          <HistoryRow key={battle.battle_id} battle={battle} />
        ))}
      </View>

      <Pressable
        onPress={() => nav.navigate('ChangeGym')}
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

function HistoryRow({ battle }: { battle: RecentProfileBattle }) {
  const LD = useLD();
  const isWin = battle.result === 'win';
  const isActive = battle.result === 'active';
  const badgeColor = isActive ? LD.gold : isWin ? LD.vital : LD.blood;
  const badgeLabel = isActive ? 'A' : isWin ? 'V' : 'D';
  const opponentName = battle.opponent_name ?? 'Aguardando adversario';

  return (
    <View
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
          backgroundColor: badgeColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: FONT_DISP, fontSize: 14, color: isActive ? LD.textInk : '#fff' }}>{badgeLabel}</Text>
      </View>
      <LuchaMask name={opponentName} size={26} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.text }}>
          {opponentName}
        </Text>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1, marginTop: 1 }}>
          {battle.type.toUpperCase()} - {battle.duration_days}D - {battle.battle_status.toUpperCase()}
        </Text>
      </View>
      <Text style={{ fontFamily: FONT_MONO, fontSize: 12, color: badgeColor }}>
        {isActive ? `${battle.my_hp} HP` : isWin ? 'WIN' : 'LOSS'}
      </Text>
    </View>
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
      <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: FONT_DISP, fontSize: 36, color: accent, lineHeight: 36, marginTop: 4 }}>
        {value}
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

function monthYear(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    month: 'short',
    year: '2-digit',
  }).format(new Date(value));
}
