import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthLoading from './components/AuthLoading';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthenticatedApp from './AuthenticatedApp';
import './styles/dashboard.css';

const AUTH_VIEWS = ['login', 'signup'];

export default function App() {
  const { session, loading } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');

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

  if (loading) {
    return <AuthLoading />;
  }

  if (!session) {
    if (activeItem === 'signup') {
      return <SignupPage onNavigate={setActiveItem} />;
    }
    return <LoginPage onNavigate={setActiveItem} />;
  }

  return (
    <AuthenticatedApp
      activeItem={activeItem}
      onNavigate={setActiveItem}
      onLoggedOut={() => setActiveItem('login')}
    />
  );
}
