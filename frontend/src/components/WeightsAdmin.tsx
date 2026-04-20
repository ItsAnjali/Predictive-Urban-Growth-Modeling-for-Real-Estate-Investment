import { useEffect, useState } from 'react';
import { useUpdateWeights, useWeights } from '../api/client';
import type { Weights } from '../types';

const LABELS: Record<keyof Weights, string> = {
  infra: 'Infrastructure',
  listing: 'Listing density',
  pricing: 'Price momentum',
  rental: 'Rental absorption',
  saturation: 'Oversupply risk (−)',
};

export const WeightsAdmin = ({ onClose }: { onClose: () => void }) => {
  const { data } = useWeights();
  const update = useUpdateWeights();
  const [draft, setDraft] = useState<Weights | null>(null);

  useEffect(() => { if (data && !draft) setDraft(data); }, [data, draft]);

  if (!draft) return null;

  const submit = async () => {
    await update.mutateAsync(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/60">
      <div className="w-[460px] rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-1 text-lg font-semibold text-white">Scoring weights</div>
        <div className="mb-4 text-xs text-slate-400">Changing weights re-scores every zone. Keep totals roughly near 1.0 for a balanced model.</div>
        <div className="space-y-3">
          {(Object.keys(LABELS) as (keyof Weights)[]).map((k) => (
            <label key={k} className="block">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{LABELS[k]}</span>
                <span className="text-slate-400">{draft[k].toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0} max={1} step={0.01}
                value={draft[k]}
                onChange={(e) => setDraft({ ...draft, [k]: Number(e.target.value) })}
                className="w-full"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border border-slate-700 px-3 py-1 text-sm text-slate-200">Cancel</button>
          <button onClick={submit} disabled={update.isPending} className="rounded bg-brand-600 px-3 py-1 text-sm text-white disabled:opacity-50">
            {update.isPending ? 'Saving…' : 'Save & rescore'}
          </button>
        </div>
      </div>
    </div>
  );
};
