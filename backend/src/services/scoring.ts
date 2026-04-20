import { Zone } from '@prisma/client';
import { Weights } from '../config';
import { clamp01, minMax } from './normalization';

export interface Breakdown {
  infra: number;
  listing: number;
  pricing: number;
  rental: number;
  saturation: number; // negative contribution (already signed)
}

export interface ScoreResult {
  score: number; // 0..100
  opportunityLevel: 'low' | 'medium' | 'high';
  breakdown: Breakdown;
  normalized: {
    infra: number;
    listing: number;
    pricing: number;
    rental: number;
    saturation: number;
  };
  explanation: string;
}

export interface ScoringRanges {
  listingDensity: { min: number; max: number };
  priceGrowthPercent: { min: number; max: number };
}

export const buildRanges = (zones: Pick<Zone, 'listingDensity' | 'priceGrowthPercent'>[]): ScoringRanges => {
  const lds = zones.map((z) => z.listingDensity);
  const pgs = zones.map((z) => z.priceGrowthPercent);
  return {
    listingDensity: { min: Math.min(...lds), max: Math.max(...lds) },
    priceGrowthPercent: { min: Math.min(...pgs), max: Math.max(...pgs) },
  };
};

export const computeGVS = (zone: Zone, weights: Weights, ranges: ScoringRanges): ScoreResult => {
  const nInfra = clamp01(zone.infrastructureActivityScore);
  const nListing = minMax(zone.listingDensity, ranges.listingDensity.min, ranges.listingDensity.max);
  const nPricing = minMax(zone.priceGrowthPercent, ranges.priceGrowthPercent.min, ranges.priceGrowthPercent.max);
  const nRental = clamp01(zone.rentalAbsorptionRate);
  const nSaturation = clamp01(zone.oversupplyRisk);

  const breakdown: Breakdown = {
    infra: weights.infra * nInfra,
    listing: weights.listing * nListing,
    pricing: weights.pricing * nPricing,
    rental: weights.rental * nRental,
    saturation: -(weights.saturation * nSaturation),
  };

  const raw =
    breakdown.infra + breakdown.listing + breakdown.pricing + breakdown.rental + breakdown.saturation;

  // raw is in roughly [-saturationWeight, sum of positive weights]; rescale to 0..100
  const positiveMax = weights.infra + weights.listing + weights.pricing + weights.rental;
  const negativeMax = weights.saturation;
  const score = clamp01((raw + negativeMax) / (positiveMax + negativeMax)) * 100;

  const opportunityLevel: ScoreResult['opportunityLevel'] =
    score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low';

  const explanation = buildExplanation(zone.name, breakdown, {
    infra: nInfra,
    listing: nListing,
    pricing: nPricing,
    rental: nRental,
    saturation: nSaturation,
  });

  return {
    score: Math.round(score * 10) / 10,
    opportunityLevel,
    breakdown,
    normalized: {
      infra: round(nInfra),
      listing: round(nListing),
      pricing: round(nPricing),
      rental: round(nRental),
      saturation: round(nSaturation),
    },
    explanation,
  };
};

const round = (v: number) => Math.round(v * 100) / 100;

const LABELS: Record<keyof Breakdown, string> = {
  infra: 'infrastructure pipeline',
  listing: 'listing density',
  pricing: 'price momentum',
  rental: 'rental absorption',
  saturation: 'oversupply risk',
};

const strengthWord = (n: number) =>
  n >= 0.75 ? 'strong' : n >= 0.5 ? 'healthy' : n >= 0.25 ? 'modest' : 'weak';

const buildExplanation = (
  name: string,
  breakdown: Breakdown,
  normalized: Record<keyof Breakdown, number>,
): string => {
  const entries = (Object.keys(breakdown) as (keyof Breakdown)[]).map((k) => ({
    key: k,
    contribution: breakdown[k],
    normalized: normalized[k],
  }));

  const positives = entries.filter((e) => e.contribution > 0).sort((a, b) => b.contribution - a.contribution);
  const negatives = entries.filter((e) => e.contribution < 0).sort((a, b) => a.contribution - b.contribution);

  const top = positives.slice(0, 2).map((e) => `${strengthWord(e.normalized)} ${LABELS[e.key]}`);
  const drag = negatives.slice(0, 1).map((e) => `${strengthWord(e.normalized)} ${LABELS[e.key]}`);

  const head = top.length
    ? `${name} is driven by ${top.join(' and ')}`
    : `${name} shows limited positive drivers`;
  const tail = drag.length ? `, partially offset by ${drag.join(' and ')}.` : '.';
  return head + tail;
};
