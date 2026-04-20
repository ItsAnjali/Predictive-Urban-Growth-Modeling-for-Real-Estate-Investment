import { PrismaClient } from '@prisma/client';
import { DEFAULT_WEIGHTS } from '../src/config';
import { buildRanges, computeGVS } from '../src/services/scoring';

const prisma = new PrismaClient();

interface SeedZone {
  name: string;
  latitude: number;
  longitude: number;
  avgPricePerSqFt: number;
  priceGrowthPercent: number;
  rentalYieldPercent: number;
  rentalAbsorptionRate: number;
  listingDensity: number;
  infrastructureActivityScore: number;
  sentimentScore: number;
  oversupplyRisk: number;
  infra: {
    title: string;
    type: string;
    stage: string;
    impactScore: number;
    expectedCompletionDate?: string;
  }[];
}

const CITY = 'Bangalore';

const ZONES: SeedZone[] = [
  {
    name: 'Whitefield',
    latitude: 12.9698, longitude: 77.7500,
    avgPricePerSqFt: 8900, priceGrowthPercent: 6.8, rentalYieldPercent: 3.6,
    rentalAbsorptionRate: 0.82, listingDensity: 145, infrastructureActivityScore: 0.78,
    sentimentScore: 0.72, oversupplyRisk: 0.35,
    infra: [
      { title: 'Purple Line Metro Extension', type: 'metro', stage: 'under_construction', impactScore: 0.85, expectedCompletionDate: '2026-12-01' },
      { title: 'ITPL Tech Corridor Upgrade', type: 'it-park', stage: 'approved', impactScore: 0.7 },
    ],
  },
  {
    name: 'Devanahalli',
    latitude: 13.2519, longitude: 77.7214,
    avgPricePerSqFt: 5400, priceGrowthPercent: 14.2, rentalYieldPercent: 3.1,
    rentalAbsorptionRate: 0.58, listingDensity: 70, infrastructureActivityScore: 0.92,
    sentimentScore: 0.80, oversupplyRisk: 0.25,
    infra: [
      { title: 'Airport City Phase 2', type: 'airport', stage: 'under_construction', impactScore: 0.95, expectedCompletionDate: '2027-06-01' },
      { title: 'STRR Ring Road Link', type: 'highway', stage: 'under_construction', impactScore: 0.8 },
      { title: 'KIADB Aerospace Park', type: 'it-park', stage: 'approved', impactScore: 0.75 },
    ],
  },
  {
    name: 'Sarjapur',
    latitude: 12.8986, longitude: 77.6854,
    avgPricePerSqFt: 7200, priceGrowthPercent: 9.1, rentalYieldPercent: 3.9,
    rentalAbsorptionRate: 0.88, listingDensity: 190, infrastructureActivityScore: 0.65,
    sentimentScore: 0.70, oversupplyRisk: 0.40,
    infra: [
      { title: 'Sarjapur–Hebbal Metro (Phase 3)', type: 'metro', stage: 'approved', impactScore: 0.8 },
    ],
  },
  {
    name: 'Electronic City Phase 2',
    latitude: 12.8340, longitude: 77.6770,
    avgPricePerSqFt: 6200, priceGrowthPercent: 3.4, rentalYieldPercent: 3.4,
    rentalAbsorptionRate: 0.55, listingDensity: 240, infrastructureActivityScore: 0.50,
    sentimentScore: 0.45, oversupplyRisk: 0.78,
    infra: [
      { title: 'Yellow Line Metro', type: 'metro', stage: 'under_construction', impactScore: 0.75, expectedCompletionDate: '2026-03-01' },
    ],
  },
  {
    name: 'Hennur',
    latitude: 13.0450, longitude: 77.6450,
    avgPricePerSqFt: 5800, priceGrowthPercent: 11.6, rentalYieldPercent: 3.8,
    rentalAbsorptionRate: 0.72, listingDensity: 95, infrastructureActivityScore: 0.70,
    sentimentScore: 0.66, oversupplyRisk: 0.30,
    infra: [
      { title: 'Hennur–Airport Expressway', type: 'highway', stage: 'under_construction', impactScore: 0.75 },
    ],
  },
  {
    name: 'Koramangala',
    latitude: 12.9352, longitude: 77.6245,
    avgPricePerSqFt: 13500, priceGrowthPercent: 4.2, rentalYieldPercent: 3.1,
    rentalAbsorptionRate: 0.80, listingDensity: 160, infrastructureActivityScore: 0.35,
    sentimentScore: 0.78, oversupplyRisk: 0.20,
    infra: [
      { title: 'Koramangala Storm Water Upgrade', type: 'civic', stage: 'under_construction', impactScore: 0.4 },
    ],
  },
  {
    name: 'HSR Layout',
    latitude: 12.9116, longitude: 77.6473,
    avgPricePerSqFt: 11200, priceGrowthPercent: 5.6, rentalYieldPercent: 3.3,
    rentalAbsorptionRate: 0.85, listingDensity: 150, infrastructureActivityScore: 0.45,
    sentimentScore: 0.75, oversupplyRisk: 0.25,
    infra: [
      { title: 'HSR Outer Ring Road Flyover', type: 'highway', stage: 'approved', impactScore: 0.55 },
    ],
  },
  {
    name: 'Indiranagar',
    latitude: 12.9719, longitude: 77.6412,
    avgPricePerSqFt: 14800, priceGrowthPercent: 3.1, rentalYieldPercent: 2.9,
    rentalAbsorptionRate: 0.78, listingDensity: 120, infrastructureActivityScore: 0.30,
    sentimentScore: 0.70, oversupplyRisk: 0.22,
    infra: [],
  },
  {
    name: 'Hebbal',
    latitude: 13.0358, longitude: 77.5970,
    avgPricePerSqFt: 9400, priceGrowthPercent: 8.5, rentalYieldPercent: 3.5,
    rentalAbsorptionRate: 0.74, listingDensity: 130, infrastructureActivityScore: 0.82,
    sentimentScore: 0.74, oversupplyRisk: 0.33,
    infra: [
      { title: 'Hebbal Business District', type: 'it-park', stage: 'approved', impactScore: 0.8 },
      { title: 'Hebbal Flyover Expansion', type: 'highway', stage: 'under_construction', impactScore: 0.7 },
    ],
  },
  {
    name: 'Yelahanka',
    latitude: 13.1007, longitude: 77.5963,
    avgPricePerSqFt: 5600, priceGrowthPercent: 9.8, rentalYieldPercent: 3.4,
    rentalAbsorptionRate: 0.62, listingDensity: 85, infrastructureActivityScore: 0.72,
    sentimentScore: 0.65, oversupplyRisk: 0.38,
    infra: [
      { title: 'Yelahanka Airport Access Rail', type: 'metro', stage: 'approved', impactScore: 0.7 },
    ],
  },
  {
    name: 'Kengeri',
    latitude: 12.9081, longitude: 77.4830,
    avgPricePerSqFt: 4800, priceGrowthPercent: 5.2, rentalYieldPercent: 3.2,
    rentalAbsorptionRate: 0.48, listingDensity: 60, infrastructureActivityScore: 0.55,
    sentimentScore: 0.50, oversupplyRisk: 0.55,
    infra: [
      { title: 'Purple Line West Terminus', type: 'metro', stage: 'completed', impactScore: 0.6 },
    ],
  },
  {
    name: 'Bannerghatta',
    latitude: 12.8007, longitude: 77.5774,
    avgPricePerSqFt: 6400, priceGrowthPercent: 7.0, rentalYieldPercent: 3.3,
    rentalAbsorptionRate: 0.60, listingDensity: 80, infrastructureActivityScore: 0.60,
    sentimentScore: 0.58, oversupplyRisk: 0.45,
    infra: [
      { title: 'Bannerghatta Road Metro (Pink Line)', type: 'metro', stage: 'under_construction', impactScore: 0.7 },
    ],
  },
  {
    name: 'JP Nagar',
    latitude: 12.9082, longitude: 77.5855,
    avgPricePerSqFt: 9800, priceGrowthPercent: 4.6, rentalYieldPercent: 3.2,
    rentalAbsorptionRate: 0.76, listingDensity: 135, infrastructureActivityScore: 0.40,
    sentimentScore: 0.68, oversupplyRisk: 0.28,
    infra: [],
  },
  {
    name: 'Marathahalli',
    latitude: 12.9591, longitude: 77.6974,
    avgPricePerSqFt: 8700, priceGrowthPercent: 6.0, rentalYieldPercent: 3.7,
    rentalAbsorptionRate: 0.84, listingDensity: 175, infrastructureActivityScore: 0.50,
    sentimentScore: 0.72, oversupplyRisk: 0.42,
    infra: [
      { title: 'ORR Flyover Corridor', type: 'highway', stage: 'under_construction', impactScore: 0.55 },
    ],
  },
  {
    name: 'Bellandur',
    latitude: 12.9257, longitude: 77.6762,
    avgPricePerSqFt: 9100, priceGrowthPercent: 5.0, rentalYieldPercent: 3.6,
    rentalAbsorptionRate: 0.80, listingDensity: 200, infrastructureActivityScore: 0.55,
    sentimentScore: 0.64, oversupplyRisk: 0.60,
    infra: [
      { title: 'Bellandur Lake Rejuvenation', type: 'civic', stage: 'under_construction', impactScore: 0.45 },
    ],
  },
];

