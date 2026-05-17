import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { useLD } from '../theme';

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MASK_PALETTES: [string, string, string][] = [
  ['#D8233A', '#E8B341', '#0A0608'],
  ['#1A4D9C', '#E8B341', '#F5EFE6'],
  ['#3FB66F', '#0A0608', '#E8B341'],
  ['#E84A8A', '#160E11', '#F5EFE6'],
  ['#7E1FCC', '#E8B341', '#F5EFE6'],
  ['#E8B341', '#D8233A', '#0A0608'],
  ['#F5EFE6', '#D8233A', '#0A0608'],
];

type Props = { name?: string; size?: number; style?: ViewStyle };

export function LuchaMask({ name = 'Bruno', size = 44, style }: Props) {
  const LD = useLD();
  const h = hashStr(name);
  const [bg, accent, ink] = MASK_PALETTES[h % MASK_PALETTES.length];
  const template = h % 4;

  return (
    <Svg viewBox="0 0 60 60" width={size} height={size} style={style}>
      <Rect x={0} y={0} width={60} height={60} rx={6} fill={LD.surface2} />
      <Path
        d="M30 6 C 17 6, 9 16, 9 30 L 9 60 L 51 60 L 51 30 C 51 16, 43 6, 30 6 Z"
        fill={bg}
      />
      {template === 0 && (
        <>
          <Path d="M27 6 L33 6 L34 30 L26 30 Z" fill={accent} />
          <Path d="M16 28 L24 26 L24 32 L16 32 Z" fill={ink} />
          <Path d="M36 26 L44 28 L44 32 L36 32 Z" fill={ink} />
          <Rect x={28} y={40} width={4} height={6} fill={ink} />
        </>
      )}
      {template === 1 && (
        <>
          <Path d="M30 12 L42 24 L30 30 L18 24 Z" fill={accent} />
          <Circle cx={22} cy={34} r={3} fill={ink} />
          <Circle cx={38} cy={34} r={3} fill={ink} />
          <Path d="M24 44 L36 44 L34 48 L26 48 Z" fill={ink} />
        </>
      )}
      {template === 2 && (
        <>
          <Rect x={9} y={20} width={42} height={4} fill={accent} />
          <Rect x={9} y={42} width={42} height={3} fill={accent} />
          <Ellipse cx={22} cy={32} rx={5} ry={3} fill={ink} />
          <Ellipse cx={38} cy={32} rx={5} ry={3} fill={ink} />
        </>
      )}
      {template === 3 && (
        <>
          <Path d="M30 8 L26 26 L33 26 L28 44 L40 22 L33 22 L37 8 Z" fill={accent} />
          <Rect x={14} y={30} width={8} height={2} fill={ink} />
          <Rect x={38} y={30} width={8} height={2} fill={ink} />
        </>
      )}
    </Svg>
  );
}
