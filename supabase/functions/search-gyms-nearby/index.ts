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

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  reset_at: string;
};

const MAX_BODY_BYTES = 2048;
const RATE_LIMIT_WINDOW_SECONDS = 3600;
const RATE_LIMIT_MAX_REQUESTS = 30;
const MAX_RADIUS_METERS = 5000;
const MAX_RESULTS = 12;

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
    const body = await readJsonBody(req);
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const radiusMeters = clamp(Number(body.radiusMeters ?? 3000), 100, MAX_RADIUS_METERS);
    const maxResults = clamp(Number(body.maxResults ?? 12), 1, MAX_RESULTS);

    if (!isValidCoordinate(lat, -90, 90) || !isValidCoordinate(lng, -180, 180)) {
      return json({ error: 'invalid_coordinates' }, 400);
    }

    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const anonKey = getAnonKey();
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return json({ error: 'not_authenticated' }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError || !userData.user) {
      return json({ error: 'not_authenticated' }, 401);
    }

    const { data: quota, error: quotaError } = await userClient
      .rpc('consume_search_gyms_nearby_quota', {
        p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
        p_max_requests: RATE_LIMIT_MAX_REQUESTS,
      })
      .single<RateLimitResult>();

    if (quotaError || !quota) {
      console.error('search-gyms-nearby quota check failed', quotaError);
      return json({ error: 'quota_check_failed' }, 500);
    }

    if (!quota.allowed) {
      const retryAfter = retryAfterSeconds(quota.reset_at);
      return json(
        { error: 'rate_limited', remaining: quota.remaining, resetAt: quota.reset_at },
        429,
        { 'Retry-After': String(retryAfter) }
      );
    }

    const googlePlacesKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!googlePlacesKey) {
      console.error('search-gyms-nearby GOOGLE_PLACES_API_KEY missing');
      return json({ error: 'service_unavailable' }, 503);
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
      console.error('search-gyms-nearby google request failed', googleResponse.status, googleJson);
      return json({ error: 'google_places_failed' }, 502);
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

    const serviceKey = getServiceKey();
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data, error } = await adminClient
      .from('gyms')
      .upsert(gyms, { onConflict: 'google_place_id' })
      .select('id, google_place_id, name, address, lat, lng');

    if (error) {
      console.error('search-gyms-nearby gym upsert failed', error);
      return json({ error: 'gym_upsert_failed' }, 500);
    }

    return json({ gyms: data ?? [] });
  } catch (error) {
    if (error instanceof RequestError) {
      return json({ error: error.code }, error.status);
    }

    console.error('search-gyms-nearby unexpected error', error);
    return json({ error: 'unexpected_error' }, 500);
  }
});

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function readJsonBody(req: Request): Promise<RequestBody> {
  const contentLength = Number(req.headers.get('Content-Length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new RequestError('payload_too_large', 413);
  }

  try {
    const text = await req.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
      throw new RequestError('payload_too_large', 413);
    }

    return JSON.parse(text) as RequestBody;
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError('invalid_json', 400);
  }
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.round(value), min), max);
}

function isValidCoordinate(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function retryAfterSeconds(resetAt: string) {
  const resetTime = new Date(resetAt).getTime();
  if (!Number.isFinite(resetTime)) return RATE_LIMIT_WINDOW_SECONDS;

  return Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));
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
    try {
      const keys = JSON.parse(publishable) as Record<string, string>;
      const first = Object.values(keys)[0];
      if (first) return first;
    } catch {
      throw new Error('supabase_publishable_keys_invalid');
    }
  }

  throw new Error('supabase_anon_key_missing');
}

function getServiceKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (legacy) return legacy;

  const secret = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (secret) {
    try {
      const keys = JSON.parse(secret) as Record<string, string>;
      const first = Object.values(keys)[0];
      if (first) return first;
    } catch {
      throw new Error('supabase_secret_keys_invalid');
    }
  }

  throw new Error('supabase_service_key_missing');
}

class RequestError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number
  ) {
    super(code);
  }
}
