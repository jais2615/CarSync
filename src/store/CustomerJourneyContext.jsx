import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// This context is the "CarSync Unified Profile" from the deck.
// In the real product this would be backed by a shared backend / CRM sync.
// For the prototype, lifting this state above both dashboards demonstrates
// the core pitch: what a customer does on the app instantly shows up on the
// dealer's screen — and now, via localStorage, survives a page refresh too,
// so a demo doesn't reset itself mid-walkthrough.

const CustomerJourneyContext = createContext(null);
const STORAGE_KEY = 'carsync:journey:v1';

const initialJourney = {
  customerName: null,
  customerEmail: null,

  // Preferences the recommendation engine (lib/recommend.js) scores against.
  budget: '10lakh-15lakh',
  usage: 'mixed',        // city | highway | mixed | offroad
  fuelPref: 'any',       // any | petrol | cng | hybrid
  familySize: 4,
  priority: 'economy',   // economy | space | performance | features

  selectedCar: null,
  testDrive: null,        // { date, time, dealer }
  siteVisits: 0,
  configuratorMinutes: 0,
  lastActivityAt: null,   // epoch ms — feeds the lead-score decay in lib/leadScore.js
  simulateIdleHours: 0,   // demo-only knob, does not persist across resets

  privacyConsent: null,   // null = not asked yet, true/false once answered
};

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialJourney;
    return { ...initialJourney, ...JSON.parse(raw) };
  } catch {
    return initialJourney;
  }
}

export function CustomerJourneyProvider({ children }) {
  const [journey, setJourney] = useState(loadPersisted);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
    } catch {
      // localStorage can fail in private-browsing / storage-full edge cases —
      // the app should still work in-memory for that session.
    }
  }, [journey]);

  // `touch=true` (default) stamps lastActivityAt, which is what the dealer's
  // lead-score decay reads. Pass touch:false for changes that shouldn't count
  // as fresh engagement (e.g. the demo-only "simulate idle" control).
  const updateJourney = useCallback((updates, touch = true) => {
    setJourney((prev) => ({
      ...prev,
      ...updates,
      ...(touch ? { lastActivityAt: Date.now() } : {}),
    }));
  }, []);

  const trackVisit = useCallback(() => {
    setJourney((prev) => ({ ...prev, siteVisits: prev.siteVisits + 1, lastActivityAt: Date.now() }));
  }, []);

  const trackConfiguratorTime = useCallback((minutes) => {
    setJourney((prev) => ({ ...prev, configuratorMinutes: prev.configuratorMinutes + minutes, lastActivityAt: Date.now() }));
  }, []);

  const setPrivacyConsent = useCallback((consent) => {
    setJourney((prev) => ({ ...prev, privacyConsent: consent }));
  }, []);

  // Demo-only: lets you show the lead-score decay working without actually
  // waiting three days. Does not touch lastActivityAt.
  const simulateIdle = useCallback((hours) => {
    setJourney((prev) => ({ ...prev, simulateIdleHours: Math.max(0, prev.simulateIdleHours + hours) }));
  }, []);

  const resetJourney = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setJourney(initialJourney);
  }, []);

  return (
    <CustomerJourneyContext.Provider value={{
      journey, updateJourney, trackVisit, trackConfiguratorTime,
      setPrivacyConsent, simulateIdle, resetJourney,
    }}>
      {children}
    </CustomerJourneyContext.Provider>
  );
}

export function useCustomerJourney() {
  const ctx = useContext(CustomerJourneyContext);
  if (!ctx) throw new Error('useCustomerJourney must be used within a CustomerJourneyProvider');
  return ctx;
}
