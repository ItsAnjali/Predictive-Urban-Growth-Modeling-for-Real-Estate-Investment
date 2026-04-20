import { useZone } from '../api/client';
import { Badge } from './ui/Badge';
import { Card, CardTitle } from './ui/Card';
import { EmptyState, Skeleton } from './ui/EmptyState';
import { ScoreBreakdown } from './ScoreBreakdown';
import { fixed, inr, pct, toneForScore } from '../lib/format';

export const ZoneDetailsPanel = ({ zoneId }: { zoneId?: string }) => {
  const { data, isLoading } = useZone(zoneId);

  if (!zoneId) {
    return (
      <Card className="h-full">
        <EmptyState title="Select a zone" hint="Click a marker on the map or a row in the table." />
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="h-full space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </Card>
    );
  }

  const tone = toneForScore(data.growthVelocityScore) as 'high' | 'medium' | 'low';

  return (
    <Card className="h-full overflow-auto scrollbar-thin">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold text-white">{data.name}</div>
          <div className="text-xs text-slate-400">{data.city}</div>
        </div>
        <Badge tone={tone}>{data.opportunityLevel.toUpperCase()} · {data.growthVelocityScore.toFixed(1)}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Metric label="Avg ₹/sqft" value={inr(data.avgPricePerSqFt)} />
        <Metric label="Price growth" value={pct(data.priceGrowthPercent)} />
        <Metric label="Rental yield" value={pct(data.rentalYieldPercent)} />
        <Metric label="Rental absorption" value={fixed(data.rentalAbsorptionRate)} />
        <Metric label="Listing density" value={fixed(data.listingDensity, 0)} />
        <Metric label="Oversupply risk" value={fixed(data.oversupplyRisk)} />
        <Metric label="Search interest" value={fixed(data.searchVolumeIndex)} />
        <Metric label="RTM price Δ" value={pct(data.readyToMovePriceGrowth)} />
        <Metric label="Under-Const. price Δ" value={pct(data.underConstructionPriceGrowth)} />
        <Metric label="Yield / ₹k sqft" value={fixed((data.rentalYieldPercent / data.avgPricePerSqFt) * 1000, 3)} />
      </div>

      <div className="mt-6">
        <CardTitle>Score breakdown</CardTitle>
        <ScoreBreakdown scoring={data.scoring} />
      </div>

      <div className="mt-6">
        <CardTitle>Why this score</CardTitle>
        <p className="text-sm leading-relaxed text-slate-200">{data.scoring.explanation}</p>
      </div>

      <div className="mt-6">
        <CardTitle>Nearby infrastructure drivers</CardTitle>
        {data.infrastructureProjects.length === 0 ? (
          <div className="text-xs text-slate-500">No linked projects yet.</div>
        ) : (
          <ul className="space-y-2">
            {data.infrastructureProjects.map((p) => (
              <li key={p.id} className="rounded border border-slate-800 p-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-100">{p.title}</span>
                  <span className="text-slate-400">impact {p.impactScore.toFixed(2)}</span>
                </div>
                <div className="mt-0.5 text-slate-500 capitalize">{p.type} · {p.stage.replace('_', ' ')}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded border border-slate-800 bg-slate-900/60 p-2">
    <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    <div className="text-sm font-medium text-slate-100">{value}</div>
  </div>
);
