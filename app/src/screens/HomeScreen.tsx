import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import {
  BigNumber,
  HPBar,
  LuchaMask,
  Pill,
  PinIcon,
  ScreenShell,
  SectionLabel,
  StarIcon,
} from '../components';
import {
  formatSeconds,
  getTodayKey,
  getWindowStatus,
  loadHomeData,
  type HomeBattle,
  type HomeData,
} from '../lib/home';
import { useAuth } from '../store/auth';
import {
  useLD,
  FONT_DISP,
  FONT_MONO,
  FONT_MONO_BOLD,
  FONT_UI_SEMI,
  FONT_UI_BOLD,
} from '../theme';
import type { AppStackParamList } from '../navigation/types';

const EMPTY_HOME: HomeData = {
  profile: null,
  checkedToday: false,
  todayCheckin: null,
  battles: [],
};

export function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const LD = useLD();
  const { user, profile: authProfile } = useAuth();
  const [homeData, setHomeData] = useState<HomeData>(EMPTY_HOME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async () => {
    if (!user?.id) {
      setHomeData(EMPTY_HOME);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await loadHomeData(user.id);
      setHomeData(data);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar a Home.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => undefined);
    }, [load])
  );

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const windowStatus = useMemo(() => getWindowStatus(now), [now]);
  const displayName = homeData.profile?.display_name ?? authProfile?.display_name ?? user?.email?.split('@')[0] ?? 'Lutador';
  const gymName = homeData.profile?.gym_name ?? 'Sem academia';
  const checkedToday = homeData.checkedToday;
  const activeCount = homeData.battles.filter((battle) => battle.battle_status === 'active').length;
  const pendingCount = homeData.battles.filter((battle) => battle.battle_status === 'pending').length;

  return (
    <ScreenShell>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <LuchaMask name={displayName} size={32} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
              {gymName.toUpperCase()}
            </Text>
            <Text numberOfLines={1} style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.text }}>
              {displayName}
            </Text>
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
          <Text style={{ fontFamily: FONT_DISP, fontSize: 14, color: LD.gold }}>{activeCount}</Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 16,
          padding: 20,
          backgroundColor: LD.surface,
          borderWidth: 1,
          borderColor: checkedToday ? LD.tintAttackBorder : LD.borderHi,
        }}
      >
        <Text
          style={{
            position: 'absolute',
            top: 8,
            right: 12,
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: checkedToday ? LD.vital : LD.blood,
            letterSpacing: 2,
          }}
        >
          HOJE - {getTodayKey()}
        </Text>
        <SectionLabel color={LD.textDim} style={{ marginTop: 10 }}>
          {checkedToday ? 'CHECK-IN CONFIRMADO' : windowStatus.isOpen ? 'VOCE AINDA NAO CHECOU' : 'JANELA FECHADA'}
        </SectionLabel>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
          <BigNumber
            value={checkedToday ? 'OK' : `-${windowStatus.hpLostToday}`}
            color={checkedToday ? LD.vital : LD.blood}
            size={68}
          />
          <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim }}>
            {checkedToday ? 'voce esta seguro hoje' : 'HP em risco hoje'}
          </Text>
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
            <Text style={{ fontFamily: FONT_MONO, fontSize: 13, color: LD.text, marginTop: 2 }}>05:00 - 23:00</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
              {windowStatus.isOpen ? 'FECHA EM' : 'STATUS'}
            </Text>
            <Text style={{ fontFamily: FONT_MONO_BOLD, fontSize: 13, color: LD.gold, marginTop: 2 }}>
              {windowStatus.isOpen ? formatSeconds(windowStatus.secondsUntilClose) : 'FECHADA'}
            </Text>
          </View>
        </View>

        <Pressable
          disabled={checkedToday || !windowStatus.isOpen}
          onPress={() => nav.navigate('Checkin', { screen: 'Arrival' })}
          style={{
            marginTop: 14,
            backgroundColor: checkedToday || !windowStatus.isOpen ? LD.surface3 : LD.gold,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: checkedToday || !windowStatus.isOpen ? 0.75 : 1,
          }}
        >
          <PinIcon color={checkedToday || !windowStatus.isOpen ? LD.textDim : LD.textInk} size={18} />
          <Text
            style={{
              fontFamily: FONT_UI_BOLD,
              fontSize: 14,
              color: checkedToday || !windowStatus.isOpen ? LD.textDim : LD.textInk,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            {checkedToday ? 'Check-in feito' : 'Dar check-in'}
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
          {checkedToday
            ? `CONFIRMADO AS ${formatTime(homeData.todayCheckin?.confirmed_at)}`
            : homeData.profile?.gym_id
              ? 'GPS VALIDADO NA PROXIMA TELA'
              : 'VINCULE UMA ACADEMIA PARA CHECAR'}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <SectionLabel>
          {loading ? 'CARREGANDO BATALHAS' : `${activeCount} ATIVAS - ${pendingCount} ABERTAS`}
        </SectionLabel>
        <Pressable onPress={load}>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.gold, letterSpacing: 1 }}>ATUALIZAR</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {error ? <StatusBox text={error} danger /> : null}
        {!loading && !error && homeData.battles.length === 0 ? (
          <StatusBox text="Nenhuma batalha 1v1 ativa. Crie um desafio ou aceite uma batalha aberta." />
        ) : null}

        {homeData.battles.map((battle) => (
          <Pressable key={battle.battle_id} onPress={() => nav.navigate('BattleDetail', { battleId: battle.battle_id })}>
            <BattleCard1v1 battle={battle} />
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

function BattleCard1v1({ battle }: { battle: HomeBattle }) {
  const LD = useLD();
  const opponentName = battle.opponent_name ?? 'Aguardando';
  const opponentHp = battle.opponent_hp ?? battle.hp_base;
  const battleDay = getBattleDay(battle);
  const pillVariant = battle.battle_status === 'active' ? 'live' : 'safe';
  const pillText = battle.battle_status === 'active' ? 'Ao vivo' : 'Aberta';

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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <LuchaMask name="Voce" size={32} />
          <View>
            <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 11, color: LD.text }}>VOCE</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.text, lineHeight: 18 }}>{battle.my_hp}</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.textMuted }}> /{battle.hp_base}</Text>
            </View>
          </View>
        </View>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.textMuted, letterSpacing: 1 }}>VS</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
          <View style={{ alignItems: 'flex-end', minWidth: 0 }}>
            <Text numberOfLines={1} style={{ fontFamily: FONT_UI_SEMI, fontSize: 11, color: LD.text, maxWidth: 96 }}>
              {opponentName.toUpperCase()}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.text, lineHeight: 18 }}>{opponentHp}</Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.textMuted }}> /{battle.hp_base}</Text>
            </View>
          </View>
          <LuchaMask name={opponentName} size={32} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 6 }}>
        <View style={{ flex: 1 }}>
          <HPBar value={battle.my_hp} max={battle.hp_base} segments={8} height={10} showNumeric={false} align="right" />
        </View>
        <View style={{ flex: 1 }}>
          <HPBar value={opponentHp} max={battle.hp_base} segments={8} height={10} showNumeric={false} />
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
          DIA {battleDay} / {battle.duration_days}
        </Text>
        <Pill variant={pillVariant}>{pillText}</Pill>
      </View>
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

function getBattleDay(battle: HomeBattle) {
  if (battle.battle_status !== 'active') return 0;

  const started = new Date(battle.starts_at).getTime();
  const diffMs = Date.now() - started;
  const day = Math.floor(diffMs / 86400000) + 1;

  return Math.min(Math.max(day, 1), battle.duration_days);
}

function formatTime(value?: string | null) {
  if (!value) return '--:--';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
