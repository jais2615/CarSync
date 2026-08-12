import React, { useState, useEffect } from 'react';
import { ChevronRight, Calendar, Info, Zap, ShieldCheck, DollarSign, Wrench, SlidersHorizontal, CheckCircle2, MapPin, Users, Fuel, Lock, Unlock } from 'lucide-react';
import { useCustomerJourney } from '../store/CustomerJourneyContext';
import { MARUTI_CARS, BUDGET_RANGES, USAGE_TYPES, FUEL_PREFS, PRIORITIES } from '../data/cars';
import { rankCars, scoreCar } from '../lib/recommend';
import { Gauge } from './Gauge';

const DEALERS = [
  "Maruti Suzuki Arena, Connaught Place, New Delhi",
  "NEXA, Lower Parel, Mumbai",
  "Maruti Suzuki Arena, MG Road, Bengaluru",
  "NEXA, Jubilee Hills, Hyderabad"
];

const formatINR = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);

function BreakdownBars({ breakdown, max = 3 }) {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      {breakdown.slice(0, max).map((f) => (
        <div className="breakdown-row" key={f.label}>
          <span className="breakdown-label">{f.label}</span>
          <span className="breakdown-track"><span className="breakdown-fill" style={{ width: `${f.value}%` }} /></span>
          <span className="breakdown-value">{f.value}%</span>
        </div>
      ))}
    </div>
  );
}

