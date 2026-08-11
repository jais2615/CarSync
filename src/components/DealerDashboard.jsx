import React from 'react';
import { User, Activity, Target, PhoneCall, Mail, MessageSquare, TrendingUp, AlertCircle, Car } from 'lucide-react';
import { useCustomerJourney } from '../store/CustomerJourneyContext';

const BUDGET_LABELS = {
  'under-10lakh': 'Under ₹10 Lakhs',
  '10lakh-15lakh': '₹10L – ₹15L',
  '15lakh-20lakh': '₹15L – ₹20L',
  'over-20lakh': 'Above ₹20 Lakhs',
};

export function DealerDashboard() {
  const { journey } = useCustomerJourney();
  const { customerName, budget, selectedCar, testDrive, siteVisits } = journey;

  const hasActivity = Boolean(customerName);

  // A simple, explainable intent score (per the deck's "explainable
  // recommendations" mitigation) instead of an unexplained magic number.
  let intentScore = 20;
  if (selectedCar) intentScore += 35;
  if (testDrive) intentScore += 35;
  if (siteVisits > 1) intentScore += 10;
  intentScore = Math.min(intentScore, 98);

  const intentLabel = intentScore >= 80 ? 'HOT LEAD' : intentScore >= 50 ? 'WARM LEAD' : 'NEW LEAD';

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
              ? `Sourced via CarSync App • Budget: ${BUDGET_LABELS[budget]}`
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
                  <span className="glass-pill text-sm px-3 py-1">Budget: {BUDGET_LABELS[budget]}</span>
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
                   <p className="text-sm text-text-secondary">Listed Price: {selectedCar.priceStr} • {selectedCar.match} recommendation match</p>
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

        {/* Intent Score & Analytics */}
        <section className="dashboard-section">
          <h3 className="section-title"><TrendingUp size={24} className="text-success" /> Engagement Analytics</h3>
          <div className="glass-panel p-6 flex-col justify-between" style={{ padding: '1.5rem', height: '100%', display: 'flex' }}>

            {/* Radial Progress / Intent visualizer */}
            <div className="flex items-center justify-center py-6">
              <div className="relative flex items-center justify-center p-4 bg-bg-secondary rounded-full border-4 border-accent-primary shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ width: '160px', height: '160px', borderRadius: '50%' }}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{hasActivity ? intentScore : 0}<span className="text-xl">%</span></div>
                  <div className="text-xs text-accent-secondary font-semibold tracking-wider">{hasActivity ? intentLabel : 'NO DATA'}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
               <div className="bg-bg-tertiary p-3 rounded text-center">
                 <div className="text-xl font-bold">{siteVisits}</div>
                 <div className="text-xs text-text-secondary">App Sessions</div>
               </div>
               <div className="bg-bg-tertiary p-3 rounded text-center">
                 <div className="text-xl font-bold">{selectedCar ? '1 car' : '0'}</div>
                 <div className="text-xs text-text-secondary">Vehicles Shortlisted</div>
               </div>
            </div>

          </div>
        </section>
      </div>

      {/* Suggested Sales Approach */}
      <section className="dashboard-section mt-4">
        <h3 className="section-title"><AlertCircle size={24} className="text-warning" /> AI Suggested Approach</h3>
        <div className="glass-panel p-6 border-l-4 border-l-warning" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          {hasActivity ? (
            <>
              <h4 className="text-lg mb-2">
                {selectedCar ? `Focus the conversation on the ${selectedCar.name}` : `Help narrow down within ${BUDGET_LABELS[budget]}`}
              </h4>
              <p className="text-text-secondary mb-4">
                {selectedCar
                  ? `This customer shortlisted the ${selectedCar.name} on CarSync (${selectedCar.match} recommendation match) within a ${BUDGET_LABELS[budget]} budget.`
                  : `This customer is browsing within a ${BUDGET_LABELS[budget]} budget but hasn't shortlisted a specific model yet.`}
                {testDrive ? ` A test drive is already booked for ${testDrive.date} — confirm details and prep the vehicle.` : ' No test drive booked yet — that\'s the highest-leverage next step.'}
              </p>

              <h4 className="text-md font-semibold mb-2 text-white">Next Best Actions:</h4>
              <ul className="text-text-secondary text-sm space-y-2 mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                {!testDrive && <li>Proactively offer to schedule a test drive — they've shown intent but haven't booked.</li>}
                {selectedCar && <li>Lead with the EMI and true ownership cost breakdown they already saw on the app, so pricing feels consistent.</li>}
                <li>Reference their online shortlist directly — avoid re-asking budget or preferences they've already shared.</li>
              </ul>
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
