import { PropsWithChildren } from 'react';

const TONE = {
  high: 'bg-emerald-500/15 text-emerald-300 border-emerald-600/40',
  medium: 'bg-amber-500/15 text-amber-300 border-amber-600/40',
  low: 'bg-rose-500/15 text-rose-300 border-rose-600/40',
  neutral: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
};

export const Badge = ({ tone = 'neutral', children }: PropsWithChildren<{ tone?: keyof typeof TONE }>) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${TONE[tone]}`}>
    {children}
  </span>
);
