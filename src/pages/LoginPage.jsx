import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import '../styles/auth-modal.css';

const LOGIN_ATTEMPTS_KEY = 'orixus_login_attempts';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

const GoogleIcon = () => (
  <span className="auth-modal__google-mark" aria-hidden="true">G</span>
);

function OrixusLogo({ className = '' }) {
  return (
    <div className={className}>
      <img src="/RB logo.svg" alt="Orixus" width="32" height="32" />
      <span style={{
        marginLeft: '10px',
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: '0.05em',
        fontFamily: 'var(--font-heading, "Barlow Condensed", sans-serif)',
        textTransform: 'uppercase'
      }}>
        Orixus
      </span>
    </div>
  );
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function readLoginAttempts() {
  try {
    const value = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{"count":0,"lockedUntil":0}');
    if (value.lockedUntil && value.lockedUntil <= Date.now()) {
      return { count: 0, lockedUntil: 0 };
    }
    return value;
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function writeLoginAttempts(next) {
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(next));
}

function clearLoginAttempts() {
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
}

export default function LoginPage() {
  const { session, signIn, signInWithGoogle, resetPassword, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [attemptState, setAttemptState] = useState(() => readLoginAttempts());
  const [now, setNow] = useState(0);
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const emailRef = useRef(null);

  const lockedUntil = attemptState.lockedUntil || 0;
  const currentTime = now || 0;
  const isLocked = lockedUntil > currentTime && lockedUntil > 0;
  const lockRemaining = Math.max(0, lockedUntil - currentTime);
  const attemptsRemaining = Math.max(0, MAX_LOGIN_ATTEMPTS - (attemptState.count || 0));

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (step === 2) {
      emailRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (!lockedUntil) return undefined;
    const timer = window.setInterval(() => {
      const nextNow = Date.now();
      setNow(nextNow);
      if (lockedUntil <= nextNow) {
        const next = { count: 0, lockedUntil: 0 };
        writeLoginAttempts(next);
        setAttemptState(next);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const recordFailedAttempt = () => {
    const current = readLoginAttempts();
    const nextCount = (current.count || 0) + 1;
    const next = {
      count: nextCount,
      lockedUntil: nextCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0,
    };
    writeLoginAttempts(next);
    setAttemptState(next);
    setNow(Date.now());
    return next;
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

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const lockCheck = readLoginAttempts();
    const lockRemainingNow = Math.max(0, (lockCheck.lockedUntil || 0) - Date.now());
    if (lockRemainingNow > 0) {
      setAttemptState(lockCheck);
      setNow(Date.now());
      setError(`Too many failed attempts. Try again in ${formatCountdown(lockRemainingNow)}.`);
      return;
    }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    try {
      await signIn(email.trim(), password, rememberMe);
      clearLoginAttempts();
      setAttemptState({ count: 0, lockedUntil: 0 });
    } catch (err) {
      const nextAttemptState = recordFailedAttempt();
      const msg = err.message ?? 'Could not log in.';
      if (nextAttemptState.lockedUntil) {
        setError(`Too many failed attempts. Try again in ${formatCountdown(LOCKOUT_MS)}.`);
      } else if (
        msg.toLowerCase().includes('invalid login') ||
        msg.toLowerCase().includes('invalid credentials') ||
        msg.toLowerCase().includes('wrong')
      ) {
        const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - (nextAttemptState.count || 0));
        setError(`Incorrect password. ${remaining} attempts remaining before lockout.`);
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Your email is not confirmed. Check your inbox and confirm before logging in.');
      } else if (msg.toLowerCase().includes('too many requests')) {
        setError('Too many attempts. Please wait a moment before trying again.');
      } else if (
        msg.toLowerCase().includes('user not found') ||
        msg.toLowerCase().includes('no account')
      ) {
        setError('No account found with this email. Try signing up instead.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setResetLoading(true);
    setError('');
    setResetMessage('');
    try {
      await resetPassword(email.trim());
      setResetMessage('Password reset link sent to your email.');
    } catch (err) {
      setError(err.message ?? 'Could not send reset link.');
    } finally {
      setResetLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="auth-shell">
        <div className="auth-shell__inner">
          <h1 className="dashboard-overview__title">Configuration Required</h1>
          <p className="dashboard-overview__quote">"Supply your Supabase parameters to continue."</p>
          <p className="auth-shell__hint">
            Copy <code>.env.example</code> to <code>.env</code> and set <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <aside className="auth-page__brand" aria-label="Orixus">
          <div className="auth-page__brand-lockup">
            <OrixusLogo className="auth-page__brand-lockup-inner" />
          </div>
          <div className="auth-page__brand-copy">
            <h2>Build discipline.<br />Master consistency.</h2>
            <p>Return to the system that keeps your habits, streaks, and daily commitments moving forward.</p>
          </div>
        </aside>

        <section className="auth-page__panel" aria-label="Log in">
          <div className="auth-modal">
          <header className="auth-modal__hero">
            <h1 className="auth-modal__hero-title">
              {step === 1 ? 'Welcome Back' : 'Welcome Back'}
            </h1>
            <p className="auth-modal__hero-subtitle">
              {step === 1 ? 'Continue building discipline.' : 'Enter your credentials to log in.'}
            </p>
          </header>

          {step === 1 ? (
            <div className="auth-modal__method-selection">
              <button
                className="auth-modal__google-btn auth-modal__google-btn--large"
                onClick={handleGoogle}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <><span className="auth-modal__spinner" style={{ borderTopColor: 'var(--color-text-secondary)' }} />Redirecting...</>
                ) : (
                  <><GoogleIcon />Continue with Google</>
                )}
              </button>

              <div className="auth-modal__divider">
                <span className="auth-modal__divider-text">OR</span>
              </div>

              <button
                className="auth-modal__email-btn"
                onClick={() => setStep(2)}
              >
                Continue with Email
              </button>

              <p className="auth-modal__switch">
                Don&apos;t have an account?{' '}
                <button type="button" className="auth-modal__switch-link" onClick={() => navigate('/signup')}>
                  Sign Up
                </button>
              </p>
            </div>
          ) : (
            <form className="auth-modal__form auth-modal__form--login" onSubmit={handleEmailSubmit} noValidate>
              <button
                type="button"
                className="auth-modal__back-btn"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>

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
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading || googleLoading || isLocked}
                />
              </div>

              <div className="auth-modal__field">
                <label className="auth-modal__label" htmlFor="auth-login-password">Password</label>
                <div className="auth-modal__password-wrapper">
                  <input
                    id="auth-login-password"
                    className="auth-modal__input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading || googleLoading || isLocked}
                  />
                  <button
                    type="button"
                    className="auth-modal__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || googleLoading || isLocked}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="auth-modal__error" role="alert">
                  {error}
                  {error.includes('No account found') && (
                    <button
                      type="button"
                      className="auth-modal__error-link"
                      onClick={() => navigate('/signup')}
                    >
                      Sign Up
                    </button>
                  )}
                </p>
              )}
              {isLocked && (
                <p className="auth-modal__error" role="alert">
                  Too many failed attempts. Try again in {formatCountdown(lockRemaining)}.
                </p>
              )}
              {!isLocked && attemptState.count >= 3 && attemptState.count < MAX_LOGIN_ATTEMPTS && (
                <p className="auth-modal__info" role="status">
                  {attemptsRemaining} attempts remaining
                </p>
              )}
              {resetMessage && (
                <p className="auth-modal__info" role="status">
                  {resetMessage}
                </p>
              )}

              <div className="auth-modal__field auth-modal__field--checkbox">
                <div className="auth-modal__remember-row">
                  <label className="auth-modal__checkbox-label">
                    <input
                      type="checkbox"
                      className="auth-modal__checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      disabled={loading || googleLoading || isLocked}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="auth-modal__forgot-link"
                    onClick={handleForgotPassword}
                    disabled={resetLoading || loading || googleLoading || isLocked}
                  >
                    {resetLoading ? 'Sending…' : 'Forgot password?'}
                  </button>
                </div>
              </div>

              <button
                className="auth-modal__submit"
                type="submit"
                disabled={loading || googleLoading || isLocked}
              >
                {loading ? <><span className="auth-modal__spinner" />Logging in...</> : 'Log In'}
              </button>
            </form>
          )}
          </div>
        </section>
      </div>
    </div>
  );
}
