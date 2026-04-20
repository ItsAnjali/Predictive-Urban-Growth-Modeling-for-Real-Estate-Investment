export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const minMax = (value: number, min: number, max: number): number => {
  if (max === min) return 0.5;
  return clamp01((value - min) / (max - min));
};

export const computeRanges = <T,>(items: T[], keys: (keyof T)[]) => {
  const ranges: Record<string, { min: number; max: number }> = {};
  for (const k of keys) {
    const vals = items.map((i) => Number((i as any)[k]) || 0);
    ranges[k as string] = { min: Math.min(...vals), max: Math.max(...vals) };
  }
  return ranges;
};
