import Svg, { Polygon, Polyline, Rect } from 'react-native-svg';
import { useLD } from '../theme';

type Props = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
};

export function Sparkline({ data, width = 200, height = 40, color }: Props) {
  const LD = useLD();
  const c = color ?? LD.gold;
  const max = Math.max(...data, 1);
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;
  const pts = data.map((v, i) => `${i * stepX},${height - (v / max) * height}`).join(' ');
  const area = `0,${height} ${pts} ${width},${height}`;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polygon points={area} fill={c} fillOpacity={0.12} />
      <Polyline points={pts} fill="none" stroke={c} strokeWidth={2} />
      {data.map((v, i) => (
        <Rect
          key={i}
          x={i * stepX - 2}
          y={height - (v / max) * height - 2}
          width={4}
          height={4}
          fill={c}
        />
      ))}
    </Svg>
  );
}
