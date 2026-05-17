import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckIcon, ChevronLeftIcon, SectionLabel } from '../../components';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { useAuth } from '../../store/auth';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { OnboardingStackParamList } from '../../navigation/types';
import type { Gym, UUID } from '../../types/domain';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ChooseGym'>;

export function ChooseGymScreen({ navigation }: Props) {
  const LD = useLD();
  const { session, setGym, profileLoading, error } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedGymId, setSelectedGymId] = useState<UUID | null>(null);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [gymError, setGymError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadGyms() {
      if (!isSupabaseConfigured) {
        setLoadingGyms(false);
        setGymError('Configure o Supabase no app/.env para carregar academias.');
        return;
      }

      try {
        const { data, error: loadError } = await supabase
          .from('gyms')
          .select('id, google_place_id, name, address, lat, lng')
          .order('name', { ascending: true });

        if (loadError) throw loadError;
        if (!alive) return;

        const rows = (data ?? []) as Gym[];
        setGyms(rows);
        setSelectedGymId(rows[0]?.id ?? null);
        setGymError(rows.length ? null : 'Nenhuma academia cadastrada no Supabase ainda.');
      } catch (loadError) {
        if (!alive) return;
        const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar academias.';
        setGymError(message);
      } finally {
        if (alive) setLoadingGyms(false);
      }
    }

    loadGyms().catch(() => undefined);

    return () => {
      alive = false;
    };
  }, []);

  const selectedGym = useMemo(
    () => gyms.find((gym) => gym.id === selectedGymId) ?? null,
    [gyms, selectedGymId]
  );

  const confirmGym = async () => {
    if (!selectedGymId) return;
    const linked = await setGym(selectedGymId);
    if (linked) navigation.navigate('Ready');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 24, paddingTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              disabled={!!session}
              onPress={() => navigation.goBack()}
              style={{
                width: 32,
                height: 32,
                borderWidth: 1,
                borderColor: LD.border,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: session ? 0.35 : 1,
              }}
            >
              <ChevronLeftIcon color={LD.text} />
            </Pressable>
            <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ flex: 1, height: 3, backgroundColor: i <= 1 ? LD.gold : LD.surface2 }} />
              ))}
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
            <SectionLabel>PASSO 2 DE 3</SectionLabel>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 40, lineHeight: 38, color: LD.text, marginTop: 8, letterSpacing: -0.5 }}>
              ESCOLHA SEU{'\n'}RINGUE
            </Text>
            <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 10, lineHeight: 18 }}>
              Sua academia define onde o check-in vale. Voce pode trocar depois.
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: 24,
              marginTop: 20,
              height: 140,
              borderWidth: 1,
              borderColor: LD.border,
              backgroundColor: LD.surface,
            }}
          >
            <Svg width="100%" height="100%" viewBox="0 0 320 140" preserveAspectRatio="none">
              {[20, 60, 100, 140, 180, 220, 260, 300].map((x) => (
                <Line key={'v' + x} x1={x} y1={0} x2={x} y2={140} stroke={LD.surface2} strokeWidth={1} />
              ))}
              {[20, 50, 80, 110, 140].map((y) => (
                <Line key={'h' + y} x1={0} y1={y} x2={320} y2={y} stroke={LD.surface2} strokeWidth={1} />
              ))}
              <Line x1={0} y1={70} x2={320} y2={70} stroke={LD.border} strokeWidth={3} />
              <Line x1={160} y1={0} x2={160} y2={140} stroke={LD.border} strokeWidth={3} />
              <Circle cx={160} cy={70} r={22} fill={LD.gold} fillOpacity={0.15} />
              <Circle cx={160} cy={70} r={6} fill={LD.gold} stroke={LD.bg} strokeWidth={2} />
              <Circle cx={100} cy={40} r={4} fill={LD.blood} />
              <Circle cx={220} cy={100} r={4} fill={LD.blood} />
              <Circle cx={60} cy={110} r={4} fill={LD.blood} />
            </Svg>
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: LD.bg,
                borderWidth: 1,
                borderColor: LD.border,
              }}
            >
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>VOCE AQUI</Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 8 }}>
            {loadingGyms ? <StatusBox text="Carregando academias..." /> : null}
            {!loadingGyms && gymError ? <StatusBox text={gymError} danger /> : null}

            {gyms.map((gym, index) => {
              const selected = gym.id === selectedGymId;

              return (
                <Pressable
                  key={gym.id}
                  onPress={() => setSelectedGymId(gym.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    backgroundColor: selected ? LD.surface2 : LD.surface,
                    borderWidth: 1,
                    borderColor: selected ? LD.gold : LD.border,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: selected ? LD.gold : LD.surface3,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: FONT_DISP, fontSize: 18, color: selected ? LD.textInk : LD.textDim }}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.text }}>
                      {gym.name}
                    </Text>
                    <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2, letterSpacing: 1 }}>
                      {gym.address ?? 'Endereco nao informado'}
                    </Text>
                  </View>
                  {selected ? <CheckIcon color={LD.gold} size={18} /> : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
          <Pressable
            disabled={!selectedGymId || profileLoading}
            onPress={confirmGym}
            style={{
              backgroundColor: selectedGymId && !profileLoading ? LD.gold : LD.surface3,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 14,
                color: selectedGymId && !profileLoading ? LD.textInk : LD.textDim,
                letterSpacing: 1,
                textTransform: 'uppercase',
                paddingHorizontal: 12,
                textAlign: 'center',
              }}
              numberOfLines={2}
            >
              {profileLoading ? 'Vinculando...' : `Confirmar ${selectedGym?.name ?? 'academia'} ->`}
            </Text>
          </Pressable>
          {error ? (
            <Text style={{ marginTop: 8, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 10, color: LD.blood, lineHeight: 16 }}>
              {error}
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
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
