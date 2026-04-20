import { CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import type { Zone } from '../../types';
import { colorForScore } from '../../lib/format';

export const PriceVsRentalScatter = ({ zones }: { zones: Zone[] }) => {
  const data = zones.map((z) => ({
    name: z.name,
    x: z.priceGrowthPercent,
    y: z.rentalAbsorptionRate,
    z: z.growthVelocityScore,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
        <CartesianGrid stroke="#1e293b" />
        <XAxis type="number" dataKey="x" name="Price growth %" stroke="#64748b" tick={{ fontSize: 10 }} />
        <YAxis type="number" dataKey="y" name="Rental absorption" stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 1]} />
        <ZAxis dataKey="z" range={[40, 200]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6 }}
          formatter={(v: any, n: string) => [typeof v === 'number' ? v.toFixed(2) : v, n]}
          labelFormatter={() => ''}
        />
        <Scatter data={data}>
          {data.map((d) => <Cell key={d.name} fill={colorForScore(d.z)} />)}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};
