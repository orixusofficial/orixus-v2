import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthLoading from './components/AuthLoading';
import AuthModal from './components/AuthModal';
import AuthenticatedApp from './AuthenticatedApp';
import LandingPage from './pages/LandingPage';
import './styles/dashboard.css';

export default function App() {
  const { session, loading } = useAuth();
  const [activeItem, setActiveItem] = useState('habits');

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signup');

  const openAuth = (tab = 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuth = () => setAuthModalOpen(false);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setActiveItem('habits');
  };

  const handleLoggedOut = () => {
    setActiveItem('habits');
  };

  // 1. Loading — restore session from Supabase
  if (loading) {
    return <AuthLoading />;
  }

  // 2. No session — show Landing with auth modal wired
  if (!session) {
    return (
      <>
        <LandingPage onOpenAuth={openAuth} />
        <AuthModal
          isOpen={authModalOpen}
          defaultTab={authModalTab}
          onClose={closeAuth}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // 3. Authenticated — show full app
  return (
    <AuthenticatedApp
      activeItem={activeItem}
      onNavigate={setActiveItem}
      onLoggedOut={handleLoggedOut}
    />
  );
}
