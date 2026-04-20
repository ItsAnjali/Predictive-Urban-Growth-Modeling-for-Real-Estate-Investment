import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export const OpportunitySegment = ({ data }: { data: { high: number; medium: number; low: number } }) => {
  const rows = [
    { name: 'High', value: data.high, color: '#10b981' },
    { name: 'Medium', value: data.medium, color: '#f59e0b' },
    { name: 'Low', value: data.low, color: '#ef4444' },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="name" innerRadius={35} outerRadius={60} paddingAngle={2}>
          {rows.map((r) => <Cell key={r.name} fill={r.color} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
