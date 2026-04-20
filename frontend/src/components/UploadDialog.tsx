import { useState } from 'react';
import { useUploadZones } from '../api/client';

export const UploadDialog = ({ onClose }: { onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const upload = useUploadZones();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!file) return;
    setError(null);
    try {
      const r = await upload.mutateAsync(file);
      setResult(r);
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg) || e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/60">
      <div className="w-[480px] rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-2 text-lg font-semibold text-white">Upload zone data</div>
        <div className="mb-4 text-xs text-slate-400">CSV or JSON matching the zone schema. Existing zones with the same name+city are updated.</div>
        <input
          type="file"
          accept=".csv,.json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-brand-600 file:px-3 file:py-1 file:text-white"
        />
        {error && <div className="mt-4 rounded bg-rose-500/15 border border-rose-600/40 p-2 text-xs text-rose-200">{error}</div>}
        {result && (
          <div className="mt-4 rounded bg-slate-800 p-3 text-xs text-slate-300">
            <div>Inserted: {result.inserted}</div>
            {result.errors?.length > 0 && (
              <div className="text-rose-400 mt-1">
                <div>Errors in {result.errors.length} row(s):</div>
                <ul className="mt-1 max-h-40 overflow-auto pl-4">
                  {result.errors.slice(0, 10).map((err: any, i: number) => (
                    <li key={i} className="list-disc">row {err.row}: {err.error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-1 text-slate-500">Job status: {result.job?.status}</div>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border border-slate-700 px-3 py-1 text-sm text-slate-200">Close</button>
          <button
            onClick={submit}
            disabled={!file || upload.isPending}
            className="rounded bg-brand-600 px-3 py-1 text-sm text-white disabled:opacity-50"
          >
            {upload.isPending ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};
