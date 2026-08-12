import React from 'react';
import { User, Target, PhoneCall, Mail, MessageSquare, TrendingUp, AlertCircle, Car, Clock, FastForward } from 'lucide-react';
import { useCustomerJourney } from '../store/CustomerJourneyContext';
import { BUDGET_RANGES } from '../data/cars';
import { scoreLead } from '../lib/leadScore';
import { Gauge } from './Gauge';

function formatIdle(hours) {
  if (hours < 1) return 'just now';
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function DealerDashboard() {
  const { journey, simulateIdle } = useCustomerJourney();
  const { customerName, budget, selectedCar, testDrive, siteVisits, simulateIdleHours } = journey;

  const hasActivity = Boolean(customerName);
  const lead = scoreLead(journey, simulateIdleHours);
  const badgeClass = lead.label === 'HOT LEAD' ? 'badge-hot' : lead.label === 'WARM LEAD' ? 'badge-warm' : 'badge-new';

  return (
    <div className="dashboard-content animate-fade-in">

      {/* Overview/Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User size={28} className="text-accent-primary" />
            {hasActivity ? `Active Lead: ${customerName}` : 'No Active Lead Yet'}
          </h2>
          <p className="text-text-secondary mt-1">
            {hasActivity
              ? `Sourced via CarSync App • Budget: ${BUDGET_RANGES[budget]?.label}`
              : 'Data will appear here as soon as a customer logs in and browses on CarSync.'}
          </p>
        </div>
        <div className="flex gap-2">
           <button className="glass-pill p-2 hover:bg-bg-tertiary transition"><PhoneCall size={20} className="text-text-secondary hover:text-white" /></button>
           <button className="glass-pill p-2 hover:bg-bg-tertiary transition"><Mail size={20} className="text-text-secondary hover:text-white" /></button>
           <button className="glass-pill p-2 hover:bg-bg-tertiary transition"><MessageSquare size={20} className="text-text-secondary hover:text-white" /></button>
        </div>
      </div>

      <div className="grid-2">
        {/* Customer Profile & Preferences */}
        <section className="dashboard-section">
          <h3 className="section-title"><Target size={24} className="text-accent-primary" /> Customer Profile</h3>
          <div className="glass-panel p-6" style={{ padding: '1.5rem', height: '100%' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h4 className="text-lg">Preferences</h4>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="glass-pill text-sm px-3 py-1">Budget: {BUDGET_RANGES[budget]?.label}</span>
                  {selectedCar && <span className="glass-pill text-sm px-3 py-1">Interested in: {selectedCar.name}</span>}
                </div>
              </div>
            </div>

            <h4 className="text-lg mb-3 border-t pt-4 border-border-color">Shortlisted Vehicle</h4>
            {selectedCar ? (
              <div className="flex items-center gap-4 bg-bg-tertiary p-3 rounded" style={{ borderRadius: 'var(--radius-md)' }}>
                 <div className="bg-bg-secondary p-2 rounded"><Car size={24} className="text-text-secondary" /></div>
                 <div>
                   <p className="font-semibold">Maruti Suzuki {selectedCar.name}</p>
                   <p className="text-sm text-text-secondary font-mono">Listed Price: {selectedCar.priceStr}</p>
                 </div>
              </div>
            ) : (
              <p className="text-text-secondary text-sm">No vehicle shortlisted yet on the customer app.</p>
            )}

            <div className="mt-6 border-t pt-4 border-border-color">
              <h4 className="text-lg mb-3">Test Drive</h4>
              {testDrive ? (
                <>
                  <p className="text-text-secondary">Scheduled: <strong>{testDrive.date} at {testDrive.time}</strong></p>
                  <p className="text-text-secondary">Dealership: <strong className="text-success">{testDrive.dealer}</strong></p>
                </>
              ) : (
                <p className="text-text-secondary">Not booked yet — a good next-best-action for this lead.</p>
              )}
            </div>
          </div>
        </section>

        {/* Lead Score & Analytics */}
        <section className="dashboard-section">
          <h3 className="section-title"><TrendingUp size={24} className="text-success" /> Lead Score</h3>
          <div className="glass-panel p-6 flex-col justify-between" style={{ padding: '1.5rem', height: '100%', display: 'flex' }}>

            <div className="flex items-center justify-center py-2">
              <Gauge value={hasActivity ? lead.score : 0} color="var(--data-accent)" />
            </div>
            <div className="flex justify-center mb-4">
              <span className={`badge ${badgeClass}`}>{hasActivity ? lead.label : 'NO DATA'}</span>
            </div>

            {/* Explainable score — every point traces to a factor, and the
                score decays with time so a cold lead doesn't look as hot as
                one that's active right now. */}
            {hasActivity && (
              <div style={{ marginBottom: '1rem' }}>
                {lead.breakdown.map((f) => (
                  <div key={f.label} className="flex justify-between text-sm" style={{ marginBottom: '0.3rem' }}>
                    <span className="text-text-secondary">{f.label}{f.detail ? ` — ${f.detail}` : ''}</span>
                    <span className="font-mono">+{f.points}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm mt-2 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="flex items-center gap-1 text-text-secondary"><Clock size={14} /> Last activity</span>
                  <span className="font-mono">{formatIdle(lead.hoursIdle)} (×{lead.decay.toFixed(2)})</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-auto">
               <div className="bg-bg-tertiary p-3 rounded text-center">
                 <div className="text-xl font-bold font-mono">{siteVisits}</div>
                 <div className="text-xs text-text-secondary">App Sessions</div>
               </div>
               <div className="bg-bg-tertiary p-3 rounded text-center">
                 <div className="text-xl font-bold font-mono">{selectedCar ? '1 car' : '0'}</div>
                 <div className="text-xs text-text-secondary">Vehicles Shortlisted</div>
               </div>
            </div>

            {hasActivity && (
              <button
                className="btn-outline text-sm mt-3 flex items-center justify-center gap-2"
                onClick={() => simulateIdle(24)}
                title="Demo control — advances the decay clock without waiting in real time."
              >
                <FastForward size={14} /> Simulate 24h of no activity
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Suggested Sales Approach */}
      <section className="dashboard-section mt-4">
        <h3 className="section-title"><AlertCircle size={24} className="text-warning" /> Suggested Approach</h3>
        <div className="glass-panel p-6 border-l-4 border-l-warning" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          {hasActivity ? (
            <>
              <h4 className="text-lg mb-2">
                {selectedCar ? `Focus the conversation on the ${selectedCar.name}` : `Help narrow down within ${BUDGET_RANGES[budget]?.label}`}
              </h4>
              <p className="text-text-secondary mb-4">
                {selectedCar
                  ? `This customer shortlisted the ${selectedCar.name} on CarSync within a ${BUDGET_RANGES[budget]?.label} budget.`
                  : `This customer is browsing within a ${BUDGET_RANGES[budget]?.label} budget but hasn't shortlisted a specific model yet.`}
                {testDrive ? ` A test drive is already booked for ${testDrive.date} — confirm details and prep the vehicle.` : ' No test drive booked yet — that\'s the highest-leverage next step.'}
                {lead.hoursIdle > 48 ? ` Note: this lead has gone quiet for ${formatIdle(lead.hoursIdle)} — a check-in nudge may be more effective than a hard sell.` : ''}
              </p>

              <h4 className="text-md font-semibold mb-2 text-white">Next Best Actions:</h4>
              <ul className="text-text-secondary text-sm space-y-2 mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                {!testDrive && <li>Proactively offer to schedule a test drive — they've shown intent but haven't booked.</li>}
                {selectedCar && <li>Lead with the EMI and true ownership cost breakdown they already saw on the app, so pricing feels consistent.</li>}
                <li>Reference their online shortlist directly — avoid re-asking budget or preferences they've already shared.</li>
              </ul>
              <p className="text-text-muted text-xs">
                This score is a priority signal for triage, not an auto-filter — a low score with a recent visit is still worth a call.
              </p>
            </>
          ) : (
            <p className="text-text-secondary">No suggested approach yet — this fills in automatically once the customer starts browsing on CarSync.</p>
          )}

          <div className="flex gap-4 border-t border-border-color pt-4 mt-4">
            <button className="btn-primary">Generate Email Draft</button>
            <button className="btn-outline">Log Activity</button>
          </div>
        </div>
      </section>

    </div>
  );
}
