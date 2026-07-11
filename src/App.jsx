import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthLoading from './components/AuthLoading';
import LandingPage from './pages/LandingPage';
import JsonLd from './components/JsonLd';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './styles/dashboard.css';

const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return <AuthLoading />;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  const { session, loading, isRecovery } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signup');

  const openAuth = (tab = 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuth = () => setAuthModalOpen(false);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  const handleLoggedOut = () => {
    // Handled by navigation
  };

  const handleNavigateToLogin = () => {
    setAuthModalOpen(false);
  };

  // Recovery session — show reset password page
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

  return (
    <>
      <JsonLd />
      <Suspense fallback={null}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage onOpenAuth={openAuth} />} />
          <Route path="/login" element={<LoginPage onNavigate={(tab) => navigate(tab === 'signup' ? '/signup' : '/login')} />} />
          <Route path="/signup" element={<SignupPage onNavigate={(tab) => navigate(tab === 'login' ? '/login' : '/signup')} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />

          {/* Protected app routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AuthenticatedApp activeItem="habits" onNavigate={() => {}} onLoggedOut={handleLoggedOut} />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/habits" replace />} />
            <Route path="habits" element={<AuthenticatedApp activeItem="habits" onNavigate={() => {}} onLoggedOut={handleLoggedOut} />} />
            <Route path="analytics" element={<AuthenticatedApp activeItem="analytics" onNavigate={() => {}} onLoggedOut={handleLoggedOut} />} />
            <Route path="journal" element={<AuthenticatedApp activeItem="journal" onNavigate={() => {}} onLoggedOut={handleLoggedOut} />} />
            <Route path="profile" element={<AuthenticatedApp activeItem="profile" onNavigate={() => {}} onLoggedOut={handleLoggedOut} />} />
            <Route path="settings" element={<AuthenticatedApp activeItem="settings" onNavigate={() => {}} onLoggedOut={handleLoggedOut} />} />
          </Route>

          {/* Admin route */}
          <Route path="/admin" element={<AdminApp />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Auth Modal */}
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
