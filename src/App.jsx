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
import FaqPage from './pages/FaqPage';
import GuidesPage from './pages/GuidesPage';
import GuideArticlePage from './pages/GuideArticlePage';
import GuideConsistencyPage from './pages/GuideConsistencyPage';
import GuideHabitsPage from './pages/GuideHabitsPage';
import GuidePersonalGrowthPage from './pages/GuidePersonalGrowthPage';
import GuideRoutinesPage from './pages/GuideRoutinesPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminUnauthorized from './admin/AdminUnauthorized';
import { ADMIN_USER_ID } from './admin/config';
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
  const isStaticPage = pathname === '/about' || pathname === '/contact' || pathname === '/privacy' || pathname === '/terms' || pathname === '/faq' || pathname === '/guides' || pathname.startsWith('/guides/');
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
        case '/faq':
          return <FaqPage />;
        case '/guides':
          return <GuidesPage />;
        case '/guides/how-to-build-discipline':
          return <GuideArticlePage />;
        case '/guides/how-to-stay-consistent-with-your-habits':
          return <GuideConsistencyPage />;
        case '/guides/how-to-build-habits-that-actually-stick':
          return <GuideHabitsPage />;
        case '/guides/how-to-make-real-progress-in-personal-growth':
          return <GuidePersonalGrowthPage />;
        case '/guides/how-to-build-a-routine-that-actually-works':
          return <GuideRoutinesPage />;
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

  // 5. Admin route — full access guard before any session-based routing
  if (isAdminRoute) {
    // Unauthenticated visitors go to login (not landing page)
    if (!session) {
      window.location.href = '/login';
      return null;
    }
    // Authenticated but not admin — hard 403, no redirect, no data
    if (session.user?.id !== ADMIN_USER_ID) {
      return <AdminUnauthorized />;
    }
    // Only the authorized admin reaches this branch
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  }

  // 6. Unknown route — 404
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
