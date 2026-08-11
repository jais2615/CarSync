import { createContext, useContext, useState } from 'react';

// This context is the "CarSync Unified Profile" from the deck.
// In the real product this would be backed by a shared backend / CRM sync.
// For the prototype, lifting this state above both dashboards is enough to
// demonstrate the core pitch: what a customer does on the app instantly
// shows up on the dealer's screen.

const CustomerJourneyContext = createContext(null);

const initialJourney = {
  customerName: null,
  customerEmail: null,
  budget: '10lakh-15lakh',
  selectedCar: null,
  testDrive: null, // { date, time, dealer }
  siteVisits: 0,
  configuratorMinutes: 0,
};

export function CustomerJourneyProvider({ children }) {
  const [journey, setJourney] = useState(initialJourney);

  const updateJourney = (updates) => {
    setJourney((prev) => ({ ...prev, ...updates }));
  };

  const trackVisit = () => {
    setJourney((prev) => ({ ...prev, siteVisits: prev.siteVisits + 1 }));
  };

  const trackConfiguratorTime = (minutes) => {
    setJourney((prev) => ({ ...prev, configuratorMinutes: prev.configuratorMinutes + minutes }));
  };

  const resetJourney = () => setJourney(initialJourney);

  return (
    <CustomerJourneyContext.Provider value={{ journey, updateJourney, trackVisit, trackConfiguratorTime, resetJourney }}>
      {children}
    </CustomerJourneyContext.Provider>
  );
}

export function useCustomerJourney() {
  const ctx = useContext(CustomerJourneyContext);
  if (!ctx) throw new Error('useCustomerJourney must be used within a CustomerJourneyProvider');
  return ctx;
}
