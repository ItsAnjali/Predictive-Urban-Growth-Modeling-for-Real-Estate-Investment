export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;
export const fixed = (n: number, digits = 2) => n.toFixed(digits);

export const toneForScore = (s: number) =>
  s >= 70 ? 'high' : s >= 45 ? 'medium' : 'low';

export const colorForScore = (s: number) =>
  s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';
