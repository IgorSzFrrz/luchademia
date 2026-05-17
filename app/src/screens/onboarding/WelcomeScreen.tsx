import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LuchaMask, GoogleGlyph } from '../../components';
import { useAuth } from '../../store/auth';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI, FONT_UI_BOLD } from '../../theme';

export function WelcomeScreen() {
  const LD = useLD();
  const { signInWithGoogle, oauthLoading, error } = useAuth();

  const handleGooglePress = useCallback(() => {
    signInWithGoogle().catch(() => undefined);
  }, [signInWithGoogle]);

  return (
    <View style={{ flex: 1, backgroundColor: LD.bg }}>
      {/* radial blood glow + rings */}
      <Svg style={{ position: 'absolute', inset: 0 } as any} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="blood" cx="50%" cy="30%" r="60%">
            <Stop offset="0%" stopColor={LD.bloodDeep} stopOpacity={0.27} />
            <Stop offset="60%" stopColor={LD.bloodDeep} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#blood)" />
      </Svg>
      <Svg
        style={{ position: 'absolute', top: 100, left: 0, right: 0, height: 360, opacity: 0.18 } as any}
        width="100%"
        height="360"
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid meet"
      >
        <Circle cx="180" cy="180" r="140" stroke={LD.gold} strokeWidth="1" fill="none" />
        <Circle cx="180" cy="180" r="100" stroke={LD.gold} strokeWidth="1" fill="none" />
        <Circle cx="180" cy="180" r="60" stroke={LD.gold} strokeWidth="1" fill="none" />
      </Svg>

      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', gap: 28, marginTop: 80 }}>
          <View>
            <LuchaMask name="HERO-RED" size={140} />
            <View
              style={{
                position: 'absolute',
                bottom: -4,
                alignSelf: 'center',
                backgroundColor: LD.blood,
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: '#fff', letterSpacing: 2 }}>v.1</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 72, lineHeight: 64, color: LD.text, letterSpacing: -1 }}>
              LUCHA
            </Text>
            <Text style={{ fontFamily: FONT_DISP, fontSize: 72, lineHeight: 64, color: LD.blood, letterSpacing: -1 }}>
              DEMIA
            </Text>
            <Text
              style={{
                fontFamily: FONT_UI,
                fontSize: 15,
                color: LD.textDim,
                marginTop: 16,
                lineHeight: 21,
                textAlign: 'center',
                maxWidth: 260,
              }}
            >
              Bata sua frequência.{'\n'}Derrote os outros.
            </Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Pressable
            disabled={oauthLoading}
            onPress={handleGooglePress}
            style={{
              backgroundColor: oauthLoading ? LD.surface3 : LD.gold,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <GoogleGlyph size={18} />
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 15,
                color: oauthLoading ? LD.textDim : LD.textInk,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {oauthLoading ? 'Entrando...' : 'Continuar com Google'}
            </Text>
          </Pressable>
          {error ? (
            <Text
              style={{
                textAlign: 'center',
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: LD.blood,
                letterSpacing: 0.5,
                lineHeight: 16,
              }}
            >
              {error}
            </Text>
          ) : null}
          <Text
            style={{
              textAlign: 'center',
              fontFamily: FONT_MONO,
              fontSize: 9,
              color: LD.textMuted,
              letterSpacing: 1,
              marginTop: 4,
            }}
          >
            AO ENTRAR VOCÊ ACEITA OS TERMOS E A POLÍTICA DE PRIVACIDADE
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
