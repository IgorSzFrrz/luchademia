import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { acceptBattle, parseBattleInviteCode } from '../lib/battles';
import { SectionLabel } from '../components';
import { useLD, FONT_DISP, FONT_MONO, FONT_UI_BOLD, FONT_UI_SEMI } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'InviteBattle'>;

export function InviteBattleScreen({ navigation }: Props) {
  const LD = useLD();
  const [inviteText, setInviteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const battleId = parseBattleInviteCode(inviteText);

  const handleAccept = async () => {
    if (!battleId) {
      setError('Cole um codigo ou link de convite valido.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const acceptedBattleId = await acceptBattle(battleId);
      navigation.replace('BattleDetail', { battleId: acceptedBattleId });
    } catch (acceptError) {
      const message = acceptError instanceof Error ? acceptError.message : 'Nao foi possivel aceitar o convite.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LD.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: LD.border }}
          >
            <Text style={{ fontFamily: FONT_UI_BOLD, fontSize: 11, color: LD.text, letterSpacing: 1, textTransform: 'uppercase' }}>
              Voltar
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingTop: 28 }}>
          <SectionLabel>CONVITE</SectionLabel>
          <Text style={{ fontFamily: FONT_DISP, fontSize: 42, lineHeight: 40, color: LD.text, marginTop: 8, letterSpacing: 0 }}>
            ENTRAR NA{'\n'}BATALHA
          </Text>
          <Text style={{ fontFamily: FONT_UI_SEMI, fontSize: 13, color: LD.textDim, marginTop: 10, lineHeight: 18 }}>
            Cole o codigo LUCHA ou o link recebido. Ao aceitar, a batalha 1v1 fica ativa imediatamente.
          </Text>
        </View>

        <View style={{ marginTop: 24, padding: 14, backgroundColor: LD.surface, borderWidth: 1, borderColor: LD.border }}>
          <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: LD.textMuted, letterSpacing: 2, marginBottom: 8 }}>
            CODIGO OU LINK
          </Text>
          <TextInput
            value={inviteText}
            onChangeText={setInviteText}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="LUCHA:..."
            placeholderTextColor={LD.textMuted}
            multiline
            style={{
              minHeight: 96,
              padding: 12,
              backgroundColor: LD.bg,
              borderWidth: 1,
              borderColor: battleId ? LD.gold : LD.border,
              color: LD.text,
              fontFamily: FONT_MONO,
              fontSize: 12,
              lineHeight: 18,
              textAlignVertical: 'top',
            }}
          />
          <Text style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 10, color: battleId ? LD.vital : LD.textMuted, lineHeight: 16 }}>
            {battleId ? `Batalha detectada: ${battleId}` : 'Aceita codigo LUCHA, UUID ou link contendo o UUID da batalha.'}
          </Text>
        </View>

        {error ? (
          <Text style={{ marginTop: 12, fontFamily: FONT_MONO, fontSize: 10, color: LD.blood, lineHeight: 16 }}>
            {error}
          </Text>
        ) : null}

        <View style={{ marginTop: 'auto', paddingBottom: 24 }}>
          <Pressable
            disabled={submitting || !battleId}
            onPress={handleAccept}
            style={{
              backgroundColor: battleId && !submitting ? LD.gold : LD.surface3,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: FONT_UI_BOLD,
                fontSize: 14,
                color: battleId && !submitting ? LD.textInk : LD.textDim,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {submitting ? 'Aceitando...' : 'Aceitar desafio'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
