import { prisma } from '../db';
import { DEFAULT_WEIGHTS, Weights } from '../config';
import { buildRanges, computeGVS } from './scoring';

export const getWeights = async (): Promise<Weights> => {
  const row = await prisma.scoringWeights.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...DEFAULT_WEIGHTS },
  });
  return {
    infra: row.infra,
    listing: row.listing,
    pricing: row.pricing,
    rental: row.rental,
    saturation: row.saturation,
  };
};

export const rescoreAllZones = async (): Promise<void> => {
  const zones = await prisma.zone.findMany();
  if (zones.length === 0) return;
  const weights = await getWeights();
  const ranges = buildRanges(zones);

  await prisma.$transaction(
    zones.map((z) => {
      const r = computeGVS(z, weights, ranges);
      return prisma.zone.update({
        where: { id: z.id },
        data: { growthVelocityScore: r.score, opportunityLevel: r.opportunityLevel },
      });
    }),
  );
};
