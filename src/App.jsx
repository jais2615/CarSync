import { useState, useEffect } from 'react';
import { Car, UserCircle, LogOut, RotateCcw } from 'lucide-react';
import { CustomerDashboard } from './components/CustomerDashboard';
import { DealerDashboard } from './components/DealerDashboard';
import { AuthScreen } from './components/AuthScreen';
import { CustomerJourneyProvider, useCustomerJourney } from './store/CustomerJourneyContext';

const AUTH_KEY = 'carsync:auth:v1';

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function AppShell() {
  // Authentication state — persisted so a refresh mid-demo doesn't bounce
  // back to the login screen (paired with the journey persistence in
  // CustomerJourneyContext).
  const persisted = loadAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(persisted));
  const [userRole, setUserRole] = useState(persisted?.userRole ?? null);
  const [userData, setUserData] = useState(persisted?.userData ?? null);
  const { updateJourney, resetJourney } = useCustomerJourney();

  useEffect(() => {
    try {
      if (isAuthenticated) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ userRole, userData }));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch {
      // ignore storage failures — session still works in-memory
    }
  }, [isAuthenticated, userRole, userData]);

  const handleLogin = (role, data) => {
    setUserRole(role);
    setUserData(data);
    setIsAuthenticated(true);

    // A customer logging in and browsing IS the signal that feeds the
    // dealer's lead score panel — this is the unified profile in action,
    // not two disconnected mock screens. (Visit tracking itself happens in
    // CustomerDashboard's mount effect, to avoid double-counting here.)
    if (role === 'customer') {
      updateJourney({
        customerName: data?.fullName || data?.email?.split('@')[0] || 'Prospective Customer',
        customerEmail: data?.email || null,
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const handleResetDemo = () => {
    resetJourney();
    handleLogout();
  };

  // If not logged in, show the seamless AuthScreen
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <nav className="navbar glass-panel">
        <div className="container flex items-center justify-between header-content">
          <div className="logo flex items-center gap-2">
            <div className="logo-icon-bg">
              <Car size={24} color="var(--accent-primary)" />
            </div>
            <h2 className="logo-text">CarSync {userRole === 'dealer' && <span className="text-sm font-normal text-text-secondary ml-1">Dealer Portal</span>}</h2>
          </div>
          
          <div className="user-profile flex items-center gap-4">
            <div className="flex flex-col items-end text-right hidden sm:flex">
               <span className="text-sm font-medium text-white">{userData?.fullName || userData?.email || 'User'}</span>
               <span className="text-xs text-text-muted uppercase tracking-wider">{userRole}</span>
            </div>
            <div className="user-icon-wrap">
              <UserCircle size={28} className="text-accent-secondary hover-white transition" />
            </div>
            <div className="divider"></div>
            <button className="logout-btn" onClick={handleResetDemo} title="Reset demo data (clears everything persisted in this browser)">
              <RotateCcw size={18} className="text-text-muted hover-danger transition" />
            </button>
            <button className="logout-btn" onClick={handleLogout} title="Sign Out">
              <LogOut size={20} className="text-text-muted hover-danger transition" />
            </button>
          </div>
        </div>
      </nav>

      <main className="container main-content mt-6 mb-12 animate-fade-in">
        {userRole === 'customer' ? <CustomerDashboard /> : <DealerDashboard />}
      </main>
    </div>
  );
}

function App() {
  return (
    <CustomerJourneyProvider>
      <AppShell />
    </CustomerJourneyProvider>
  );
}

export default App;
