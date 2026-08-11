import React, { useState } from 'react';
import { Car, User, Briefcase, ChevronRight, X } from 'lucide-react';

export function AuthScreen({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState('customer'); // default selection
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  const openModal = (selectedRole) => {
    setRole(selectedRole);
    setAuthMode('login'); // Reset to login on open
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-20 relative overflow-hidden" style={{ minHeight: '100vh', padding: '1.5rem', paddingTop: '8vh', background: 'var(--bg-primary)' }}>
      
      {/* Background decorative dots approximation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--accent-primary) 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }}></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl animate-fade-in mt-16">
        
        {/* Header/Logo */}
        <div className="flex items-center gap-3 mb-12">
          <Car size={48} color="var(--accent-primary)" />
          <h1 className="text-5xl font-bold tracking-tight text-text-primary m-0 pt-2">CarSync</h1>
        </div>

        {/* Hero Text */}
        <h2 className="text-5xl md:text-7xl tracking-tight leading-tight text-white mb-14 font-normal" style={{ fontFamily: 'Georgia, serif' }}>
          One customer, one journey, <br />one unified backbone
        </h2>

        {/* Actions */}
        <div className="flex flex-row gap-6 items-center justify-center">
          <button 
            onClick={() => openModal('customer')}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105"
            style={{ backgroundColor: 'transparent', color: '#60a5fa', border: '2px solid #60a5fa', boxShadow: '0 4px 14px rgba(96,165,250,0.1)' }}
          >
            <User size={20} />
            Login as Customer
          </button>
          
          <button 
            onClick={() => openModal('dealer')}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105"
            style={{ backgroundColor: '#60a5fa', color: '#000000', border: '2px solid #60a5fa', boxShadow: '0 4px 14px rgba(96,165,250,0.3)' }}
          >
            <Briefcase size={20} />
            Login as Dealer
          </button>
        </div>
      </div>

      {/* Login / Signup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md p-8 relative rounded-2xl shadow-2xl" style={{ border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', padding: '2.5rem 2rem' }}>
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute text-text-secondary hover:text-white transition"
              style={{ top: '1rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X size={28} />
            </button>

            {/* Modal Header Icon */}
            <div className="text-center mb-6 mt-4">
              <div className="inline-flex items-center justify-center p-4 rounded-full mb-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {role === 'customer' ? <User size={32} className="text-accent-primary" /> : <Briefcase size={32} className="text-accent-primary" />}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                {role === 'customer' ? 'Customer Profile' : 'Dealer Portal'}
              </h3>
            </div>

            {/* Auth Toggle (Login vs Signup) */}
            <div className="flex bg-transparent mb-8" style={{ gap: '0.75rem', padding: '0' }}>
              <button 
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition border ${authMode === 'login' ? 'text-black shadow-[0_4px_14px_rgba(96,165,250,0.3)] border-[#60a5fa]' : 'text-text-secondary hover:text-white bg-bg-tertiary border-border-color hover:border-border-light'}`}
                style={authMode === 'login' ? { backgroundColor: '#60a5fa' } : {}}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button 
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition border ${authMode === 'signup' ? 'text-black shadow-[0_4px_14px_rgba(96,165,250,0.3)] border-[#60a5fa]' : 'text-text-secondary hover:text-white bg-bg-tertiary border-border-color hover:border-border-light'}`}
                style={authMode === 'signup' ? { backgroundColor: '#60a5fa' } : {}}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              onLogin(role, data); 
            }}>
              
              {authMode === 'signup' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input 
                    name="fullName"
                    type="text" 
                    placeholder="John Doe"
                    required
                    className="w-full text-text-primary" 
                    style={{ 
                      width: '100%', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', outline: 'none', transition: 'all 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder={role === 'customer' ? "john@example.com" : "sales@dealership.com"}
                  required
                  className="w-full text-text-primary" 
                  style={{ 
                    width: '100%', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', outline: 'none', transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                />
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-text-secondary">Password</label>
                  {authMode === 'login' && <a href="#" className="text-xs text-accent-primary hover:text-white transition">Forgot?</a>}
                </div>
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full text-text-primary" 
                  style={{ 
                    width: '100%', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', outline: 'none', transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                />
              </div>

              <button 
                type="submit"
                className="btn-primary w-full flex justify-center items-center gap-2 py-3 mt-4" 
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'} <ChevronRight size={18} />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
