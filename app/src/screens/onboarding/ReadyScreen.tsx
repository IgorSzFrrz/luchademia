import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchIcon, SectionLabel } from '../../components';
import { useAuth } from '../../store/auth';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_SEMI } from '../../theme';

export function ReadyScreen() {
  const LD = useLD();
  const completeOnboarding = useAuth((state) => state.completeOnboarding);
  const enter = () => completeOnboarding();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      {/* progress dots */}
      <View style={{ paddingHorizontal: 24, paddingTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 32 }} />
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flex: 1, height: 3, backgroundColor: LD.gold }} />
          ))}
        </View>
      </View>

      {/* Title */}
      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <SectionLabel>PASSO 3 DE 3</SectionLabel>
        <Text style={{ fontFamily: FONT_DISP, fontSize: 44, lineHeight: 40, color: LD.text, marginTop: 8, letterSpacing: -0.5 }}>
          O SINO{'\n'}VAI TOCAR.
        </Text>
        <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 10 }}>
          Como você quer começar?
        </Text>
      </View>

      {/* Paths */}
      <View style={{ paddingHorizontal: 24, paddingTop: 28, gap: 12 }}>
        <PathButton
          title="BUSCAR ADVERSÁRIOS"
          subtitle="4 batalhas abertas na sua academia agora"
          recommended
          onPress={enter}
          icon={
            <View style={{ width: 44, height: 44, backgroundColor: LD.gold, alignItems: 'center', justifyContent: 'center' }}>
              <SearchIcon color={LD.textInk} size={22} />
            </View>
          }
        />
        <PathButton
          title="CRIAR BATALHA"
          subtitle="Convide alguém. 1v1 ou Battle Royale."
          onPress={enter}
          icon={
            <View style={{ width: 44, height: 44, backgroundColor: LD.surface3, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 28, color: LD.text, lineHeight: 28 }}>+</Text>
            </View>
          }
        />
        <PathButton
          title="TENHO UM CONVITE"
          subtitle="Cole um link ou código."
          onPress={enter}
          icon={
            <View style={{ width: 44, height: 44, backgroundColor: LD.surface3, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: LD.text, lineHeight: 22 }}>✉</Text>
            </View>
          }
        />
      </View>

      {/* Footnote */}
      <View
        style={{
          position: 'absolute',
          bottom: 28,
          left: 24,
          right: 24,
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: LD.surface,
          borderWidth: 1,
          borderColor: LD.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: LD.vital }} />
        <Text style={{ flex: 1, fontFamily: FONT_MONO, fontSize: 10, color: LD.textDim, letterSpacing: 0.5 }}>
          VINCULADO · SMART FIT VILA MADALENA
        </Text>
        <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: LD.gold }}>TROCAR</Text>
      </View>
    </SafeAreaView>
  );
}

type PathProps = { title: string; subtitle: string; icon: React.ReactNode; recommended?: boolean; onPress: () => void };

function PathButton({ title, subtitle, icon, recommended, onPress }: PathProps) {
  const LD = useLD();
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 18,
        backgroundColor: recommended ? LD.surface2 : LD.surface,
        borderWidth: 1,
        borderColor: recommended ? LD.gold : LD.border,
        position: 'relative',
      }}
    >
      {recommended && (
        <Text
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: LD.gold,
            letterSpacing: 2,
          }}
        >
          RECOMENDADO
        </Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        {icon}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT_DISP, fontSize: 22, color: LD.text, letterSpacing: -0.3 }}>{title}</Text>
          <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 12, color: LD.textDim, marginTop: 2 }}>{subtitle}</Text>
        </View>
      </View>
    </Pressable>
  );
}
