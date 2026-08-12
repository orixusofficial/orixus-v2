import { useState, lazy, Suspense, useEffect } from 'react';
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

  // Ensure a single canonical exists and points to the production domain for static public pages.
  useEffect(() => {
    if (!isStaticPage) return;
    try {
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      const production = 'https://orixus.vercel.app';
      const canonicalHref = pathname === '/' ? `${production}/` : `${production}${pathname}`;
      if (canonicalEl) {
        canonicalEl.setAttribute('href', canonicalHref);
      }
    } catch (e) {
      // silent fail — do not interrupt the app
    }
  }, [isStaticPage, pathname]);

  // Update Open Graph and Twitter meta tags to match the current page's title/description
  useEffect(() => {
    if (!isStaticPage) return;
    try {
      const production = 'https://orixus.vercel.app';
      const title = document.title || '';
      const descEl = document.querySelector('meta[name="description"]');
      const description = descEl ? descEl.getAttribute('content') || '' : '';
      const url = pathname === '/' ? `${production}/` : `${production}${pathname}`;

      // OG
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      if (ogTitle) ogTitle.setAttribute('content', title);
      if (ogDesc) ogDesc.setAttribute('content', description);

      // Use 'article' for individual guide articles (paths under /guides/ but not /guides)
      const isArticle = pathname.startsWith('/guides/') && pathname !== '/guides';
      if (ogType) ogType.setAttribute('content', isArticle ? 'article' : 'website');

      if (ogUrl) ogUrl.setAttribute('content', url);
      if (ogImage) ogImage.setAttribute('content', `${production}/og-image.png`);

      // Twitter
      const twCard = document.querySelector('meta[name="twitter:card"]');
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      const twImage = document.querySelector('meta[name="twitter:image"]');

      if (twCard) twCard.setAttribute('content', 'summary_large_image');
      if (twTitle) twTitle.setAttribute('content', title);
      if (twDesc) twDesc.setAttribute('content', description);
      if (twImage) twImage.setAttribute('content', `${production}/og-image.png`);
    } catch (err) {
      // do not throw in production
    }
  }, [isStaticPage, pathname]);

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
