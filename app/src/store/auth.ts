import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { DEMO_GYM_ID, demoProfile, demoSession, demoUser, isDemoAppMode, isDemoDataEnabled, isDemoOnboardingMode } from '../lib/demo';
import type { Profile, UUID } from '../types/domain';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({
  scheme: 'luchademia',
  path: 'auth/callback',
});

async function createSessionFromUrl(url: string): Promise<Session | null> {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(String(errorCode));

  const code = typeof params.code === 'string' ? params.code : undefined;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data.session;
  }

  const accessToken = typeof params.access_token === 'string' ? params.access_token : undefined;
  const refreshToken = typeof params.refresh_token === 'string' ? params.refresh_token : undefined;

  if (!accessToken || !refreshToken) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw error;

  return data.session;
}

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  onboardingComplete: boolean;
  oauthLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
  setGym: (gymId: UUID) => Promise<boolean>;
  completeOnboarding: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  handleOAuthRedirect: (url: string) => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  profileLoading: false,
  onboardingComplete: false,
  oauthLoading: false,
  error: null,

  init: async () => {
    if (isDemoDataEnabled) {
      set({
        session: demoSession,
        user: demoUser,
        profile: isDemoAppMode ? demoProfile : { ...demoProfile, gym_id: null },
        loading: false,
        profileLoading: false,
        onboardingComplete: isDemoAppMode,
      });
      return;
    }

    if (!isSupabaseConfigured) {
      set({ loading: false });
      return;
    }
    try {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, user: data.session?.user ?? null, loading: false });
      if (data.session?.user) {
        get().refreshProfile().catch(() => undefined);
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          profile: session ? get().profile : null,
          onboardingComplete: session ? get().onboardingComplete : false,
        });
        if (session?.user) {
          get().refreshProfile().catch(() => undefined);
        }
      });
    } catch {
      set({ loading: false, error: 'Nao foi possivel iniciar a sessao.' });
    }
  },

  refreshProfile: async (): Promise<Profile | null> => {
    if (isDemoDataEnabled) {
      const profile = isDemoAppMode ? demoProfile : { ...demoProfile, gym_id: null };
      set({ profile, profileLoading: false, onboardingComplete: isDemoAppMode });
      return profile;
    }

    const user = get().user;
    if (!isSupabaseConfigured || !user) {
      set({ profile: null, profileLoading: false, onboardingComplete: false });
      return null;
    }

    set({ profileLoading: true });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, gym_id, created_at')
        .eq('id', user.id)
        .maybeSingle<Profile>();

      if (error) throw error;
      set({
        profile: data ?? null,
        profileLoading: false,
        onboardingComplete: !!data?.gym_id,
      });
      return data ?? null;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel carregar o perfil.';
      set({ profileLoading: false, error: message });
      return null;
    }
  },

  setGym: async (gymId: UUID): Promise<boolean> => {
    if (isDemoDataEnabled) {
      set({
        profile: { ...demoProfile, gym_id: gymId || DEMO_GYM_ID },
        profileLoading: false,
        onboardingComplete: false,
        error: null,
      });
      return true;
    }

    const user = get().user;
    if (!isSupabaseConfigured || !user) {
      set({ error: 'Sessao ausente. Entre novamente para escolher a academia.' });
      return false;
    }

    set({ profileLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ gym_id: gymId })
        .eq('id', user.id)
        .select('id, display_name, avatar_url, gym_id, created_at')
        .single<Profile>();

      if (error) throw error;
      set({ profile: data, profileLoading: false, onboardingComplete: false });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel vincular a academia.';
      set({ profileLoading: false, error: message });
      return false;
    }
  },

  completeOnboarding: () => set({ onboardingComplete: true }),

  signInWithGoogle: async (): Promise<void> => {
    if (isDemoDataEnabled) {
      set({
        session: demoSession,
        user: demoUser,
        profile: isDemoOnboardingMode ? { ...demoProfile, gym_id: null } : demoProfile,
        onboardingComplete: isDemoAppMode,
        oauthLoading: false,
        error: null,
      });
      return;
    }

    if (!isSupabaseConfigured) {
      set({ error: 'Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no app/.env.' });
      return;
    }

    set({ oauthLoading: true, error: null });
    try {
      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });

        if (error) throw error;
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('Supabase nao retornou URL de OAuth.');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success') {
        const session = await createSessionFromUrl(result.url);
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          await get().refreshProfile();
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel entrar com Google.';
      set({ error: message });
    } finally {
      set({ oauthLoading: false });
    }
  },

  signOut: async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
    }
    set({ session: null, user: null, profile: null, onboardingComplete: false, error: null });
  },

  handleOAuthRedirect: async (url: string): Promise<void> => {
    if (!isSupabaseConfigured) return;
    try {
      const session = await createSessionFromUrl(url);
      if (session) {
        set({ session, user: session.user, error: null });
        await get().refreshProfile();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel concluir o login.';
      set({ error: message });
    }
  },
}));
