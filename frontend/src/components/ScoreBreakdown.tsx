import type { ScoreResult } from '../types';

const LABELS: Record<keyof ScoreResult['breakdown'], string> = {
  infra: 'Infrastructure',
  listing: 'Listing density',
  pricing: 'Price momentum',
  rental: 'Rental absorption',
  saturation: 'Oversupply risk',
};

export const ScoreBreakdown = ({ scoring }: { scoring: ScoreResult }) => {
  const entries = (Object.keys(LABELS) as (keyof ScoreResult['breakdown'])[]).map((k) => ({
    key: k,
    contribution: scoring.breakdown[k],
    normalized: scoring.normalized[k],
  }));
  const absMax = Math.max(...entries.map((e) => Math.abs(e.contribution)), 0.01);

  return (
    <div className="space-y-2">
      {entries.map((e) => {
        const pct = (Math.abs(e.contribution) / absMax) * 100;
        const positive = e.contribution >= 0;
        return (
          <div key={e.key} className="text-xs">
            <div className="flex justify-between text-slate-300">
              <span>{LABELS[e.key]}</span>
              <span className="text-slate-400">
                norm {e.normalized.toFixed(2)} · {positive ? '+' : ''}{(e.contribution * 100).toFixed(1)}
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded bg-slate-800">
              <div
                className={`h-full ${positive ? 'bg-emerald-500/70' : 'bg-rose-500/70'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
