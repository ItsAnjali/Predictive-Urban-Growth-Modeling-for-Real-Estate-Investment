import { z } from 'zod';

export const zoneInputSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  avgPricePerSqFt: z.coerce.number().nonnegative(),
  priceGrowthPercent: z.coerce.number(),
  rentalYieldPercent: z.coerce.number().nonnegative(),
  rentalAbsorptionRate: z.coerce.number().min(0).max(1),
  listingDensity: z.coerce.number().nonnegative(),
  infrastructureActivityScore: z.coerce.number().min(0).max(1),
  sentimentScore: z.coerce.number().min(0).max(1).optional().default(0.5),
  oversupplyRisk: z.coerce.number().min(0).max(1),
  searchVolumeIndex: z.coerce.number().min(0).max(1).optional().default(0),
  readyToMovePriceGrowth: z.coerce.number().optional().default(0),
  underConstructionPriceGrowth: z.coerce.number().optional().default(0),
});

export type ZoneInput = z.infer<typeof zoneInputSchema>;

export const zoneUpdateSchema = zoneInputSchema.partial();

export const weightsSchema = z.object({
  infra: z.coerce.number().min(0).max(1),
  listing: z.coerce.number().min(0).max(1),
  pricing: z.coerce.number().min(0).max(1),
  rental: z.coerce.number().min(0).max(1),
  saturation: z.coerce.number().min(0).max(1),
});
