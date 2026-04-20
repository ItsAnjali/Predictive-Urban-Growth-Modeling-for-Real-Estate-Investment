import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Zone } from '../../types';
import { colorForScore } from '../../lib/format';

export const GrowthRankingBar = ({ zones }: { zones: Zone[] }) => {
  const data = [...zones]
    .sort((a, b) => b.growthVelocityScore - a.growthVelocityScore)
    .slice(0, 10)
    .map((z) => ({ name: z.name, score: z.growthVelocityScore }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 50 }}>
        <CartesianGrid stroke="#1e293b" />
        <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} stroke="#64748b" tick={{ fontSize: 10 }} />
        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6 }} />
        <Bar dataKey="score">
          {data.map((d) => <Cell key={d.name} fill={colorForScore(d.score)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