export const runSeed = async () => {
  await prisma.uploadJob.deleteMany();
  await prisma.infrastructureProject.deleteMany();
  await prisma.zone.deleteMany();

  await prisma.scoringWeights.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...DEFAULT_WEIGHTS },
  });

  const maxListing = Math.max(...ZONES.map((z) => z.listingDensity));

  for (const z of ZONES) {
    // derived demo fields: search interest tracks listing density,
    // under-construction usually appreciates faster than ready-to-move.
    const searchVolumeIndex = Math.min(1, z.listingDensity / maxListing * 0.6 + z.infrastructureActivityScore * 0.4);
    const underConstructionPriceGrowth = +(z.priceGrowthPercent * 1.2).toFixed(2);
    const readyToMovePriceGrowth = +(z.priceGrowthPercent * 0.7).toFixed(2);

    await prisma.zone.create({
      data: {
        name: z.name,
        city: CITY,
        latitude: z.latitude,
        longitude: z.longitude,
        avgPricePerSqFt: z.avgPricePerSqFt,
        priceGrowthPercent: z.priceGrowthPercent,
        rentalYieldPercent: z.rentalYieldPercent,
        rentalAbsorptionRate: z.rentalAbsorptionRate,
        listingDensity: z.listingDensity,
        infrastructureActivityScore: z.infrastructureActivityScore,
        sentimentScore: z.sentimentScore,
        oversupplyRisk: z.oversupplyRisk,
        searchVolumeIndex,
        readyToMovePriceGrowth,
        underConstructionPriceGrowth,
        infrastructureProjects: {
          create: z.infra.map((p) => ({
            title: p.title,
            type: p.type,
            stage: p.stage,
            impactScore: p.impactScore,
            expectedCompletionDate: p.expectedCompletionDate ? new Date(p.expectedCompletionDate) : null,
          })),
        },
      },
    });
  }

  const zones = await prisma.zone.findMany();
  const ranges = buildRanges(zones);
  for (const z of zones) {
    const r = computeGVS(z, DEFAULT_WEIGHTS, ranges);
    await prisma.zone.update({
      where: { id: z.id },
      data: { growthVelocityScore: r.score, opportunityLevel: r.opportunityLevel },
    });
  }

  return { zones: zones.length };
};

if (require.main === module) {
  runSeed()
    .then((r) => {
      console.log(`Seeded ${r.zones} zones.`);
      return prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
