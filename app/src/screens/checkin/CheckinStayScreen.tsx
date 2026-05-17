import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { SectionLabel } from '../../components';
import {
  CHECKIN_DURATION_SECONDS,
  CHECKIN_RADIUS_METERS,
  confirmCheckin,
  distanceMeters,
} from '../../lib/checkins';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { CheckinStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CheckinStackParamList, 'Stay'>;

export function CheckinStayScreen({ navigation, route }: Props) {
  const LD = useLD();
  const [now, setNow] = useState(() => Date.now());
  const [latitude, setLatitude] = useState(route.params.latitude);
  const [longitude, setLongitude] = useState(route.params.longitude);
  const [distance, setDistance] = useState(route.params.distanceMeters);
  const [outsideSeconds, setOutsideSeconds] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAt = useMemo(() => new Date(route.params.arrivedAt).getTime(), [route.params.arrivedAt]);
  const elapsedSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
  const remaining = Math.max(0, CHECKIN_DURATION_SECONDS - elapsedSeconds);
  const pct = 1 - remaining / CHECKIN_DURATION_SECONDS;
  const inside = distance <= CHECKIN_RADIUS_METERS;
  const R = 90;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function watchLocation() {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 10000,
        },
        (position) => {
          const nextLat = position.coords.latitude;
          const nextLng = position.coords.longitude;
          const nextDistance = distanceMeters(
            { lat: nextLat, lng: nextLng },
            { lat: route.params.gymLat, lng: route.params.gymLng }
          );

          setLatitude(nextLat);
          setLongitude(nextLng);
          setDistance(nextDistance);
        }
      );
    }

    watchLocation().catch((watchError) => {
      const message = watchError instanceof Error ? watchError.message : 'Nao foi possivel monitorar localizacao.';
      setError(message);
    });

    return () => {
      subscription?.remove();
    };
  }, [route.params.gymLat, route.params.gymLng]);

  useEffect(() => {
    if (cancelled) return;

    if (inside) {
      setOutsideSeconds(0);
      return;
    }

    setOutsideSeconds((current) => current + 1);
  }, [cancelled, elapsedSeconds, inside]);

  useEffect(() => {
    if (outsideSeconds < 180 || cancelled) return;
    setCancelled(true);
    setError('Check-in cancelado: voce ficou mais de 3 min fora do raio da academia.');
  }, [cancelled, outsideSeconds]);

  useEffect(() => {
    if (remaining > 0 || confirming || cancelled) return;

    async function finishCheckin() {
      setConfirming(true);
      setError(null);
      try {
        const checkin = await confirmCheckin({
          latitude,
          longitude,
          arrivedAt: route.params.arrivedAt,
        });

        navigation.replace('Done', {
          gymName: checkin.gym_name,
          confirmedAt: checkin.confirmed_at,
          distanceMeters: checkin.distance_m,
          battleDay: checkin.battle_day,
        });
      } catch (confirmError) {
        const message = confirmError instanceof Error ? confirmError.message : 'Nao foi possivel confirmar o check-in.';
        setError(message);
      } finally {
        setConfirming(false);
      }
    }

    finishCheckin().catch(() => undefined);
  }, [cancelled, confirming, latitude, longitude, navigation, remaining, route.params.arrivedAt]);

  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => navigation.getParent()?.goBack()}
          style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
        >
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
            Sair
          </Text>
        </Pressable>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textDim, letterSpacing: 1 }}>CHECK-IN 2/3</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' }}>
        <SectionLabel>{cancelled ? 'CANCELADO' : confirming ? 'CONFIRMANDO' : 'RELOGIO RODANDO'}</SectionLabel>

        <View style={{ width: 220, height: 220, marginTop: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={220} height={220} viewBox="0 0 200 200" style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={100} cy={100} r={R} fill="none" stroke={LD.surface2} strokeWidth={3} />
            <Circle
              cx={100}
              cy={100}
              r={R}
              fill="none"
              stroke={inside ? LD.gold : LD.blood}
              strokeWidth={3}
              strokeDasharray={`${C}`}
              strokeDashoffset={C * (1 - pct)}
            />
            {Array.from({ length: 60 }).map((_, i) => {
              const a = (i / 60) * Math.PI * 2;
              const r1 = 78;
              const r2 = 84;
              const x1 = 100 + Math.cos(a) * r1;
              const y1 = 100 + Math.sin(a) * r1;
              const x2 = 100 + Math.cos(a) * r2;
              const y2 = 100 + Math.sin(a) * r2;
              return (
                <Line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 5 === 0 ? LD.textDim : LD.surface3}
                  strokeWidth={1}
                />
              );
            })}
          </Svg>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, letterSpacing: 2 }}>FALTA</Text>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 64, lineHeight: 60, color: LD.text, marginTop: 4, letterSpacing: -1 }}>
              {minutes}:{seconds}
            </Text>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: inside && !cancelled ? LD.gold : LD.blood, letterSpacing: 2, marginTop: 4 }}>
              {cancelled ? 'CANCELADO' : inside ? 'DENTRO DO RAIO' : 'FORA DO RAIO'}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 36,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: LD.surface,
            borderWidth: 1,
            borderColor: inside ? LD.border : LD.blood,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            alignSelf: 'stretch',
          }}
        >
          <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: inside ? LD.vital : LD.blood }} />
            <View
              style={{
                position: 'absolute',
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: inside ? LD.vital : LD.blood,
                opacity: 0.4,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.text }}>Monitorando posicao</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, marginTop: 2 }}>
              {latitude.toFixed(5)}, {longitude.toFixed(5)} · {Math.round(distance)} m do centro
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: 16, fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.textDim, textAlign: 'center', lineHeight: 18 }}>
          Mantenha o app aberto no MVP.{'\n'}Tolerancia fora do raio: 3 min.
        </Text>
        {outsideSeconds > 0 ? (
          <Text style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 10, color: LD.blood, textAlign: 'center' }}>
            FORA DO RAIO HA {outsideSeconds}s
          </Text>
        ) : null}
        {cancelled ? (
          <Pressable
            onPress={() => navigation.getParent()?.goBack()}
            style={{ marginTop: 16, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: LD.gold }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 12, color: LD.textInk, letterSpacing: 1, textTransform: 'uppercase' }}>
              Voltar pra Home
            </Text>
          </Pressable>
        ) : null}
        {error ? (
          <Text style={{ marginTop: 12, fontFamily: FONT_MONO, fontSize: 10, color: LD.blood, textAlign: 'center', lineHeight: 16 }}>
            {error}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
