import { useState } from 'react';
import { Car, UserCircle, LogOut } from 'lucide-react';
import { CustomerDashboard } from './components/CustomerDashboard';
import { DealerDashboard } from './components/DealerDashboard';
import { AuthScreen } from './components/AuthScreen';

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'customer' or 'dealer'
  const [userData, setUserData] = useState(null); // store email/name

  const handleLogin = (role, data) => {
    setUserRole(role);
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
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

export default App;