export function CustomerDashboard() {
  const { journey, updateJourney, trackVisit, trackConfiguratorTime, setPrivacyConsent } = useCustomerJourney();
  const { budget, usage, fuelPref, familySize, priority, selectedCar, privacyConsent } = journey;
  const [bookingState, setBookingState] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '', dealer: DEALERS[0] });

  // One "visit" per mount — a real deployment would call this from a router
  // effect / analytics event, not the component itself.
  useEffect(() => { trackVisit(); }, [trackVisit]);

  const prefs = { budgetKey: budget, usage, fuelPref, familySize, priority };
  const personalizationOn = privacyConsent === true;

  // If the person has declined personalization, the app can't ethically use
  // their behavior to rank cars for them — it falls back to the plain
  // catalog instead of a "personalized" list, which is the actual point of
  // an opt-in (not just a checkbox that does nothing).
  const ranked = personalizationOn
    ? rankCars(MARUTI_CARS, prefs)
    : MARUTI_CARS.map((car) => ({ car, score: null, breakdown: [], overBudget: false }));

  const topMatches = ranked.slice(0, 6);

  const handlePrefChange = (updates) => {
    updateJourney(updates);
    trackConfiguratorTime(1);
  };

  const handleSelectCar = (car) => {
    updateJourney({ selectedCar: car });
    setBookingState(null);
  };

  const handleBookTestDrive = (e) => {
    e.preventDefault();
    if (bookingDetails.date && bookingDetails.time) {
      setBookingState('booked');
      updateJourney({ testDrive: { ...bookingDetails } });
    }
  };

  const selectedScore = selectedCar ? scoreCar(selectedCar, prefs) : null;

  const priceScale = selectedCar ? selectedCar.price / 800000 : 1;
  const insuranceMonthly = selectedCar ? Math.round((3500 * priceScale) / 100) * 100 : 0;
  const fuelMonthly = selectedCar ? Math.round((5500 * Math.sqrt(priceScale)) / 100) * 100 : 0;
  const maintenanceMonthly = selectedCar ? Math.round((1500 * priceScale) / 100) * 100 : 0;
  const extraMonthlyCost = insuranceMonthly + fuelMonthly + maintenanceMonthly;

  return (
    <div className="dashboard-content animate-fade-in">

      {/* Privacy opt-in — functional, not decorative: it actually gates whether
          the recommendation engine personalizes. Addresses the deck's own
          "privacy concerns" pitfall with a real control instead of a promise. */}
      {privacyConsent === null ? (
        <div className="privacy-banner">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-accent-primary" />
            <div>
              <p style={{ fontWeight: 600 }}>Personalize my recommendations?</p>
              <p className="text-text-secondary text-sm">CarSync will use your budget, usage and preferences to rank vehicles. You can change this anytime.</p>
            </div>
          </div>
          <div className="flex gap-2" style={{ flexShrink: 0 }}>
            <button className="btn-outline" onClick={() => setPrivacyConsent(false)}>Not now</button>
            <button className="btn-primary" onClick={() => setPrivacyConsent(true)}>Enable</button>
          </div>
        </div>
      ) : (
        <div className="privacy-banner">
          <div className="flex items-center gap-3">
            {personalizationOn ? <Unlock size={18} className="text-success" /> : <Lock size={18} className="text-text-muted" />}
            <span className="text-sm text-text-secondary">
              Personalization is <strong style={{ color: 'var(--text-primary)' }}>{personalizationOn ? 'on' : 'off'}</strong> — {personalizationOn ? 'recommendations are ranked for you.' : 'showing the default catalog.'}
            </span>
          </div>
          <button className="btn-outline text-sm" style={{ padding: '0.4rem 0.9rem' }} onClick={() => setPrivacyConsent(!personalizationOn)}>
            Turn {personalizationOn ? 'off' : 'on'}
          </button>
        </div>
      )}

      {/* Preference form — this is the actual input to the recommendation
          engine now, not decoration next to a hardcoded list. */}
      <section className="dashboard-section bg-bg-tertiary p-4 rounded-xl border border-border-color" style={{ padding: '1.25rem' }}>
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={20} className="text-accent-secondary" />
          <span className="font-semibold text-white">Your Vehicle Preferences</span>
        </div>

        <div className="grid-3" style={{ gap: '1rem' }}>
          <div>
            <label className="field-label">Target budget</label>
            <select className="select-input" value={budget} onChange={(e) => handlePrefChange({ budget: e.target.value })}>
              {Object.entries(BUDGET_RANGES).map(([key, r]) => <option key={key} value={key}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Family size (seats needed)</label>
            <select className="select-input" value={familySize} onChange={(e) => handlePrefChange({ familySize: Number(e.target.value) })}>
              {[2, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} people</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Fuel preference</label>
            <div className="pill-toggle-group">
              {FUEL_PREFS.map((f) => (
                <button key={f} className={`pill-toggle ${fuelPref === f ? 'active' : ''}`} onClick={() => handlePrefChange({ fuelPref: f })}>
                  {f === 'any' ? 'Any' : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid-2 mt-4" style={{ gap: '1rem' }}>
          <div>
            <label className="field-label">Mostly driving...</label>
            <div className="pill-toggle-group">
              {Object.entries(USAGE_TYPES).map(([key, u]) => (
                <button key={key} className={`pill-toggle ${usage === key ? 'active' : ''}`} onClick={() => handlePrefChange({ usage: key })}>{u.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">What matters most?</label>
            <div className="pill-toggle-group">
              {Object.entries(PRIORITIES).map(([key, p]) => (
                <button key={key} className={`pill-toggle ${priority === key ? 'active' : ''}`} onClick={() => handlePrefChange({ priority: key })}>{p.label}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="dashboard-section">
        <h3 className="section-title"><Zap size={24} className="text-accent-primary" /> Maruti Suzuki Recommendations</h3>
        <p className="text-text-secondary text-sm mb-4">
          {personalizationOn ? 'Ranked by fit to your preferences above — tap a card to see why.' : 'Personalization is off, so this is the plain catalog. Enable it above for a ranked, explainable match.'}
        </p>

        <div className="grid-3">
          {topMatches.map(({ car, score, breakdown, overBudget }) => {
            const isSelected = selectedCar?.id === car.id;
            return (
              <div
                key={car.id}
                className="car-card glass-panel cursor-pointer transition relative overflow-hidden"
                style={{
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  boxShadow: isSelected ? '0 12px 24px var(--accent-glow)' : 'none'
                }}
                onClick={() => handleSelectCar(car)}
              >
                <div className="card-image-bg relative">
                  <img src={car.img} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-accent-primary text-black rounded-full p-1 animate-fade-in shadow-lg">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                  {score !== null && (
                    <div className="absolute top-3 left-3 badge font-mono" style={{ background: 'rgba(16,17,19,0.8)', color: 'var(--accent-primary)', border: '1px solid var(--border-light)' }}>
                      {score}% match
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg">{car.name}</h4>
                    <span className="text-accent-primary font-bold text-lg font-mono">{car.priceStr}</span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    {car.tags.slice(0, 3).map((t) => <span key={t} className="tag-chip">{t}</span>)}
                  </div>
                  {overBudget && <p style={{ color: 'var(--warning)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Above your target budget</p>}
                  {breakdown.length > 0 && <BreakdownBars breakdown={breakdown} max={2} />}
                  <div className="flex gap-2 mt-4">
                    <button className={isSelected ? 'btn-primary flex-1 py-2' : 'btn-outline flex-1 py-2'}>
                      {isSelected ? 'Selected' : 'Select Vehicle'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedCar && (
        <div className="animate-fade-in">
          {/* Why this match — full breakdown, not a single unexplained number */}
          {personalizationOn && selectedScore && (
            <section className="dashboard-section mt-4">
              <h3 className="section-title"><Info size={24} style={{ color: 'var(--data-accent)' }} /> Why this match: {selectedCar.name}</h3>
              <div className="glass-panel p-6" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Gauge value={selectedScore.score} label="Match score" color="var(--accent-primary)" />
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <BreakdownBars breakdown={selectedScore.breakdown} max={5} />
                  <p className="text-text-muted text-xs" style={{ marginTop: '0.5rem' }}>
                    Weighted by what you said matters most ({PRIORITIES[priority].label}) and how you drive ({USAGE_TYPES[usage].label.toLowerCase()}).
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* EMI & Ownership Cost Breakdown */}
          <section className="dashboard-section mt-4">
            <h3 className="section-title"><DollarSign size={24} className="text-success" /> EMI & Ownership Cost: {selectedCar.name}</h3>
            <div className="grid-2">
              <div className="glass-panel p-6" style={{ padding: '1.5rem' }}>
                <h4 className="mb-4">Monthly Estimate</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Vehicle Price</span>
                  <span className="font-mono">{selectedCar.priceStr}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Down Payment (20%)</span>
                  <span className="text-success font-mono">-{formatINR(selectedCar.price * 0.2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Interest Rate (APR)</span>
                  <span className="font-mono">8.5%</span>
                </div>
                <div className="divider" style={{ width: '100%', height: '1px', marginBottom: '1rem' }}></div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Estimated EMI (60 mo)</span>
                  <span className="text-2xl text-accent-primary font-bold font-mono">
                    {formatINR((selectedCar.price * 0.8 * 1.42) / 60)}/mo
                  </span>
                </div>
              </div>

              <div className="glass-panel p-6" style={{ padding: '1.5rem' }}>
                <h4 className="mb-4">True Cost of Ownership</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-text-secondary"><ShieldCheck size={16} /> Insurance</span>
                  <span className="font-mono">₹{insuranceMonthly.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-text-secondary"><Fuel size={16} /> Fuel (Est.)</span>
                  <span className="font-mono">₹{fuelMonthly.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-text-secondary"><Wrench size={16} /> Maintenance</span>
                  <span className="font-mono">₹{maintenanceMonthly.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex items-center justify-between mb-4 p-3 bg-bg-tertiary rounded" style={{ borderRadius: 'var(--radius-md)' }}>
                  <span>Extra Monthly Cost</span>
                  <span className="font-semibold text-lg font-mono">₹{extraMonthlyCost.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>
          </section>

          {/* Service & Test Drive Row */}
          <div className="grid-2 mt-4">
            <section className="dashboard-section">
              <h3 className="section-title"><Calendar size={24} className="text-accent-primary" /> Book a Test Drive</h3>
              <div className="glass-panel p-6" style={{ padding: '1.5rem', minHeight: '100%' }}>

                {bookingState === 'booked' ? (
                  <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in py-4">
                    <CheckCircle2 size={48} className="text-success mb-3" />
                    <h4 className="text-xl font-bold mb-2">Test Drive Confirmed!</h4>
                    <p className="text-text-secondary mb-4">You have an appointment for the <span className="text-white font-semibold">{selectedCar.name}</span>.</p>
                    <div className="bg-bg-tertiary p-3 rounded-lg border border-border-light w-full text-left">
                      <p className="text-sm mb-1"><span className="text-text-secondary">Date:</span> {bookingDetails.date}</p>
                      <p className="text-sm mb-1"><span className="text-text-secondary">Time:</span> {bookingDetails.time}</p>
                      <p className="text-sm"><span className="text-text-secondary flex items-center gap-1 mt-2 mb-1"><MapPin size={14}/> Dealership:</span> {bookingDetails.dealer}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookTestDrive} className="flex flex-col h-full animate-fade-in">
                    <p className="text-text-secondary mb-4">Experience the {selectedCar.name} firsthand. Select a preferred dealer and time.</p>

                    <div className="mb-3">
                      <label className="block text-xs text-text-secondary mb-1">Select Dealership</label>
                      <select
                        required
                        value={bookingDetails.dealer}
                        onChange={(e) => setBookingDetails({...bookingDetails, dealer: e.target.value})}
                        className="select-input"
                      >
                        {DEALERS.map((d, i) => <option key={i} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <div className="flex-1">
                        <label className="block text-xs text-text-secondary mb-1">Date</label>
                        <input
                          type="date"
                          required
                          value={bookingDetails.date}
                          onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                          className="text-input"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-text-secondary mb-1">Time</label>
                        <input
                          type="time"
                          required
                          value={bookingDetails.time}
                          onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                          className="text-input"
                        />
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                       <button type="submit" className="btn-primary w-full" style={{ padding: '0.875rem' }}>Confirm Booking</button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            <section className="dashboard-section">
              <h3 className="section-title"><Users size={24} className="text-warning" /> Service & Upgrades</h3>
              <div className="glass-panel p-6" style={{ padding: '1.5rem', minHeight: '100%' }}>
                <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 className="flex items-center gap-2"><Wrench size={16} className="text-warning" /> Annual Inspection</h4>
                    <p className="text-text-secondary text-sm">Due in 15 days for your Current Vehicle</p>
                  </div>
                  <button className="btn-outline py-2 px-4" style={{ padding: '0.4rem 0.8rem' }}>Schedule</button>
                </div>

                <div className="bg-bg-tertiary p-4 rounded mt-4" style={{ borderRadius: 'var(--radius-md)' }}>
                  <h4 className="flex items-center gap-2 text-accent-secondary mb-1">🎁 Upgrade Opportunity</h4>
                  <p className="text-text-secondary text-sm mb-3">Your current vehicle retains high trade-in value. Upgrade to the {selectedCar.name} today!</p>
                  <button className="text-accent-primary text-sm font-semibold flex items-center gap-1 hover:text-white transition">Calculate Trade-in <ChevronRight size={14} /></button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

    </div>
  );
}
