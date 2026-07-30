import { useState, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthLoading from './components/AuthLoading';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JsonLd from './components/JsonLd';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/dashboard.css';

const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  const { session, loading, isRecovery } = useAuth();
  const [activeItem, setActiveItem] = useState('habits');

  // Check if on admin route
  const isAdminRoute = window.location.pathname === '/admin';

  // Check if on auth page route
  const pathname = window.location.pathname;
  const isHomeRoute = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Check if on static page route
  const isStaticPage = pathname === '/about' || pathname === '/contact' || pathname === '/privacy' || pathname === '/terms';
  const isKnownRoute = isHomeRoute || isAdminRoute || isAuthPage || isStaticPage;

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
    window.location.href = '/login';
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

  // 3. Auth pages — show login/signup
  if (isAuthPage) {
    // Redirect logged-in users away from auth pages
    if (session) {
      window.location.href = '/';
      return null;
    }

    const AuthPageComponent = () => {
      switch (pathname) {
        case '/login':
          return <LoginPage />;
        case '/signup':
          return <SignupPage />;
        default:
          return <LandingPage onOpenAuth={openAuth} />;
      }
    };

    return (
      <>
        <JsonLd />
        <Suspense fallback={null}>
          <AuthPageComponent />
        </Suspense>
      </>
    );
  }

  // 4. Static pages — show without auth requirement
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

  // 5. No session — show Landing with auth modal wired
  if (!isKnownRoute) {
    return (
      <>
        <JsonLd />
        <NotFoundPage />
      </>
    );
  }

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

  // 6. Admin route
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
