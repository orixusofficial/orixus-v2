import { useState, lazy, Suspense, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { initGA, trackPageView } from './lib/analytics';
import AuthLoading from './components/AuthLoading';
import LandingPage from './pages/LandingPage';
import JsonLd from './components/JsonLd';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './styles/dashboard.css';

const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'));
const AuthModal = lazy(() => import('./components/AuthModal'));

export default function App() {
  const { session, loading, isRecovery } = useAuth();
  const [activeItem, setActiveItem] = useState('habits');

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signup');

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (!loading) {
      trackPageView(window.location.pathname);
    }
  }, [loading, session, isRecovery]);

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

  const handleNavigateToLogin = () => {
    setAuthModalOpen(false);
  };

  // 1. Loading — restore session from Supabase
  if (loading) {
    return <AuthLoading />;
  }

  // 2. Recovery session — show reset password page
  if (isRecovery) {
    return (
      <>
        <JsonLd />
        <Suspense fallback={null}>
          <ResetPasswordPage onNavigateToLogin={handleNavigateToLogin} />
        </Suspense>
      </>
    );
  }

  // 3. No session — show Landing with auth modal wired
  if (!session) {
    return (
      <>
        <JsonLd />
        <LandingPage onOpenAuth={openAuth} />
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModalOpen}
            defaultTab={authModalTab}
            onClose={closeAuth}
            onSuccess={handleAuthSuccess}
          />
        </Suspense>
      </>
    );
  }

  return (
    <Suspense fallback={null}>
      <AuthenticatedApp
        activeItem={activeItem}
        onNavigate={setActiveItem}
        onLoggedOut={handleLoggedOut}
      />
    </Suspense>
  );
}
