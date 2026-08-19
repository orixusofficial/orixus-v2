import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

function AppRouter() {
  const { session, loading, isRecovery } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signup');

  // Determine activeItem from URL for authenticated routes
  const getActiveItemFromPath = (pathname) => {
    if (pathname === '/habits') return 'habits';
    if (pathname === '/analytics') return 'analytics';
    if (pathname === '/journal') return 'journal';
    if (pathname === '/profile') return 'profile';
    if (pathname === '/settings') return 'settings';
    return 'habits'; // default
  };

  const [activeItem, setActiveItem] = useState(() => getActiveItemFromPath(location.pathname));

  // Update activeItem when URL changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  // Update URL when activeItem changes (for navigation)
  const handleNavigate = (item) => {
    setActiveItem(item);
    const pathMap = {
      habits: '/habits',
      analytics: '/analytics',
      journal: '/journal',
      profile: '/profile',
      settings: '/settings',
      logout: '/logout'
    };
    if (pathMap[item]) {
      navigate(pathMap[item]);
    }
  };

  // Check if on admin route
  const isAdminRoute = location.pathname === '/admin';

  // Check if on auth page route
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Check if on static page route
  const isStaticPage = location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/faq' || location.pathname === '/guides' || location.pathname.startsWith('/guides/');
  const isHomeRoute = location.pathname === '/';
  const isKnownRoute = isHomeRoute || isAdminRoute || isAuthPage || isStaticPage || location.pathname.startsWith('/habits') || location.pathname.startsWith('/analytics') || location.pathname.startsWith('/journal') || location.pathname.startsWith('/profile') || location.pathname.startsWith('/settings') || location.pathname === '/logout';

  // Ensure a single canonical exists and points to the production domain for static public pages.
  useEffect(() => {
    if (!isStaticPage) return;
    try {
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      const production = 'https://orixus.vercel.app';
      const canonicalHref = location.pathname === '/' ? `${production}/` : `${production}${location.pathname}`;
      if (canonicalEl) {
        canonicalEl.setAttribute('href', canonicalHref);
      }
    } catch (e) {
      // silent fail — do not interrupt the app
    }
  }, [isStaticPage, location.pathname]);

  // Update Open Graph and Twitter meta tags to match the current page's title/description
  useEffect(() => {
    if (!isStaticPage) return;
    try {
      const production = 'https://orixus.vercel.app';
      const title = document.title || '';
      const descEl = document.querySelector('meta[name="description"]');
      const description = descEl ? descEl.getAttribute('content') || '' : '';
      const url = location.pathname === '/' ? `${production}/` : `${production}${location.pathname}`;

      // OG
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      if (ogTitle) ogTitle.setAttribute('content', title);
      if (ogDesc) ogDesc.setAttribute('content', description);

      // Use 'article' for individual guide articles (paths under /guides/ but not /guides)
      const isArticle = location.pathname.startsWith('/guides/') && location.pathname !== '/guides';
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
  }, [isStaticPage, location.pathname]);

  const openAuth = (tab = 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuth = () => setAuthModalOpen(false);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    navigate('/habits');
  };

  const handleLoggedOut = () => {
    navigate('/');
  };

  const handleNavigateToLogin = () => {
    setAuthModalOpen(false);
    navigate('/login');
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
      navigate('/habits');
      return null;
    }

    const AuthPageComponent = () => {
      switch (location.pathname) {
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
      switch (location.pathname) {
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
      navigate('/login');
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
        onNavigate={handleNavigate}
        onLoggedOut={handleLoggedOut}
      />
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
