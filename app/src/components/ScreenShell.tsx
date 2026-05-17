import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLD } from '../theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  paddingTop?: number;
};

export function ScreenShell({ children, scroll = true, edges = ['top'], paddingTop = 8 }: Props) {
  const LD = useLD();
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? { contentContainerStyle: { paddingBottom: 120, paddingTop }, showsVerticalScrollIndicator: false }
    : { style: { flex: 1, paddingTop } };
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: LD.bg }]}>
      <Body {...(bodyProps as any)}>{children}</Body>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
