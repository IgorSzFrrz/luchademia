import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PinIcon } from '../../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../../theme';
import type { CheckinStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CheckinStackParamList, 'Arrival'>;

export function CheckinArrivalScreen({ navigation }: Props) {
  const LD = useLD();

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
            ‹ Cancelar
          </Text>
        </Pressable>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textDim, letterSpacing: 1 }}>CHECK-IN 1/3</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' }}>
        {/* GPS hero icon */}
        <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <View
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: LD.vital,
              opacity: 0.3,
            } as any}
          />
          <View
            style={{
              position: 'absolute',
              inset: 14,
              borderRadius: 36,
              borderWidth: 1,
              borderColor: LD.vital,
              opacity: 0.5,
            } as any}
          />
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: LD.vital,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PinIcon color={LD.textInk} size={20} />
          </View>
        </View>

        <Text style={{ fontFamily: FONT_DISP, fontSize: 42, lineHeight: 40, color: LD.text, letterSpacing: -0.5, textAlign: 'center' }}>
          VOCÊ CHEGOU{'\n'}NO RINGUE
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
          GPS confirmou que você está dentro da Smart Fit Vila Madalena.
        </Text>

        {/* Gym info card */}
        <View
          style={{
            marginTop: 28,
            padding: 16,
            backgroundColor: LD.surface,
            borderWidth: 1,
            borderColor: LD.border,
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View style={{ width: 36, height: 36, backgroundColor: LD.surface3, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: LD.gold, fontFamily: FONT_DISP, fontSize: 18 }}>🏋</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 13, color: LD.text }}>Smart Fit Vila Madalena</Text>
            <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.textMuted, marginTop: 2 }}>
              R. Wisard, 23 · 18 m do centro
            </Text>
          </View>
        </View>

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
          PRÓXIMO: 15 MIN DE PERMANÊNCIA{'\n'}PODE TREINAR. AVISAMOS QUANDO CONFIRMAR.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Pressable
          onPress={() => navigation.navigate('Stay')}
          style={{ backgroundColor: LD.gold, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 14, color: LD.textInk, letterSpacing: 1, textTransform: 'uppercase' }}>
            Começar o relógio
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
