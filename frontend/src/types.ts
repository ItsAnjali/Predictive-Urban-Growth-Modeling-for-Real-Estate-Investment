export interface Zone {
  id: string;
  name: string;
  city: string;
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
  searchVolumeIndex: number;
  readyToMovePriceGrowth: number;
  underConstructionPriceGrowth: number;
  growthVelocityScore: number;
  opportunityLevel: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface InfraProject {
  id: string;
  zoneId: string;
  title: string;
  type: string;
  stage: string;
  impactScore: number;
  expectedCompletionDate?: string | null;
}

export interface ScoreResult {
  score: number;
  opportunityLevel: 'low' | 'medium' | 'high';
  breakdown: {
    infra: number; listing: number; pricing: number; rental: number; saturation: number;
  };
  normalized: {
    infra: number; listing: number; pricing: number; rental: number; saturation: number;
  };
  explanation: string;
}

export interface ZoneDetail extends Zone {
  infrastructureProjects: InfraProject[];
  scoring: ScoreResult;
}

export interface Weights {
  infra: number; listing: number; pricing: number; rental: number; saturation: number;
}

export interface AnalyticsSummary {
  totalZones: number;
  topGrowth: Zone[];
  undervalued: Zone[];
  topRental: Zone[];
  risingPrice: Zone[];
  opportunityDistribution: { high: number; medium: number; low: number };
  avgScore: number;
  priceMedian?: number;
}

export type FilterKey = 'all' | 'high' | 'rental' | 'infra' | 'undervalued';
