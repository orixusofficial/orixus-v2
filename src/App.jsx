import { useState } from 'react';
// TEMPORARY AUTH BYPASS
// import { useEffect } from 'react';
// import { useAuth } from './contexts/AuthContext';
// import AuthLoading from './components/AuthLoading';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
import AuthenticatedApp from './AuthenticatedApp';
import './styles/dashboard.css';

// TEMPORARY AUTH BYPASS
// const AUTH_VIEWS = ['login', 'signup'];

export default function App() {
  // TEMPORARY AUTH BYPASS
  // const { session, loading } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');

  // TEMPORARY AUTH BYPASS
  /*
  useEffect(() => {
    if (loading) return;

    if (!session) {
      if (!AUTH_VIEWS.includes(activeItem)) {
        setActiveItem('login');
      }
      return;
    }

    if (AUTH_VIEWS.includes(activeItem)) {
      setActiveItem('dashboard');
    }
  }, [session, loading, activeItem]);
  */

  // TEMPORARY AUTH BYPASS
  /*
  if (loading) {
    return <AuthLoading />;
  }

  if (!session) {
    if (activeItem === 'signup') {
      return <SignupPage onNavigate={setActiveItem} />;
    }
    return <LoginPage onNavigate={setActiveItem} />;
  }
  */

  // TEMPORARY AUTH BYPASS
  return (
    <AuthenticatedApp
      activeItem={activeItem === 'login' || activeItem === 'signup' ? 'dashboard' : activeItem}
      onNavigate={setActiveItem}
      onLoggedOut={() => setActiveItem('dashboard')}
    />
  );
}
