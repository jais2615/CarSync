import React from 'react';
import { User, Activity, Target, PhoneCall, Mail, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

export function DealerDashboard() {
  return (
    <div className="dashboard-content animate-fade-in">
      
      {/* Overview/Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><User size={28} className="text-accent-primary" /> Active Lead: John Miller</h2>
          <p className="text-text-secondary mt-1">Sourced via Walk-in • Last Contact: 2 days ago</p>
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
                <div className="flex gap-2 mt-2">
                  <span className="glass-pill text-sm px-3 py-1">Electric Vehicle</span>
                  <span className="glass-pill text-sm px-3 py-1">Sedan / Luxury</span>
                  <span className="glass-pill text-sm px-3 py-1">Range &gt;300mi</span>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg mb-3 border-t pt-4 border-border-color">Current Vehicle</h4>
            <div className="flex items-center gap-4 bg-bg-tertiary p-3 rounded" style={{ borderRadius: 'var(--radius-md)' }}>
               <div className="bg-bg-secondary p-2 rounded"><Activity size={24} className="text-text-secondary" /></div>
               <div>
                 <p className="font-semibold">2021 Tesla Model 3 Long Range</p>
                 <p className="text-sm text-text-secondary">Est. Trade-in Value: $28,500</p>
               </div>
            </div>

            <div className="mt-6 border-t pt-4 border-border-color">
              <h4 className="text-lg mb-3">Financing Stance</h4>
              <p className="text-text-secondary">Expected Down Payment: <strong>$15,000 - $20,000</strong></p>
              <p className="text-text-secondary">Pre-approved: <strong className="text-success">Yes (through local Credit Union)</strong></p>
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
                  <div className="text-4xl font-bold text-white">87<span className="text-xl">%</span></div>
                  <div className="text-xs text-accent-secondary font-semibold tracking-wider">HOT LEAD</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
               <div className="bg-bg-tertiary p-3 rounded text-center">
                 <div className="text-xl font-bold">4</div>
                 <div className="text-xs text-text-secondary">Site Visits</div>
               </div>
               <div className="bg-bg-tertiary p-3 rounded text-center">
                 <div className="text-xl font-bold">12m</div>
                 <div className="text-xs text-text-secondary">Time on Configurator</div>
               </div>
            </div>

          </div>
        </section>
      </div>

      {/* Suggested Sales Approach */}
      <section className="dashboard-section mt-4">
        <h3 className="section-title"><AlertCircle size={24} className="text-warning" /> AI Suggested Approach</h3>
        <div className="glass-panel p-6 border-l-4 border-l-warning" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <h4 className="text-lg mb-2">Focus on Premium Features & Range</h4>
          <p className="text-text-secondary mb-4">
            John is heavily exploring the Model S Plaid configuration page. His current Model 3 is nearing its extended warranty limit. 
            Highlight the performance upgrades and superior range.
          </p>
          
          <h4 className="text-md font-semibold mb-2 text-white">Next Best Actions:</h4>
          <ul className="text-text-secondary text-sm space-y-2 mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Pitch a competitive trade-in valuation for his Model 3 to close the psychological price gap.</li>
            <li>Offer a priority weekend test drive for the Plaid. He has checked availability twice.</li>
            <li>Send a personalized video walkthrough of the Plaid's interior tech upgrades vs the Model 3.</li>
          </ul>

          <div className="flex gap-4 border-t border-border-color pt-4 mt-4">
            <button className="btn-primary">Generate Email Draft</button>
            <button className="btn-outline">Log Activity</button>
          </div>
        </div>
      </section>

    </div>
  );
}
