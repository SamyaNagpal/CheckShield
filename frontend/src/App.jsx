import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import URLScanner from './pages/URLScanner';
import EmailScanner from './pages/EmailScanner';
import UPIProtection from './pages/UPIProtection';
import QRScanner from './pages/QRScanner';
import Analytics from './pages/Analytics';
import ScanHistory from './pages/ScanHistory';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('community');
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [authChecked, setAuthChecked] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // On app load, check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setShowLanding(false);
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLanding(false);
    setCurrentPage('community');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthPage('login');
    setShowLanding(true);
  };

  // Don't render anything until we've checked localStorage
  if (!authChecked) return null;

  // Show landing page if not logged in and not on auth page
  if (showLanding && !user) {
    return (
      <LandingPage 
        onGoToLogin={() => setShowLanding(false)} 
        onGoToRegister={() => {
          setShowLanding(false);
          setAuthPage('register');
        }}
      />
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    if (authPage === 'register') {
      return (
        <RegisterPage
          onLogin={handleLogin}
          onGoToLogin={() => setAuthPage('login')}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() => setAuthPage('register')}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'community': return <Community user={user} />;
      case 'dashboard': return <Dashboard user={user} />;
      case 'url-scanner': return <URLScanner />;
      case 'email-scanner': return <EmailScanner />;
      case 'upi-protection': return <UPIProtection />;
      case 'qr-scanner': return <QRScanner />;
      case 'analytics': return <Analytics />;
      case 'scan-history': return <ScanHistory />;
      case 'settings': return <Settings user={user} onLogout={handleLogout} />;
      default: return <Community user={user} />;
    }
  };

  return (
    <div className="main-layout">
      <div className="main-content">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}