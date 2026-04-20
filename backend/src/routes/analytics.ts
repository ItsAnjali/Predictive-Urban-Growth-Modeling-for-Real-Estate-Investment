import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/summary', async (_req, res) => {
  const zones = await prisma.zone.findMany();
  if (zones.length === 0) {
    return res.json({
      totalZones: 0,
      topGrowth: [],
      undervalued: [],
      topRental: [],
      risingPrice: [],
      opportunityDistribution: { high: 0, medium: 0, low: 0 },
      avgScore: 0,
    });
  }

  const byScore = [...zones].sort((a, b) => b.growthVelocityScore - a.growthVelocityScore);
  const prices = [...zones].map((z) => z.avgPricePerSqFt).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  // Undervalued = above-median yield/price ratio AND non-trivial GVS.
  const ratios = zones.map((z) => ({ z, r: z.rentalYieldPercent / z.avgPricePerSqFt }));
  const sortedR = [...ratios].map((x) => x.r).sort((a, b) => a - b);
  const medianRatio = sortedR[Math.floor(sortedR.length / 2)] || 0;
  const undervalued = ratios
    .filter(({ z, r }) => r > medianRatio && z.growthVelocityScore >= 55)
    .sort((a, b) => b.z.growthVelocityScore - a.z.growthVelocityScore)
    .slice(0, 5)
    .map((x) => x.z);
  const topRental = [...zones].sort((a, b) => b.rentalAbsorptionRate - a.rentalAbsorptionRate).slice(0, 5);
  const risingPrice = [...zones].sort((a, b) => b.priceGrowthPercent - a.priceGrowthPercent).slice(0, 5);

  const dist = { high: 0, medium: 0, low: 0 };
  zones.forEach((z) => {
    dist[(z.opportunityLevel as 'high' | 'medium' | 'low') || 'low']++;
  });

  const avgScore =
    zones.reduce((s, z) => s + z.growthVelocityScore, 0) / zones.length;

  res.json({
    totalZones: zones.length,
    topGrowth: byScore.slice(0, 5),
    undervalued,
    topRental,
    risingPrice,
    opportunityDistribution: dist,
    avgScore: Math.round(avgScore * 10) / 10,
    priceMedian: median,
  });
});

export default router;
