import { useState } from 'react';
import { useSeed } from '../api/client';
import type { FilterKey } from '../types';
import { UploadDialog } from './UploadDialog';
import { WeightsAdmin } from './WeightsAdmin';
import { AddZoneForm } from './AddZoneForm';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All zones' },
  { key: 'high', label: 'High growth' },
  { key: 'rental', label: 'Rental-heavy' },
  { key: 'infra', label: 'Infra-heavy' },
  { key: 'undervalued', label: 'Undervalued' },
];

interface Props {
  filter: FilterKey;
  setFilter: (f: FilterKey) => void;
}

export const TopBar = ({ filter, setFilter }: Props) => {
  const [showUpload, setShowUpload] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const seed = useSeed();

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3">
      <div>
        <div className="text-lg font-semibold text-white">Urban Growth Model</div>
        <div className="text-xs text-slate-400">Bangalore · demo data</div>
      </div>

      <div className="ml-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              filter === f.key
                ? 'border-brand-500 bg-brand-500/20 text-brand-50'
                : 'border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex gap-2">
        <button onClick={() => setShowAdd(true)} className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800">
          + Add zone
        </button>
        <button onClick={() => setShowUpload(true)} className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800">
          Upload CSV/JSON
        </button>
        <button onClick={() => setShowAdmin(true)} className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800">
          Weights
        </button>
        <button
          onClick={() => seed.mutate()}
          disabled={seed.isPending}
          className="rounded bg-brand-600 px-3 py-1 text-xs text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {seed.isPending ? 'Seeding…' : 'Reseed'}
        </button>
      </div>

      {showUpload && <UploadDialog onClose={() => setShowUpload(false)} />}
      {showAdmin && <WeightsAdmin onClose={() => setShowAdmin(false)} />}
      {showAdd && <AddZoneForm onClose={() => setShowAdd(false)} />}
    </header>
  );
};
