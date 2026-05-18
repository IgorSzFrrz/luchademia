import * as Location from 'expo-location';
import { isSupabaseConfigured, supabase } from './supabase';
import type { Gym } from '../types/domain';

export type GymSearchMode = 'seed' | 'nearby';

export type GymSelectionResult = {
  gyms: Gym[];
  mode: GymSearchMode;
  usedFallback: boolean;
  message: string | null;
};

export async function listGymsForSelection(mode: GymSearchMode = 'seed'): Promise<Gym[]> {
  const result = await searchGymsForSelection(mode);
  return result.gyms;
}

export async function searchGymsForSelection(mode: GymSearchMode = 'seed'): Promise<GymSelectionResult> {
  if (mode === 'nearby') {
    try {
      const gyms = await searchNearbyGyms();
      return {
        gyms,
        mode: 'nearby',
        usedFallback: false,
        message: gyms.length ? null : 'Nenhuma academia encontrada perto de voce.',
      };
    } catch (error) {
      const fallback = await listSeedGyms();
      const message = error instanceof Error ? error.message : 'Nao foi possivel buscar academias proximas.';
      return {
        gyms: fallback,
        mode: 'seed',
        usedFallback: true,
        message: `${message} Mostrando academias cadastradas.`,
      };
    }
  }

  const gyms = await listSeedGyms();
  return { gyms, mode: 'seed', usedFallback: false, message: null };
}

async function listSeedGyms(): Promise<Gym[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('gyms')
    .select('id, google_place_id, name, address, lat, lng')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []) as Gym[];
}

async function searchNearbyGyms(): Promise<Gym[]> {
  if (!isSupabaseConfigured) return [];

  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permissao de localizacao negada.');
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { data, error } = await supabase.functions.invoke<{ gyms: Gym[] }>('search-gyms-nearby', {
    body: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      radiusMeters: 3000,
      maxResults: 12,
    },
  });

  if (error) throw error;

  return data?.gyms ?? [];
}
