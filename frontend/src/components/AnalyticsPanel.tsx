import { useSummary } from '../api/client';
import { Card, CardTitle } from './ui/Card';
import { Skeleton } from './ui/EmptyState';
import { OpportunitySegment } from './charts/OpportunitySegment';

export const AnalyticsPanel = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { data, isLoading } = useSummary();

  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24" /><Skeleton className="h-40" /><Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardTitle>Portfolio summary</CardTitle>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Stat label="Zones" value={data.totalZones.toString()} />
          <Stat label="Avg GVS" value={data.avgScore.toString()} />
          <Stat label="High" value={data.opportunityDistribution.high.toString()} tone="emerald" />
          <Stat label="Medium" value={data.opportunityDistribution.medium.toString()} tone="amber" />
        </div>
      </Card>

      <Card>
        <CardTitle>Opportunity mix</CardTitle>
        <div className="h-40">
          <OpportunitySegment data={data.opportunityDistribution} />
        </div>
      </Card>

      <List title="Top 5 Growth zones" zones={data.topGrowth} onSelect={onSelect} valueKey="growthVelocityScore" />
      <List title="Undervalued rising" zones={data.undervalued} onSelect={onSelect} valueKey="growthVelocityScore" empty="No undervalued picks yet." />
      <List title="Highest rental absorption" zones={data.topRental} onSelect={onSelect} valueKey="rentalAbsorptionRate" />
      <List title="Rising prices" zones={data.risingPrice} onSelect={onSelect} valueKey="priceGrowthPercent" suffix="%" />
    </div>
  );
};

const Stat = ({ label, value, tone }: { label: string; value: string; tone?: 'emerald' | 'amber' }) => (
  <div className="rounded border border-slate-800 p-2">
    <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`text-lg font-semibold ${tone === 'emerald' ? 'text-emerald-300' : tone === 'amber' ? 'text-amber-300' : 'text-slate-100'}`}>{value}</div>
  </div>
);

const List = ({
  title, zones, onSelect, valueKey, suffix = '', empty,
}: {
  title: string;
  zones: any[];
  onSelect: (id: string) => void;
  valueKey: string;
  suffix?: string;
  empty?: string;
}) => (
  <Card>
    <CardTitle>{title}</CardTitle>
    {zones.length === 0 ? (
      <div className="text-xs text-slate-500">{empty || '—'}</div>
    ) : (
      <ul className="space-y-1">
        {zones.map((z) => (
          <li
            key={z.id}
            onClick={() => onSelect(z.id)}
            className="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm hover:bg-slate-800"
          >
            <span className="text-slate-200">{z.name}</span>
            <span className="text-slate-400 text-xs">{Number(z[valueKey]).toFixed(1)}{suffix}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);
