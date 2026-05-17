import * as Location from 'expo-location';
import { isSupabaseConfigured, supabase } from './supabase';
import type { Gym, UUID } from '../types/domain';

export const CHECKIN_RADIUS_METERS = 100;
export const CHECKIN_DURATION_SECONDS = 15 * 60;

export type GymDistance = {
  gym: Gym;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  insideRadius: boolean;
};

export type ConfirmedCheckin = {
  checkin_id: UUID;
  gym_id: UUID;
  gym_name: string;
  distance_m: number;
  battle_day: string;
  arrived_at: string;
  confirmed_at: string;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const earthRadius = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

export async function getLinkedGymDistance(gymId: UUID): Promise<GymDistance> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase nao configurado.');
  }

  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permissao de localizacao negada.');
  }

  const [{ data: gym, error }, position] = await Promise.all([
    supabase
      .from('gyms')
      .select('id, google_place_id, name, address, lat, lng')
      .eq('id', gymId)
      .single<Gym>(),
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
  ]);

  if (error) throw error;

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const distance = distanceMeters(
    { lat: latitude, lng: longitude },
    { lat: gym.lat, lng: gym.lng }
  );

  return {
    gym,
    latitude,
    longitude,
    distanceMeters: distance,
    insideRadius: distance <= CHECKIN_RADIUS_METERS,
  };
}

export async function confirmCheckin(params: {
  latitude: number;
  longitude: number;
  arrivedAt: string;
}): Promise<ConfirmedCheckin> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await supabase
    .rpc('confirm_checkin', {
      p_lat: params.latitude,
      p_lng: params.longitude,
      p_arrived_at: params.arrivedAt,
    })
    .single<ConfirmedCheckin>();

  if (error) throw error;

  return data;
}
