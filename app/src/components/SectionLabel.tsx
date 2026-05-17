import { Text, TextStyle } from 'react-native';
import { useLD, FONT_UI_BOLD } from '../theme';

type Props = { children: React.ReactNode; color?: string; style?: TextStyle };

export function SectionLabel({ children, color, style }: Props) {
  const LD = useLD();
  return (
    <Text
      style={[
        {
          fontFamily: FONT_UI_BOLD,
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: color ?? LD.textDim,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
