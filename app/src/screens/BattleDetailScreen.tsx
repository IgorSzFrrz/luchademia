import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Line, Polyline, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BigNumber, HPBar, LuchaMask, Pill, SectionLabel } from '../components';
import { getBattleDetail, type BattleDetail, type BattleTimelineDay } from '../lib/battleDetail';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'BattleDetail'>;

export function BattleDetailScreen({ navigation, route }: Props) {
  const LD = useLD();
  const battleId = route.params?.battleId;
  const [detail, setDetail] = useState<BattleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!battleId) {
      setLoading(false);
      setError('Batalha nao informada.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getBattleDetail(battleId);
      setDetail(data);
      if (!data) setError('Batalha nao encontrada para este usuario.');
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar a batalha.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [battleId]);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const opponentName = detail?.opponent_name ?? 'Aguardando';
  const opponentHp = detail?.opponent_hp ?? detail?.hp_base ?? 0;
  const battleDay = detail ? getBattleDay(detail) : 0;
  const isPending = detail?.battle_status === 'pending';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
              Voltar
            </Text>
          </Pressable>
          <Pressable onPress={load}>
            <Pill variant={detail?.battle_status === 'active' ? 'live' : 'gold'}>
              {loading ? 'Carregando' : detail?.battle_status ?? 'Detalhe'}
            </Pill>
          </Pressable>
        </View>

        {error ? (
          <View style={{ marginHorizontal: 20, marginTop: 18 }}>
            <StatusBox text={error} danger />
          </View>
        ) : null}

        {detail ? (
          <>
            <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <Fighter
                  label="VOCE"
                  name={detail.my_name}
                  hp={detail.my_hp}
                  max={detail.hp_base}
                />
                <View style={{ alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontFamily: FONT_DISP, fontSize: 48, color: isPending ? LD.gold : LD.blood, letterSpacing: 0, lineHeight: 48 }}>VS</Text>
                  <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2, textAlign: 'center' }}>
                    {isPending ? 'AGUARDANDO' : `DIA ${battleDay} / ${detail.duration_days}`}
                  </Text>
                </View>
                <Fighter
                  label={opponentName.toUpperCase()}
                  name={opponentName}
                  hp={opponentHp}
                  max={detail.hp_base}
                  muted={!detail.opponent_user_id}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <View style={{ flex: 1 }}>
                  <HPBar value={detail.my_hp} max={detail.hp_base} segments={10} height={12} showNumeric={false} align="right" />
                </View>
                <View style={{ flex: 1 }}>
                  <HPBar value={opponentHp} max={detail.hp_base} segments={10} height={12} showNumeric={false} />
                </View>
              </View>
            </View>

            <View style={{ marginHorizontal: 20, marginBottom: 18, padding: 14, backgroundColor: LD.surface, borderWidth: 1, borderColor: LD.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <SectionLabel>RESUMO</SectionLabel>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 1 }}>
                  {detail.duration_days}D - {detail.hp_base} HP
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Metric label="Janela" value={`${padHour(detail.day_window_start_hour)}-${padHour(detail.day_window_end_hour)}`} />
                <Metric label="No-show" value={`-${detail.no_show_penalty}`} />
                <Metric label="PvP" value={`-${detail.pvp_damage_per_hour}/h`} />
              </View>
              {isPending ? (
                <Text style={{ marginTop: 12, fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.textDim, lineHeight: 18 }}>
                  Esta batalha esta aberta. Quando outro usuario aceitar, ela vira ativa e o dano diario passa a ser processado pelo job.
                </Text>
              ) : null}
            </View>

            <HpChart detail={detail} />

            <View style={{ paddingHorizontal: 20 }}>
              <SectionLabel style={{ marginBottom: 10 }}>TIMELINE</SectionLabel>
              <View style={{ gap: 8 }}>
                {detail.timeline.map((day) => (
                  <TimelineRow
                    key={`${day.battle_day}-${day.day_number}`}
                    day={day}
                    detail={detail}
                    today={isToday(day.battle_day)}
                  />
                ))}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Fighter({ label, name, hp, max, muted }: {
  label: string;
  name: string;
  hp: number;
  max: number;
  muted?: boolean;
}) {
  const LD = useLD();

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6, opacity: muted ? 0.55 : 1, minWidth: 0 }}>
      <LuchaMask name={name} size={64} />
      <Text numberOfLines={1} style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text, letterSpacing: 0.5, maxWidth: '100%' }}>
        {label}
      </Text>
      <BigNumber value={String(hp)} color={LD.text} size={36} suffix={`/${max}`} />
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const LD = useLD();

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: LD.bg, borderWidth: 1, borderColor: LD.border }}>
      <Text style={{ fontFamily: FONT_MONO, fontSize: 8, color: LD.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: LD.gold, lineHeight: 20, marginTop: 3 }}>{value}</Text>
    </View>
  );
}

