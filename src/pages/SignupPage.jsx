import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import '../styles/auth-modal.css';

const RESEND_SECONDS = 60;

const GoogleIcon = () => (
  <span className="auth-modal__google-mark" aria-hidden="true">G</span>
);

function OrixusLogo({ className = '' }) {
  return (
    <div className={className}>
      <img src="/RB logo.svg" alt="Orixus" />
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

function getPasswordRules(password) {
  return [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'number', label: 'At least 1 number', met: /\d/.test(password) },
    { id: 'special', label: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(password) },
  ];
}

function getPasswordStrength(password) {
  if (!password) {
    return { level: 0, label: '', className: 'weak' };
  }

  const score = getPasswordRules(password).filter((rule) => rule.met).length;
  if (score <= 1) return { level: 1, label: 'Weak', className: 'weak' };
  if (score === 2) return { level: 2, label: 'Fair', className: 'fair' };
  if (score === 3) return { level: 3, label: 'Strong', className: 'strong' };
  return { level: 4, label: 'Very Strong', className: 'very-strong' };
}

function PasswordStrengthChecker({ password }) {
  if (!password) return null;

  const rules = getPasswordRules(password);
  const strength = getPasswordStrength(password);

  return (
    <div className="auth-modal__password-strength">
      <div className="auth-modal__strength-row">
        <div className="auth-modal__strength-track" aria-hidden="true">
          <span
            className={`auth-modal__strength-fill auth-modal__strength-fill--${strength.className}`}
            style={{ width: `${strength.level * 25}%` }}
          />
        </div>
        <span className={`auth-modal__strength-label auth-modal__strength-label--${strength.className}`}>
          {strength.label}
        </span>
      </div>
      <ul className="auth-modal__password-rules">
        {rules.map((rule) => (
          <li className={rule.met ? 'is-met' : ''} key={rule.id}>
            <span aria-hidden="true">{rule.met ? '+' : '-'}</span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OtpInput({ value, onChange, disabled }) {
  const inputsRef = useRef([]);

  const setDigit = (index, nextValue) => {
    const digit = nextValue.replace(/\D/g, '').slice(-1);
    const next = value.padEnd(6, ' ').split('');
    next[index] = digit || ' ';
    onChange(next.join('').replace(/\s/g, '').slice(0, 6));

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="auth-modal__otp-inputs" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          aria-label={`OTP digit ${index + 1}`}
          className="auth-modal__otp-input"
          disabled={disabled}
          inputMode="numeric"
          key={index}
          maxLength={1}
          onChange={(event) => setDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type="text"
          value={value[index] || ''}
        />
      ))}
    </div>
  );
}

function VerifyEmailView({ email, onSuccess }) {
  const { verifyEmailOtp, resendSignupOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (resendCountdown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (otp.length !== 6) {
      setError('Enter the 6 digit code from your email.');
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOtp(email, otp);
      onSuccess?.();
    } catch {
      setError('Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || resending) return;
    setError('');
    setInfo('');
    setResending(true);
    try {
      await resendSignupOtp(email);
      setInfo('A new code has been sent.');
      setResendCountdown(RESEND_SECONDS);
    } catch (err) {
      setError(err.message ?? 'Could not resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <form className="auth-modal__form auth-modal__form--verify" onSubmit={handleSubmit} noValidate>
      <button
        type="button"
        className="auth-modal__back-btn"
        onClick={() => window.location.reload()}
      >
        ← Back
      </button>

      <OtpInput value={otp} onChange={setOtp} disabled={loading} />

      {error && <p className="auth-modal__error" role="alert">{error}</p>}
      {info && <p className="auth-modal__info" role="status">{info}</p>}

      <button className="auth-modal__submit" type="submit" disabled={loading || otp.length !== 6}>
        {loading ? <><span className="auth-modal__spinner" />Verifying...</> : 'Verify Email'}
      </button>

      <p className="auth-modal__switch">
        Did not receive it?{' '}
        <button
          type="button"
          className="auth-modal__switch-link"
          onClick={handleResend}
          disabled={resendCountdown > 0 || resending}
        >
          {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : resending ? 'Sending...' : 'Resend code'}
        </button>
      </p>
    </form>
  );
}

export default function SignupPage() {
  const { session, signUp, signInWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const nameRef = useRef(null);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (step === 2) {
      nameRef.current?.focus();
    }
  }, [step]);

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
    setInfo('');

    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (getPasswordStrength(password).level < 3) {
      setError('Password must be Strong or Very Strong to continue.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, fullName.trim());
      setVerificationEmail(email.trim());
      setStep(3);
    } catch (err) {
      const msg = err.message ?? 'Could not create account.';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setError('This email is already registered. Try logging in instead.');
      } else if (msg.toLowerCase().includes('invalid email')) {
        setError('Please enter a valid email address.');
      } else if (msg.toLowerCase().includes('weak password') || msg.toLowerCase().includes('password')) {
        setError('Password is too weak. Use a stronger password.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
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
            <p>Create the account that turns your habits, streaks, and reflections into a daily discipline system.</p>
          </div>
        </aside>

        <section className="auth-page__panel" aria-label="Create account">
          <div className="auth-modal">
          <header className="auth-modal__hero">
            <h1 className="auth-modal__hero-title">
              {step === 1 ? 'Create your account' : step === 2 ? 'Create your account' : 'Verify your email'}
            </h1>
            <p className="auth-modal__hero-subtitle">
              {step === 1 ? 'Start building consistency today.' : step === 2 ? 'Enter your details to create an account.' : `Enter the 6-digit code sent to ${verificationEmail}.`}
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
                Already have an account?{' '}
                <button type="button" className="auth-modal__switch-link" onClick={() => navigate('/login')}>
                  Log In
                </button>
              </p>
            </div>
          ) : step === 2 ? (
            <form className="auth-modal__form auth-modal__form--signup" onSubmit={handleEmailSubmit} noValidate>
              <button
                type="button"
                className="auth-modal__back-btn"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>

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
                  onChange={(event) => setFullName(event.target.value)}
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
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading || googleLoading}
                />
              </div>

              <div className="auth-modal__field">
                <label className="auth-modal__label" htmlFor="auth-signup-password">Password</label>
                <div className="auth-modal__password-wrapper">
                  <input
                    id="auth-signup-password"
                    className="auth-modal__input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading || googleLoading}
                  />
                  <button
                    type="button"
                    className="auth-modal__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || googleLoading}
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
                <PasswordStrengthChecker password={password} />
              </div>

              <div className="auth-modal__field">
                <label className="auth-modal__label" htmlFor="auth-signup-confirm-password">Confirm Password</label>
                <div className="auth-modal__password-wrapper">
                  <input
                    id="auth-signup-confirm-password"
                    className={`auth-modal__input${confirmPassword && password !== confirmPassword ? ' auth-modal__input--error' : ''}`}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={loading || googleLoading}
                  />
                  <button
                    type="button"
                    className="auth-modal__password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading || googleLoading}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
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
                  {confirmPassword && password === confirmPassword && (
                    <span className="auth-modal__password-check">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="auth-modal__field-error">Passwords do not match</p>
                )}
              </div>

              {error && (
                <p className="auth-modal__error" role="alert">
                  {error}
                  {error.includes('already registered') && (
                    <button
                      type="button"
                      className="auth-modal__error-link"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </button>
                  )}
                </p>
              )}
              {info && <p className="auth-modal__info" role="status">{info}</p>}

              <div className="auth-modal__field auth-modal__field--checkbox">
                <label className="auth-modal__checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-modal__checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    disabled={loading || googleLoading}
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </div>

              <button
                className="auth-modal__submit"
                type="submit"
                disabled={loading || googleLoading || !termsAccepted}
              >
                {loading ? <><span className="auth-modal__spinner" />Creating...</> : 'Create Account'}
              </button>
            </form>
          ) : (
            <VerifyEmailView email={verificationEmail} onSuccess={() => navigate('/')} />
          )}
          </div>
        </section>
      </div>
    </div>
  );
}
