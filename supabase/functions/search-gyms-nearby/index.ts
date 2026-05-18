import { createClient } from 'npm:@supabase/supabase-js@2';

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
};

type RequestBody = {
  lat?: number;
  lng?: number;
  radiusMeters?: number;
  maxResults?: number;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  try {
    const body = (await req.json()) as RequestBody;
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const radiusMeters = clamp(Number(body.radiusMeters ?? 3000), 100, 10000);
    const maxResults = clamp(Number(body.maxResults ?? 12), 1, 20);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return json({ error: 'invalid_coordinates' }, 400);
    }

    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const anonKey = getAnonKey();
    const serviceKey = getServiceKey();
    const googlePlacesKey = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!googlePlacesKey) {
      return json({ error: 'google_places_key_missing' }, 500);
    }

    const authHeader = req.headers.get('Authorization') ?? '';
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError || !userData.user) {
      return json({ error: 'not_authenticated' }, 401);
    }

    const googleResponse = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googlePlacesKey,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.location',
          'places.primaryType',
          'places.types',
        ].join(','),
      },
      body: JSON.stringify({
        includedTypes: ['gym'],
        maxResultCount: maxResults,
        rankPreference: 'DISTANCE',
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radiusMeters,
          },
        },
      }),
    });

    const googleJson = await googleResponse.json();

    if (!googleResponse.ok) {
      return json({ error: 'google_places_failed', details: googleJson }, googleResponse.status);
    }

    const places = Array.isArray(googleJson.places) ? (googleJson.places as GooglePlace[]) : [];
    const gyms = places
      .map((place) => {
        const placeId = place.id;
        const name = place.displayName?.text;
        const address = place.formattedAddress ?? null;
        const placeLat = place.location?.latitude;
        const placeLng = place.location?.longitude;

        if (!placeId || !name || !Number.isFinite(placeLat) || !Number.isFinite(placeLng)) {
          return null;
        }

        return {
          google_place_id: placeId,
          name,
          address,
          lat: Number(placeLat),
          lng: Number(placeLng),
        };
      })
      .filter((gym): gym is NonNullable<typeof gym> => gym !== null);

    if (gyms.length === 0) {
      return json({ gyms: [] });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data, error } = await adminClient
      .from('gyms')
      .upsert(gyms, { onConflict: 'google_place_id' })
      .select('id, google_place_id, name, address, lat, lng');

    if (error) {
      return json({ error: 'gym_upsert_failed', details: error.message }, 500);
    }

    return json({ gyms: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unexpected_error';
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.round(value), min), max);
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name.toLowerCase()}_missing`);
  return value;
}

function getAnonKey() {
  const legacy = Deno.env.get('SUPABASE_ANON_KEY');
  if (legacy) return legacy;

  const publishable = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS');
  if (publishable) {
    const keys = JSON.parse(publishable) as Record<string, string>;
    const first = Object.values(keys)[0];
    if (first) return first;
  }

  throw new Error('supabase_anon_key_missing');
}

function getServiceKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (legacy) return legacy;

  const secret = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (secret) {
    const keys = JSON.parse(secret) as Record<string, string>;
    const first = Object.values(keys)[0];
    if (first) return first;
  }

  throw new Error('supabase_service_key_missing');
}
