import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth-modal.css';

const LOGIN_ATTEMPTS_KEY = 'orixus_login_attempts';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const RESEND_SECONDS = 60;

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
    <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>
      <div className="auth-modal__verify-copy">
        <h3>Verify your email</h3>
        <p>Check your email for a 6 digit OTP code sent to {email}.</p>
      </div>

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

function SignUpView({ onSwitchToLogin, onVerificationRequired }) {
  const { signUp, signInWithGoogle } = useAuth();
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
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (event) => {
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
      onVerificationRequired?.(email.trim());
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
              onClick={onSwitchToLogin}
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
        id="auth-signup-submit"
      >
        {loading ? <><span className="auth-modal__spinner" />Creating...</> : 'Create Account'}
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
        {googleLoading ? (
          <><span className="auth-modal__spinner" style={{ borderTopColor: 'var(--color-text-secondary)' }} />Redirecting...</>
        ) : (
          <><GoogleIcon />Sign up with Google</>
        )}
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [attemptState, setAttemptState] = useState(() => readLoginAttempts());
  const [now, setNow] = useState(0);
  const emailRef = useRef(null);

  const lockedUntil = attemptState.lockedUntil || 0;
  const currentTime = now || 0;
  const isLocked = lockedUntil > currentTime && lockedUntil > 0;
  const lockRemaining = Math.max(0, lockedUntil - currentTime);
  const attemptsRemaining = Math.max(0, MAX_LOGIN_ATTEMPTS - (attemptState.count || 0));

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

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

  const handleSubmit = async (event) => {
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
      onSuccess?.();
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
              onClick={onSwitchToSignUp}
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

      <div className="auth-modal__field auth-modal__field--checkbox">
        <label className="auth-modal__checkbox-label">
          <input
            type="checkbox"
            className="auth-modal__checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={loading || googleLoading || isLocked}
          />
          <span>Remember me for 30 days</span>
        </label>
      </div>

      <button
        className="auth-modal__submit"
        type="submit"
        disabled={loading || googleLoading || isLocked}
        id="auth-login-submit"
      >
        {loading ? <><span className="auth-modal__spinner" />Logging in...</> : 'Log In'}
      </button>

      <div className="auth-modal__divider">
        <span className="auth-modal__divider-text">or</span>
      </div>

      <button
        className="auth-modal__google-btn"
        type="button"
        onClick={handleGoogle}
        disabled={loading || googleLoading || isLocked}
        id="auth-login-google"
      >
        {googleLoading ? (
          <><span className="auth-modal__spinner" style={{ borderTopColor: 'var(--color-text-secondary)' }} />Redirecting...</>
        ) : (
          <><GoogleIcon />Sign in with Google</>
        )}
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

export default function AuthModal({ isOpen, defaultTab = 'signup', onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [verificationEmail, setVerificationEmail] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setTimeout(() => {
      setActiveTab(defaultTab);
      setVerificationEmail('');
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      className="auth-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={verificationEmail ? 'Verify your email' : activeTab === 'signup' ? 'Create Account' : 'Log In'}
    >
      <div className="auth-modal">
        <button
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Close"
          type="button"
          id="auth-modal-close"
        >
          &times;
        </button>

        <img src="/RB logo.svg" alt="Orixus" className="auth-modal__logo" />

        {!verificationEmail && (
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
        )}

        {verificationEmail ? (
          <VerifyEmailView email={verificationEmail} onSuccess={onSuccess} />
        ) : activeTab === 'signup' ? (
          <SignUpView
            onSwitchToLogin={() => setActiveTab('login')}
            onVerificationRequired={setVerificationEmail}
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
