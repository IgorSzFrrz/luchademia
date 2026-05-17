import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = { color: string; size?: number };

export function HomeIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.4}>
      <Path d="M3 11 L12 3 L21 11 L21 21 L14 21 L14 14 L10 14 L10 21 L3 21 Z" />
    </Svg>
  );
}

export function SearchIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.4}>
      <Circle cx={11} cy={11} r={6} />
      <Path d="M16 16 L21 21" strokeLinecap="square" />
    </Svg>
  );
}

export function CrownIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="miter">
      <Path d="M3 7 L7 12 L12 5 L17 12 L21 7 L20 19 L4 19 Z" />
    </Svg>
  );
}

export function MaskIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.4}>
      <Path
        d="M4 6 C 4 4, 6 3, 12 3 C 18 3, 20 4, 20 6 L 20 14 C 20 19, 16 21, 12 21 C 8 21, 4 19, 4 14 Z"
        strokeLinejoin="miter"
      />
      <Path d="M8 11 L11 11 M13 11 L16 11" strokeLinecap="square" />
    </Svg>
  );
}

export function PinIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg viewBox="0 0 18 18" width={size} height={size} fill="none" stroke={color} strokeWidth={2.5}>
      <Path d="M9 1 C 5 1, 2 4, 2 8 C 2 13, 9 17, 9 17 C 9 17, 16 13, 16 8 C 16 4, 13 1, 9 1 Z" />
      <Circle cx={9} cy={8} r={2.5} />
    </Svg>
  );
}

export function CheckIcon({ color, size = 14, weight = 2.5 }: IconProps & { weight?: number }) {
  return (
    <Svg viewBox="0 0 14 14" width={size} height={size} fill="none" stroke={color} strokeWidth={weight}>
      <Path d="M2 7 L6 11 L12 3" />
    </Svg>
  );
}

export function ChevronLeftIcon({ color, size = 14 }: IconProps) {
  return (
    <Svg viewBox="0 0 14 14" width={size} height={size} fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 2 L3 7 L9 12" />
    </Svg>
  );
}

export function ChevronDownIcon({ color, size = 14 }: IconProps) {
  return (
    <Svg viewBox="0 0 14 14" width={size} height={size} fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 5 L7 9 L11 5" />
    </Svg>
  );
}

export function StarIcon({ color, size = 12 }: IconProps) {
  return (
    <Svg viewBox="0 0 12 12" width={size} height={size} fill={color}>
      <Path d="M6 1 L7.5 4.5 L11 5 L8 8 L9 11 L6 9 L3 11 L4 8 L1 5 L4.5 4.5 Z" />
    </Svg>
  );
}

export function FlameIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path d="M12 2 C 10 6, 14 8, 12 12 C 10 8, 6 10, 8 16 C 8 20, 12 22, 12 22 C 12 22, 16 20, 16 16 C 18 10, 14 8, 12 2 Z" />
    </Svg>
  );
}

export function GoogleGlyph({ size = 18 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 18 18" width={size} height={size}>
      <Path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.06-1.79 2.7v2.24h2.9c1.7-1.56 2.69-3.87 2.69-6.58z"
        fill="#4285F4"
      />
      <Path
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.8.54-1.83.86-3.06.86-2.36 0-4.36-1.59-5.07-3.73H.96v2.31C2.44 15.98 5.48 18 9 18z"
        fill="#34A853"
      />
      <Path
        d="M3.93 10.71c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V4.98H.96A8.99 8.99 0 000 9c0 1.45.35 2.82.96 4.02l2.97-2.31z"
        fill="#FBBC05"
      />
      <Path
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.98L3.93 7.29C4.64 5.16 6.64 3.58 9 3.58z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function CrownTopIcon({ gold, deep, blood, width = 32, height = 20 }: { gold: string; deep: string; blood: string; width?: number; height?: number }) {
  return (
    <Svg viewBox="0 0 32 20" width={width} height={height}>
      <Path d="M2 18 L4 4 L10 12 L16 2 L22 12 L28 4 L30 18 Z" fill={gold} stroke={deep} strokeWidth={1} />
      <Circle cx={16} cy={8} r={2} fill={blood} />
    </Svg>
  );
}

export function LockIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke={color} strokeWidth={2}>
      <Rect x={3} y={7} width={10} height={7} />
      <Path d="M5 7 V 5 C 5 3, 7 2, 8 2 C 9 2, 11 3, 11 5 V 7" />
    </Svg>
  );
}

export function CrossIcon({ color, size = 14 }: IconProps) {
  return (
    <Svg viewBox="0 0 14 14" width={size} height={size}>
      <Path d="M2 2 L12 12 M12 2 L2 12" stroke={color} strokeWidth={2.5} />
    </Svg>
  );
}
