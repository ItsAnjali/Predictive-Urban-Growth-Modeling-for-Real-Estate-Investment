import { useMemo, useState } from 'react';
import { TopBar } from './components/TopBar';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ZoneMap } from './components/ZoneMap';
import { ZoneDetailsPanel } from './components/ZoneDetailsPanel';
import { ZonesTable } from './components/ZonesTable';
import { Card, CardTitle } from './components/ui/Card';
import { EmptyState, Skeleton } from './components/ui/EmptyState';
import { GrowthRankingBar } from './components/charts/GrowthRankingBar';
import { PriceVsRentalScatter } from './components/charts/PriceVsRentalScatter';
import { InfraContribution } from './components/charts/InfraContribution';
import { useZones } from './api/client';
import type { FilterKey } from './types';

export default function App() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const { data: zones = [], isLoading } = useZones(filter);

  const map = useMemo(() => zones, [zones]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <TopBar filter={filter} setFilter={setFilter} />

      <main className="grid flex-1 gap-3 p-3" style={{ gridTemplateColumns: '320px 1fr 360px' }}>
        <aside className="overflow-auto scrollbar-thin">
          <AnalyticsPanel onSelect={setSelectedId} />
        </aside>

        <section className="min-h-[520px]">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : zones.length === 0 ? (
            <Card className="h-full">
              <EmptyState title="No zones yet" hint="Use Reseed or upload a CSV/JSON to populate the map." />
            </Card>
          ) : (
            <ZoneMap zones={map} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </section>

        <aside className="min-h-[520px]">
          <ZoneDetailsPanel zoneId={selectedId} />
        </aside>
      </main>

      <section className="grid gap-3 p-3" style={{ gridTemplateColumns: '1.2fr 1fr 1fr' }}>
        <Card className="h-80">
          <CardTitle sub="Top 10 by Growth Velocity Score">Score ranking</CardTitle>
          <div className="h-[calc(100%-44px)]"><GrowthRankingBar zones={zones} /></div>
        </Card>
        <Card className="h-80">
          <CardTitle sub="Bubble size = GVS">Price growth vs rental absorption</CardTitle>
          <div className="h-[calc(100%-44px)]"><PriceVsRentalScatter zones={zones} /></div>
        </Card>
        <Card className="h-80">
          <CardTitle sub="Infra vs rental vs oversupply risk">Metric contribution</CardTitle>
          <div className="h-[calc(100%-44px)]"><InfraContribution zones={zones} /></div>
        </Card>
      </section>

      <section className="p-3">
        <Card>
          <CardTitle>All zones</CardTitle>
          <ZonesTable zones={zones} selectedId={selectedId} onSelect={setSelectedId} />
        </Card>
      </section>

      <footer className="px-4 py-3 text-center text-xs text-slate-500">
        Demo data. Growth Velocity Score is an explainable weighted model — see SCORING_METHODOLOGY.md.
      </footer>
    </div>
  );
}
