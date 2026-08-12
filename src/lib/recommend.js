// Content-based recommendation engine.
//
// The original prototype attached a fixed "match %" string to each car in the
// catalog — it never actually depended on what the customer told the app.
// This replaces that with a weighted scoring function over real attributes,
// so (a) the score reacts to what the customer actually picks, and (b) every
// score comes with a breakdown you can show as "why this match" instead of a
// number nobody can explain.
//
// Design, in one paragraph (worth restating in an interview): each car gets
// five 0-1 sub-scores (budget fit, mileage fit, comfort fit, features fit,
// performance fit). Sub-scores are combined with priority-dependent weights
// (see PRIORITIES in data/cars.js) into a weighted average, then two gating
// multipliers (fuel type match, seat count vs. family size) pull the score
// down for hard mismatches without zeroing them out completely — a car that's
// 1 seat short of a family's need is a worse match, not an impossible one.

import { BUDGET_RANGES, USAGE_TYPES, PRIORITIES } from '../data/cars';

const clip01 = (n) => Math.max(0, Math.min(1, n));

const MILEAGE_MIN = 16.4;
const MILEAGE_MAX = 24.9;

function budgetFit(price, budgetMax) {
  if (price <= budgetMax) {
    // Using more of the stated budget is treated as a (mild) plus — a
    // ₹5L hatchback isn't a "better" match for a ₹15L budget just because
    // it's cheaper, but it isn't penalized either.
    return 0.55 + 0.45 * (price / budgetMax);
  }
  const overBy = (price - budgetMax) / budgetMax;
  return Math.max(0, 0.55 - overBy);
}

function mileageFit(mileageKmpl, usageWeight) {
  const norm = (mileageKmpl - MILEAGE_MIN) / (MILEAGE_MAX - MILEAGE_MIN);
  return clip01(norm * usageWeight);
}

function performanceFit(performance1to5, usageWeight) {
  const norm = (performance1to5 - 1) / 4;
  return clip01(norm * usageWeight);
}

const scale1to5 = (v) => clip01((v - 1) / 4);

/**
 * @param {object} car - entry from MARUTI_CARS
 * @param {object} prefs - { budgetKey, usage, fuelPref, familySize, priority }
 * @returns {{ score: number, breakdown: {label:string, value:number, weight:number}[], overBudget: boolean }}
 */
export function scoreCar(car, prefs) {
  const { budgetKey, usage = 'mixed', fuelPref = 'any', familySize = 4, priority = 'economy' } = prefs;

  const budgetMax = BUDGET_RANGES[budgetKey]?.max ?? Infinity;
  const usageWeights = USAGE_TYPES[usage]?.favors ?? USAGE_TYPES.mixed.favors;
  const weights = PRIORITIES[priority]?.weights ?? PRIORITIES.economy.weights;

  const bFit = budgetFit(car.price, budgetMax === Infinity ? car.price : budgetMax);
  const mFit = mileageFit(car.mileageKmpl, usageWeights.mileageWeight);
  const pFit = performanceFit(car.performance, usageWeights.performanceWeight);
  const cFit = scale1to5(car.comfort);
  const fFit = scale1to5(car.features);

  const sumWeights = weights.budget + weights.mileage + weights.comfort + weights.features + weights.performance;
  const weightedAvg = (
    weights.budget * bFit +
    weights.mileage * mFit +
    weights.comfort * cFit +
    weights.features * fFit +
    weights.performance * pFit
  ) / sumWeights;

  // Gating multipliers: hard-ish requirements, softened so a near-miss
  // doesn't collapse the whole score to zero.
  const fuelGate = fuelPref === 'any' || car.fuelType === fuelPref ? 1 : 0.55;
  const seatGate = car.seats >= familySize ? 1 : Math.max(0.4, car.seats / familySize);

  const rawScore = weightedAvg * (0.6 + 0.4 * fuelGate) * (0.6 + 0.4 * seatGate);

  // Cap below 100 — no recommendation engine should claim a "perfect" match;
  // that overclaim is exactly what the deck's own "bias in recommendations"
  // pitfall calls out.
  const score = Math.round(Math.min(97, Math.max(3, rawScore * 100)));

  const breakdown = [
    { label: 'Budget fit', value: Math.round(bFit * 100), weight: weights.budget },
    { label: 'Mileage / running cost', value: Math.round(mFit * 100), weight: weights.mileage },
    { label: 'Comfort & space', value: Math.round(cFit * 100), weight: weights.comfort },
    { label: 'Features', value: Math.round(fFit * 100), weight: weights.features },
    { label: 'Performance', value: Math.round(pFit * 100), weight: weights.performance },
  ].sort((a, b) => b.weight * b.value - a.weight * a.value);

  return { score, breakdown, overBudget: budgetMax !== Infinity && car.price > budgetMax };
}

/** Ranks the full catalog for the given preferences, best match first. */
export function rankCars(cars, prefs) {
  return cars
    .map((car) => ({ car, ...scoreCar(car, prefs) }))
    .sort((a, b) => b.score - a.score);
}