function HpChart({ detail }: { detail: BattleDetail }) {
  const LD = useLD();
  const W = 280;
  const H = 80;
  const mySeries = buildHpSeries(detail.hp_base, detail.my_hp, detail.timeline.map((day) => day.my_damage));
  const opponentSeries = buildHpSeries(detail.hp_base, detail.opponent_hp ?? detail.hp_base, detail.timeline.map((day) => day.opponent_damage));
  const stepX = W / Math.max(mySeries.length - 1, 1);
  const myPts = mySeries.map((v, i) => `${i * stepX},${H - (v / detail.hp_base) * H}`).join(' ');
  const opponentPts = opponentSeries.map((v, i) => `${i * stepX},${H - (v / detail.hp_base) * H}`).join(' ');

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 18, padding: 14, backgroundColor: LD.surface, borderWidth: 1, borderColor: LD.border }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <SectionLabel>HP AO LONGO DOS DIAS</SectionLabel>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Legend swatchColor={LD.gold} label="VOCE" />
          <Legend swatchColor={LD.blood} label="RIVAL" />
        </View>
      </View>
      <Svg width="100%" height={80} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {[0, 0.5, 1].map((p) => (
          <Line key={p} x1={0} y1={H * p} x2={W} y2={H * p} stroke={LD.surface2} strokeWidth={1} />
        ))}
        <Polyline points={myPts} fill="none" stroke={LD.gold} strokeWidth={2.5} />
        <Polyline points={opponentPts} fill="none" stroke={LD.blood} strokeWidth={2.5} />
        {mySeries.map((v, i) => (
          <Rect key={`my-${i}`} x={i * stepX - 3} y={H - (v / detail.hp_base) * H - 3} width={6} height={6} fill={LD.gold} />
        ))}
        {opponentSeries.map((v, i) => (
          <Rect key={`op-${i}`} x={i * stepX - 3} y={H - (v / detail.hp_base) * H - 3} width={6} height={6} fill={LD.blood} />
        ))}
      </Svg>
    </View>
  );
}

function TimelineRow({ day, detail, today }: {
  day: BattleTimelineDay;
  detail: BattleDetail;
  today: boolean;
}) {
  const LD = useLD();
  const future = new Date(`${day.battle_day}T00:00:00`) > new Date();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: today ? LD.tintGold : LD.surface,
        borderWidth: 1,
        borderColor: today ? LD.gold : future ? LD.surface2 : LD.border,
        opacity: future ? 0.55 : 1,
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 40 }}>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 8, color: LD.textMuted, letterSpacing: 1 }}>{weekday(day.battle_day)}</Text>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 24, color: today ? LD.gold : LD.text, lineHeight: 24 }}>
          D{day.day_number}
        </Text>
      </View>
      <View style={{ width: 1, backgroundColor: LD.border }} />
      <View style={{ flex: 1 }}>
        <TimelineLine name={detail.my_name} at={day.my_checkin_at} dmg={day.my_damage} />
        <TimelineLine name={detail.opponent_name ?? 'Rival'} at={day.opponent_checkin_at} dmg={day.opponent_damage} mt={4} muted={!detail.opponent_user_id} />
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 10, color: LD.textDim, marginTop: 6 }}>
          {day.my_checkin_at || day.opponent_checkin_at ? 'Check-ins confirmados no dia.' : future ? 'Dia ainda nao abriu.' : 'Sem check-ins registrados.'}
        </Text>
      </View>
    </View>
  );
}

function TimelineLine({ name, at, dmg, mt, muted }: {
  name: string;
  at: string | null;
  dmg: number;
  mt?: number;
  muted?: boolean;
}) {
  const LD = useLD();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: mt, opacity: muted ? 0.5 : 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
        <LuchaMask name={name} size={18} />
        <Text numberOfLines={1} style={{ fontFamily: FONT_MONO, fontSize: 11, color: LD.text, flex: 1 }}>
          {formatTime(at)}
        </Text>
      </View>
      <Text style={{ fontFamily: FONT_DISP, fontSize: 16, color: dmg > 0 ? LD.blood : LD.textMuted }}>
        {dmg > 0 ? `-${dmg}` : '0'}
      </Text>
    </View>
  );
}

function StatusBox({ text, danger }: { text: string; danger?: boolean }) {
  const LD = useLD();

  return (
    <View style={{ paddingHorizontal: 14, paddingVertical: 12, backgroundColor: LD.surface, borderWidth: 1, borderColor: danger ? LD.blood : LD.border }}>
      <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: danger ? LD.blood : LD.textDim, lineHeight: 16 }}>
        {text}
      </Text>
    </View>
  );
}

function Legend({ swatchColor, label }: { swatchColor: string; label: string }) {
  const LD = useLD();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ width: 8, height: 2, backgroundColor: swatchColor }} />
      <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>{label}</Text>
    </View>
  );
}

function buildHpSeries(maxHp: number, currentHp: number, dailyDamage: number[]) {
  let hp = maxHp;
  const series = [hp];

  for (const damage of dailyDamage) {
    hp = Math.max(0, hp - damage);
    series.push(hp);
  }

  if (dailyDamage.every((damage) => damage === 0)) {
    series[series.length - 1] = currentHp;
  }

  return series;
}

function getBattleDay(detail: BattleDetail) {
  if (detail.battle_status !== 'active') return 0;
  const started = new Date(detail.starts_at).getTime();
  const day = Math.floor((Date.now() - started) / 86400000) + 1;
  return Math.min(Math.max(day, 1), detail.duration_days);
}

function formatTime(value?: string | null) {
  if (!value) return '--:--';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function weekday(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
  }).format(new Date(`${value}T12:00:00`)).replace('.', '').toUpperCase();
}

function isToday(value: string) {
  const today = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const parts = Object.fromEntries(today.map((part) => [part.type, part.value]));
  return value === `${parts.year}-${parts.month}-${parts.day}`;
}

function padHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`;
}
