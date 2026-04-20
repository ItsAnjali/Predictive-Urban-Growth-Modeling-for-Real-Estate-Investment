import { useMemo, useState } from 'react';
import type { Zone } from '../types';
import { Badge } from './ui/Badge';
import { inr, pct, toneForScore } from '../lib/format';

type SortKey = 'growthVelocityScore' | 'avgPricePerSqFt' | 'priceGrowthPercent' | 'rentalAbsorptionRate' | 'infrastructureActivityScore';

export const ZonesTable = ({ zones, onSelect, selectedId }: { zones: Zone[]; onSelect: (id: string) => void; selectedId?: string }) => {
  const [sort, setSort] = useState<SortKey>('growthVelocityScore');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');

  const rows = useMemo(() => {
    return [...zones].sort((a, b) => {
      const mul = dir === 'asc' ? 1 : -1;
      return (a[sort] - b[sort]) * mul;
    });
  }, [zones, sort, dir]);

  const toggle = (k: SortKey) => {
    if (sort === k) setDir(dir === 'asc' ? 'desc' : 'asc');
    else { setSort(k); setDir('desc'); }
  };

  const Th = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <th onClick={() => toggle(k)} className="cursor-pointer select-none px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-400 hover:text-slate-200">
      {children}{sort === k ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
    </th>
  );

  return (
    <div className="overflow-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-400">Zone</th>
            <Th k="growthVelocityScore">GVS</Th>
            <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-400">Opportunity</th>
            <Th k="avgPricePerSqFt">Avg ₹/sqft</Th>
            <Th k="priceGrowthPercent">Price Δ</Th>
            <Th k="rentalAbsorptionRate">Rental abs.</Th>
            <Th k="infrastructureActivityScore">Infra</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((z) => {
            const tone = toneForScore(z.growthVelocityScore) as 'high' | 'medium' | 'low';
            return (
              <tr
                key={z.id}
                onClick={() => onSelect(z.id)}
                className={`cursor-pointer border-t border-slate-800 hover:bg-slate-900/60 ${selectedId === z.id ? 'bg-slate-800/60' : ''}`}
              >
                <td className="px-3 py-2 font-medium text-slate-100">{z.name}</td>
                <td className="px-3 py-2 text-slate-200">{z.growthVelocityScore.toFixed(1)}</td>
                <td className="px-3 py-2"><Badge tone={tone}>{z.opportunityLevel}</Badge></td>
                <td className="px-3 py-2 text-slate-300">{inr(z.avgPricePerSqFt)}</td>
                <td className="px-3 py-2 text-slate-300">{pct(z.priceGrowthPercent)}</td>
                <td className="px-3 py-2 text-slate-300">{z.rentalAbsorptionRate.toFixed(2)}</td>
                <td className="px-3 py-2 text-slate-300">{z.infrastructureActivityScore.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
