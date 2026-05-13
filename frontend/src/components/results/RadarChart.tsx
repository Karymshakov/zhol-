import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import type { ScoresMap } from '../../types';
import { RIASEC_NAMES } from '../../utils/scoring';

interface Props {
  scores: ScoresMap;
}

export default function RiasecRadar({ scores }: Props) {
  const data = ['R', 'I', 'A', 'S', 'E', 'C'].map((key) => ({
    subject: RIASEC_NAMES[key],
    value: Math.max(0, scores[key] ?? 0),
    fullMark: 15,
  }));

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'Onest' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 15]}
            tick={{ fontSize: 9, fill: '#94A3B8' }}
          />
          <Radar
            name="Профиль"
            dataKey="value"
            stroke="#4A7CF5"
            fill="#4A7CF5"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [
              typeof value === 'number' ? value.toFixed(1) : value,
              'Балл',
            ]}
            contentStyle={{
              fontFamily: 'Onest',
              fontSize: 12,
              borderRadius: 10,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
