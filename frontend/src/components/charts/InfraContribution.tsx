import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Zone } from '../../types';

export const InfraContribution = ({ zones }: { zones: Zone[] }) => {
  const data = [...zones]
    .sort((a, b) => b.growthVelocityScore - a.growthVelocityScore)
    .slice(0, 10)
    .map((z) => ({
      name: z.name,
      infra: +(z.infrastructureActivityScore * 100).toFixed(1),
      rental: +(z.rentalAbsorptionRate * 100).toFixed(1),
      risk: +(z.oversupplyRisk * 100).toFixed(1),
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 50 }}>
        <CartesianGrid stroke="#1e293b" />
        <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} stroke="#64748b" tick={{ fontSize: 10 }} />
        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="infra" stackId="a" fill="#6366f1" />
        <Bar dataKey="rental" stackId="a" fill="#10b981" />
        <Bar dataKey="risk" stackId="a" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};
