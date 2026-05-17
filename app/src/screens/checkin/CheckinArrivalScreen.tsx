import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PinIcon } from '../../components';
import { getLinkedGymDistance, type GymDistance } from '../../lib/checkins';
import { useAuth } from '../../store/auth';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { CheckinStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CheckinStackParamList, 'Arrival'>;

export function CheckinArrivalScreen({ navigation }: Props) {
  const LD = useLD();
  const gymId = useAuth((state) => state.profile?.gym_id);
  const [result, setResult] = useState<GymDistance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocation = useCallback(async () => {
    if (!gymId) {
      setError('Vincule uma academia antes de fazer check-in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const distance = await getLinkedGymDistance(gymId);
      setResult(distance);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Nao foi possivel validar sua localizacao.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [gymId]);

  useEffect(() => {
    loadLocation().catch(() => undefined);
  }, [loadLocation]);

  const startTimer = () => {
    if (!result?.insideRadius) return;

    navigation.navigate('Stay', {
      gymId: result.gym.id,
      gymName: result.gym.name,
      gymLat: result.gym.lat,
      gymLng: result.gym.lng,
      latitude: result.latitude,
      longitude: result.longitude,
      distanceMeters: result.distanceMeters,
      arrivedAt: new Date().toISOString(),
    });
  };

  const distanceLabel = result ? `${Math.round(result.distanceMeters)} m do centro` : 'Aguardando GPS';
  const ready = !!result?.insideRadius && !loading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => navigation.getParent()?.goBack()}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: LD.border,
          }}
        >
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
            Cancelar
          </Text>
        </Pressable>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textDim, letterSpacing: 1 }}>CHECK-IN 1/3</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' }}>
        <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <View
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: ready ? LD.vital : LD.gold,
              opacity: 0.3,
            } as any}
          />
          <View
            style={{
              position: 'absolute',
              inset: 14,
              borderRadius: 36,
              borderWidth: 1,
              borderColor: ready ? LD.vital : LD.gold,
              opacity: 0.5,
            } as any}
          />
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: ready ? LD.vital : LD.gold,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PinIcon color={LD.textInk} size={20} />
          </View>
        </View>

        <Text style={{ fontFamily: FONT_DISP, fontSize: 42, lineHeight: 40, color: LD.text, letterSpacing: -0.5, textAlign: 'center' }}>
          {ready ? 'VOCE CHEGOU\nNO RINGUE' : 'VALIDANDO\nGPS'}
        </Text>
        <Text
          style={{
            marginTop: 14,
            fontFamily: FONT_UI_SEMI,
            fontSize: 14,
            color: LD.textDim,
            lineHeight: 21,
            maxWidth: 280,
            textAlign: 'center',
          }}
        >
          {ready
            ? `GPS confirmou que voce esta dentro da ${result.gym.name}.`
            : 'Fique dentro de 100 m da academia vinculada para iniciar o timer.'}
        </Text>

        <View
          style={{
            marginTop: 28,
            padding: 16,
            backgroundColor: LD.surface,
            borderWidth: 1,
            borderColor: ready ? LD.vital : LD.border,
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View style={{ width: 36, height: 36, backgroundColor: LD.surface3, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: LD.gold, fontFamily: FONT_DISP, fontSize: 18 }}>GYM</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 13, color: LD.text }}>{result?.gym.name ?? 'Academia vinculada'}</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, marginTop: 2 }}>
              {loading ? 'Buscando posicao...' : distanceLabel}
            </Text>
          </View>
        </View>

        {error ? (
          <Text style={{ marginTop: 14, fontFamily: FONT_MONO, fontSize: 10, color: LD.blood, textAlign: 'center', lineHeight: 16 }}>
            {error}
          </Text>
        ) : null}

        <Text
          style={{
            marginTop: 16,
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: LD.textDim,
            textAlign: 'center',
            letterSpacing: 0.5,
            lineHeight: 18,
          }}
        >
          PROXIMO: 15 MIN DE PERMANENCIA{'\n'}MANTENHA O APP ABERTO NO MVP.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 8 }}>
        <Pressable
          disabled={loading}
          onPress={loadLocation}
          style={{ borderWidth: 1, borderColor: LD.border, paddingVertical: 12, alignItems: 'center' }}
        >
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.textDim, letterSpacing: 1, textTransform: 'uppercase' }}>
            Atualizar GPS
          </Text>
        </Pressable>
        <Pressable
          disabled={!ready}
          onPress={startTimer}
          style={{ backgroundColor: ready ? LD.gold : LD.surface3, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text
            style={{
              fontFamily: FONT_UI_BOLD,
              fontSize: 14,
              color: ready ? LD.textInk : LD.textDim,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Comecar o relogio
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
