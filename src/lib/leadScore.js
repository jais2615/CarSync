// Dealer-side lead scoring.
//
// v1 of this prototype added fixed point values for a few actions with no
// concept of time — a customer who browsed once last month scored identically
// to one who's active right now. Real sales-CRM lead scores decay: a lead
// that's gone quiet is worth less than a fresh one even if the historical
// actions are the same. This adds that decay explicitly, and keeps every
// point explainable (per the deck's own "over-reliance on intent score"
// mitigation — this is a priority signal for a human, not an auto-filter).

const HALF_LIFE_HOURS = 72; // score halves every 3 days of inactivity

function decayFactor(hoursSinceLastActivity) {
  return Math.pow(0.5, hoursSinceLastActivity / HALF_LIFE_HOURS);
}

/**
 * @param {object} journey - shape from CustomerJourneyContext
 * @param {number} extraIdleHours - demo-only knob to simulate time passing
 */
export function scoreLead(journey, extraIdleHours = 0) {
  const { customerName, siteVisits, configuratorMinutes, selectedCar, testDrive, budget, lastActivityAt } = journey;

  if (!customerName) {
    return { score: 0, label: 'NO DATA', breakdown: [], hoursIdle: 0, decay: 1 };
  }

  const factors = [
    { label: 'Registered on CarSync', points: 10, active: true },
    { label: 'App engagement', points: Math.min(siteVisits * 5, 20), active: siteVisits > 0, detail: `${siteVisits} session${siteVisits === 1 ? '' : 's'}` },
    { label: 'Configurator / research time', points: Math.min(Math.round(configuratorMinutes * 1.5), 15), active: configuratorMinutes > 0, detail: `${configuratorMinutes} min` },
    { label: 'Shortlisted a vehicle', points: selectedCar ? 20 : 0, active: Boolean(selectedCar), detail: selectedCar?.name },
    { label: 'High budget tier', points: budget === 'over-20lakh' || budget === '15lakh-20lakh' ? 5 : 0, active: budget === 'over-20lakh' || budget === '15lakh-20lakh' },
    { label: 'Test drive booked', points: testDrive ? 30 : 0, active: Boolean(testDrive) },
  ];

  const rawScore = factors.reduce((sum, f) => sum + f.points, 0);

  const hoursIdle = lastActivityAt
    ? (Date.now() - lastActivityAt) / (1000 * 60 * 60) + extraIdleHours
    : extraIdleHours;
  const decay = decayFactor(hoursIdle);

  const score = Math.max(1, Math.min(98, Math.round(rawScore * decay)));
  const label = score >= 70 ? 'HOT LEAD' : score >= 40 ? 'WARM LEAD' : 'NEW LEAD';

  return {
    score,
    label,
    breakdown: factors.filter((f) => f.active),
    rawScore,
    hoursIdle,
    decay,
  };
}
