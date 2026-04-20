import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateZone } from '../api/client';

interface FormValues {
  name: string; city: string; latitude: number; longitude: number;
  avgPricePerSqFt: number; priceGrowthPercent: number; rentalYieldPercent: number;
  rentalAbsorptionRate: number; listingDensity: number;
  infrastructureActivityScore: number; sentimentScore: number; oversupplyRisk: number;
}

export const AddZoneForm = ({ onClose }: { onClose: () => void }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      city: 'Bangalore',
      latitude: 12.97, longitude: 77.59,
      avgPricePerSqFt: 7000, priceGrowthPercent: 5, rentalYieldPercent: 3.3,
      rentalAbsorptionRate: 0.6, listingDensity: 100,
      infrastructureActivityScore: 0.5, sentimentScore: 0.5, oversupplyRisk: 0.3,
    },
  });
  const create = useCreateZone();
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: FormValues) => {
    setError(null);
    try {
      await create.mutateAsync(values);
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg) || e.message);
    }
  };

  const field = (name: keyof FormValues, label: string, type = 'number', step?: string) => (
    <label className="block text-xs text-slate-300">
      {label}
      <input
        {...register(name, { valueAsNumber: type === 'number' })}
        type={type}
        step={step}
        className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/60">
      <form onSubmit={handleSubmit(submit)} className="w-[560px] rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 text-lg font-semibold text-white">Add zone</div>
        <div className="grid grid-cols-2 gap-3">
          {field('name', 'Name', 'text')}
          {field('city', 'City', 'text')}
          {field('latitude', 'Latitude', 'number', '0.0001')}
          {field('longitude', 'Longitude', 'number', '0.0001')}
          {field('avgPricePerSqFt', 'Avg price/sqft')}
          {field('priceGrowthPercent', 'Price growth %')}
          {field('rentalYieldPercent', 'Rental yield %')}
          {field('rentalAbsorptionRate', 'Rental absorption (0-1)', 'number', '0.01')}
          {field('listingDensity', 'Listing density')}
          {field('infrastructureActivityScore', 'Infra activity (0-1)', 'number', '0.01')}
          {field('sentimentScore', 'Sentiment (0-1)', 'number', '0.01')}
          {field('oversupplyRisk', 'Oversupply risk (0-1)', 'number', '0.01')}
        </div>
        {error && <div className="mt-3 rounded bg-rose-500/15 border border-rose-600/40 p-2 text-xs text-rose-200">{error}</div>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-slate-700 px-3 py-1 text-sm text-slate-200">Cancel</button>
          <button disabled={isSubmitting} className="rounded bg-brand-600 px-3 py-1 text-sm text-white disabled:opacity-50">Create</button>
        </div>
      </form>
    </div>
  );
};
