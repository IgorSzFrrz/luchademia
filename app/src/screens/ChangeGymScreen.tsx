import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckIcon, SectionLabel } from '../components';
import { searchGymsForSelection } from '../lib/gyms';
import { useAuth } from '../store/auth';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import type { AppStackParamList } from '../navigation/types';
import type { Gym, UUID } from '../types/domain';

type Props = NativeStackScreenProps<AppStackParamList, 'ChangeGym'>;

export function ChangeGymScreen({ navigation }: Props) {
  const LD = useLD();
  const { profile, setGym, profileLoading, error: authError, refreshProfile } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedGymId, setSelectedGymId] = useState<UUID | null>(profile?.gym_id ?? null);
  const [loading, setLoading] = useState(true);
  const [screenError, setScreenError] = useState<string | null>(null);

  const loadGyms = useCallback(async () => {
    setLoading(true);
    setScreenError(null);
    try {
      const result = await searchGymsForSelection('nearby');
      const rows = result.gyms;
      setGyms(rows);
      setSelectedGymId((current) => current ?? profile?.gym_id ?? rows[0]?.id ?? null);
      if (rows.length === 0) setScreenError(result.message ?? 'Nenhuma academia cadastrada ainda.');
      else if (result.message) setScreenError(result.message);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar academias.';
      setScreenError(message);
    } finally {
      setLoading(false);
    }
  }, [profile?.gym_id]);

  useEffect(() => {
    loadGyms().catch(() => undefined);
  }, [loadGyms]);

  const selectedGym = useMemo(
    () => gyms.find((gym) => gym.id === selectedGymId) ?? null,
    [gyms, selectedGymId]
  );

  const confirmGym = async () => {
    if (!selectedGymId) return;
    const linked = await setGym(selectedGymId);
    if (linked) {
      await refreshProfile();
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 118 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
            >
              <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
                Voltar
              </Text>
            </Pressable>
            <Pressable
              onPress={loadGyms}
              style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
            >
              <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.gold, letterSpacing: 1, textTransform: 'uppercase' }}>
                Atualizar
              </Text>
            </Pressable>
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <SectionLabel>ACADEMIA</SectionLabel>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 40, lineHeight: 38, color: LD.text, marginTop: 8, letterSpacing: 0 }}>
              TROCAR{'\n'}RINGUE
            </Text>
            <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 10, lineHeight: 18 }}>
              Usamos sua localizacao para buscar academias reais proximas. Se a busca externa falhar, mostramos as academias cadastradas.
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: 20,
              marginTop: 20,
              height: 138,
              borderWidth: 1,
              borderColor: LD.border,
              backgroundColor: LD.surface,
            }}
          >
            <Svg width="100%" height="100%" viewBox="0 0 320 138" preserveAspectRatio="none">
              {[20, 60, 100, 140, 180, 220, 260, 300].map((x) => (
                <Line key={`v-${x}`} x1={x} y1={0} x2={x} y2={138} stroke={LD.surface2} strokeWidth={1} />
              ))}
              {[20, 50, 80, 110].map((y) => (
                <Line key={`h-${y}`} x1={0} y1={y} x2={320} y2={y} stroke={LD.surface2} strokeWidth={1} />
              ))}
              <Circle cx={160} cy={69} r={24} fill={LD.gold} fillOpacity={0.15} />
              <Circle cx={160} cy={69} r={6} fill={LD.gold} stroke={LD.bg} strokeWidth={2} />
              <Circle cx={96} cy={42} r={4} fill={LD.blood} />
              <Circle cx={224} cy={98} r={4} fill={LD.blood} />
              <Circle cx={62} cy={108} r={4} fill={LD.blood} />
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
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textDim, letterSpacing: 1 }}>PERTO DE VOCE</Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 8 }}>
            {loading ? <StatusBox text="Carregando academias..." /> : null}
            {!loading && screenError ? <StatusBox text={screenError} danger /> : null}

            {gyms.map((gym, index) => {
              const selected = gym.id === selectedGymId;
              const current = gym.id === profile?.gym_id;

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
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.text }}>
                      {gym.name}
                    </Text>
                    <Text numberOfLines={1} style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2, letterSpacing: 1 }}>
                      {current ? 'ATUAL - ' : ''}{gym.address ?? 'Endereco nao informado'}
                    </Text>
                  </View>
                  {selected ? <CheckIcon color={LD.gold} size={18} /> : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <Pressable
            disabled={!selectedGymId || profileLoading || selectedGymId === profile?.gym_id}
            onPress={confirmGym}
            style={{
              backgroundColor: selectedGymId && selectedGymId !== profile?.gym_id && !profileLoading ? LD.gold : LD.surface3,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 14,
                color: selectedGymId && selectedGymId !== profile?.gym_id && !profileLoading ? LD.textInk : LD.textDim,
                letterSpacing: 1,
                textTransform: 'uppercase',
                paddingHorizontal: 12,
                textAlign: 'center',
              }}
              numberOfLines={2}
            >
              {profileLoading ? 'Vinculando...' : selectedGymId === profile?.gym_id ? 'Academia atual' : `Confirmar ${selectedGym?.name ?? 'academia'}`}
            </Text>
          </Pressable>
          {authError ? (
            <Text style={{ marginTop: 8, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 10, color: LD.blood, lineHeight: 16 }}>
              {authError}
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
