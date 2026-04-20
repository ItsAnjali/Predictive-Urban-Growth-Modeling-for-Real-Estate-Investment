# Growth Velocity Score — Methodology

> **Disclaimer.** This is an **explainable heuristic**, not a forecast. It is designed to surface plausible high-opportunity zones for further human due diligence. It does not claim predictive certainty.

## 1. Formula

```
GVS_raw =
    w_infra      * infra_norm
  + w_listing    * listing_norm
  + w_pricing    * pricing_norm
  + w_rental     * rental_norm
  - w_saturation * oversupply_norm
```

The raw value is rescaled to `[0, 100]` using:

```
GVS = clamp01((GVS_raw + w_saturation) / (w_infra + w_listing + w_pricing + w_rental + w_saturation)) * 100
```

The opportunity bucket:

| Score    | Bucket   |
|----------|----------|
| ≥ 70     | **High** |
| 45 – 69  | Medium   |
| < 45     | Low      |

## 2. Default weights

| Factor                        | Weight |
|-------------------------------|--------|
| `w_infra` — infrastructure     | 0.30   |
| `w_pricing` — price momentum   | 0.25   |
| `w_rental` — rental absorption | 0.20   |
| `w_listing` — listing density  | 0.15   |
| `w_saturation` — oversupply    | 0.10 (negative contribution) |

Weights are stored in the `ScoringWeights` table and editable via `PATCH /api/config/weights` or the UI admin panel. Any change triggers a full rescore.

## 3. Metric definitions

- **infrastructureActivityScore (0–1):** composite of metro, highway, airport, IT-park, and civic projects weighted by stage (announced < approved < under_construction < completed) and impact.
- **listingDensity:** raw count of active listings per sq km. Min–max normalized across all zones in the dataset — this makes the score sensitive to *relative* activity.
- **priceGrowthPercent:** YoY % change in average ₹/sqft. Min–max normalized across the city.
- **rentalAbsorptionRate (0–1):** fraction of rental inventory absorbed within a 90-day window.
- **oversupplyRisk (0–1):** ratio of unsold inventory to trailing 12-month absorption. High values suppress the score.
- **sentimentScore (0–1, optional):** social/search/forum sentiment aggregate. Currently carried for display only; not in the GVS formula.

All inputs in `[0, 1]` are clamped defensively. `listingDensity` and `priceGrowthPercent` are min-max normalized against the current dataset.

## 4. Why explainability

A black-box real-estate score is impossible to sell to investors or municipal partners. We therefore:

1. Store per-zone **normalized values** *and* **weighted contributions** so the UI can render a transparent breakdown bar.
2. Generate a **templated natural-language explanation** from the top positive and negative contributors, e.g. *"Devanahalli is driven by strong infrastructure pipeline and healthy price momentum, partially offset by modest oversupply risk."*
3. Make weights editable by admins so hypotheses (e.g. "infra matters 2x more in Tier-1 cities") are explicit.

## 5. What a production model would need

- **Real, time-series data:** listing/price snapshots from MagicBricks/99acres/Housing, rental absorption from broker CRMs, and municipal project feeds from BBMP/BDA/BMRCL.
- **Spatial features:** H3 / geohash aggregation, drive-time isochrones to IT parks, schools, metros.
- **Temporal lag modelling:** announcement → groundbreaking → completion lag distributions.
- **Supervised backtest:** hold out appreciation observed in the next 24–60 months, compare against ranks produced by the heuristic.
- **Spatial autocorrelation:** Moran's I / Getis-Ord to separate local signal from neighborhood spillover.
- **Stacked model:** retain the heuristic as a prior; stack with a gradient-boosted model and SHAP for per-zone attributions.
- **Monitoring:** drift detection on inputs (listing volumes, sentiment feeds) and a human-in-the-loop override.

Until that infrastructure exists, an **explainable scoring heuristic with configurable weights** is honest about its limits and still useful as a prioritization tool.
