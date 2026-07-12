import { useState, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthLoading from './components/AuthLoading';
import LandingPage from './pages/LandingPage';
import JsonLd from './components/JsonLd';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import './styles/dashboard.css';

const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  const { session, loading, isRecovery } = useAuth();
  const [activeItem, setActiveItem] = useState('habits');

  // Check if on admin route
  const isAdminRoute = window.location.pathname === '/admin';

  // Check if on static page route
  const pathname = window.location.pathname;
  const isStaticPage = pathname === '/about' || pathname === '/contact' || pathname === '/privacy' || pathname === '/terms';

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

  // 3. Static pages — show without auth requirement
  if (isStaticPage) {
    const StaticPageComponent = () => {
      switch (pathname) {
        case '/about':
          return <AboutPage />;
        case '/contact':
          return <ContactPage />;
        case '/privacy':
          return <PrivacyPolicyPage />;
        case '/terms':
          return <TermsOfServicePage />;
        default:
          return <LandingPage onOpenAuth={openAuth} />;
      }
    };

    return (
      <>
        <JsonLd />
        <Suspense fallback={null}>
          <StaticPageComponent />
        </Suspense>
      </>
    );
  }

  // 4. No session — show Landing with auth modal wired
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

  // 5. Admin route
  if (isAdminRoute) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
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
