import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth-modal.css';

const GoogleIcon = () => (
  <svg className="auth-modal__google-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

function SignUpView({ onSwitchToLogin, onSuccess, onClose }) {
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim())    { setError('Please enter your email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const data = await signUp(email.trim(), password, fullName.trim());
      // If session exists immediately — email confirmation is disabled
      if (data?.session) {
        onSuccess?.();
      } else {
        // Email confirmation required
        setInfo('Account created! Check your email to confirm your address, then log in.');
      }
    } catch (err) {
      const msg = err.message ?? 'Could not create account.';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Try logging in instead.');
      } else if (msg.toLowerCase().includes('invalid email')) {
        setError('Please enter a valid email address.');
      } else if (msg.toLowerCase().includes('weak password') || msg.toLowerCase().includes('password')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // OAuth redirects away, so no onSuccess call needed here
    } catch (err) {
      setError(err.message ?? 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  return (
    <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>
      <div className="auth-modal__field">
        <label className="auth-modal__label" htmlFor="auth-fullname">Full Name</label>
        <input
          id="auth-fullname"
          ref={nameRef}
          className={`auth-modal__input${error && !fullName.trim() ? ' auth-modal__input--error' : ''}`}
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading || googleLoading}
        />
      </div>

      <div className="auth-modal__field">
        <label className="auth-modal__label" htmlFor="auth-signup-email">Email</label>
        <input
          id="auth-signup-email"
          className="auth-modal__input"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || googleLoading}
        />
      </div>

      <div className="auth-modal__field">
        <label className="auth-modal__label" htmlFor="auth-signup-password">Password</label>
        <input
          id="auth-signup-password"
          className="auth-modal__input"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading || googleLoading}
        />
      </div>

      {error && <p className="auth-modal__error" role="alert">{error}</p>}
      {info  && <p className="auth-modal__info"  role="status">{info}</p>}

      <button
        className="auth-modal__submit"
        type="submit"
        disabled={loading || googleLoading}
        id="auth-signup-submit"
      >
        {loading ? <><span className="auth-modal__spinner" />Creating…</> : 'Create Account'}
      </button>

      <div className="auth-modal__divider">
        <span className="auth-modal__divider-text">or</span>
      </div>

      <button
        className="auth-modal__google-btn"
        type="button"
        onClick={handleGoogle}
        disabled={loading || googleLoading}
        id="auth-signup-google"
      >
        {googleLoading ? <><span className="auth-modal__spinner" style={{ borderTopColor: 'var(--color-text-secondary)' }} />Redirecting…</> : <><GoogleIcon />Sign up with Google</>}
      </button>

      <p className="auth-modal__switch">
        Already have an account?{' '}
        <button type="button" className="auth-modal__switch-link" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </form>
  );
}

function LogInView({ onSwitchToSignUp, onSuccess }) {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim())    { setError('Please enter your email address.'); return; }
    if (!password)        { setError('Please enter your password.'); return; }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      onSuccess?.();
    } catch (err) {
      const msg = err.message ?? 'Could not log in.';
      if (msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('invalid credentials') || msg.toLowerCase().includes('wrong')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Your email is not confirmed. Check your inbox and confirm before logging in.');
      } else if (msg.toLowerCase().includes('too many requests')) {
        setError('Too many attempts. Please wait a moment before trying again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message ?? 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  return (
    <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>
      <div className="auth-modal__field">
        <label className="auth-modal__label" htmlFor="auth-login-email">Email</label>
        <input
          id="auth-login-email"
          ref={emailRef}
          className="auth-modal__input"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || googleLoading}
        />
      </div>

      <div className="auth-modal__field">
        <label className="auth-modal__label" htmlFor="auth-login-password">Password</label>
        <input
          id="auth-login-password"
          className="auth-modal__input"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading || googleLoading}
        />
      </div>

      {error && <p className="auth-modal__error" role="alert">{error}</p>}

      <button
        className="auth-modal__submit"
        type="submit"
        disabled={loading || googleLoading}
        id="auth-login-submit"
      >
        {loading ? <><span className="auth-modal__spinner" />Logging in…</> : 'Log In'}
      </button>

      <div className="auth-modal__divider">
        <span className="auth-modal__divider-text">or</span>
      </div>

      <button
        className="auth-modal__google-btn"
        type="button"
        onClick={handleGoogle}
        disabled={loading || googleLoading}
        id="auth-login-google"
      >
        {googleLoading ? <><span className="auth-modal__spinner" style={{ borderTopColor: 'var(--color-text-secondary)' }} />Redirecting…</> : <><GoogleIcon />Sign in with Google</>}
      </button>

      <p className="auth-modal__switch">
        Don&apos;t have an account?{' '}
        <button type="button" className="auth-modal__switch-link" onClick={onSwitchToSignUp}>
          Sign Up
        </button>
      </p>
    </form>
  );
}

/**
 * AuthModal — centered overlay popup with Sign Up / Log In tabs.
 *
 * Props:
 *   isOpen      {boolean}              — whether modal is visible
 *   defaultTab  {'signup'|'login'}     — which tab to start on
 *   onClose     {() => void}           — called to dismiss the modal
 *   onSuccess   {() => void}           — called after successful auth
 */
export default function AuthModal({ isOpen, defaultTab = 'signup', onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const overlayRef = useRef(null);

  // Sync tab when modal is opened with a different default
  useEffect(() => {
    if (isOpen) setActiveTab(defaultTab);
  }, [isOpen, defaultTab]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      className="auth-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={activeTab === 'signup' ? 'Create Account' : 'Log In'}
    >
      <div className="auth-modal">
        {/* Close button */}
        <button
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Close"
          type="button"
          id="auth-modal-close"
        >
          ×
        </button>

        {/* Orixus logo */}
        <span className="auth-modal__logo">Orixus.</span>

        {/* Tab switcher */}
        <div className="auth-modal__tabs" role="tablist">
          <button
            className={`auth-modal__tab${activeTab === 'signup' ? ' auth-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('signup')}
            role="tab"
            aria-selected={activeTab === 'signup'}
            id="auth-tab-signup"
            type="button"
          >
            Sign Up
          </button>
          <button
            className={`auth-modal__tab${activeTab === 'login' ? ' auth-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('login')}
            role="tab"
            aria-selected={activeTab === 'login'}
            id="auth-tab-login"
            type="button"
          >
            Log In
          </button>
        </div>

        {/* Views */}
        {activeTab === 'signup' ? (
          <SignUpView
            onSwitchToLogin={() => setActiveTab('login')}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        ) : (
          <LogInView
            onSwitchToSignUp={() => setActiveTab('signup')}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
}
