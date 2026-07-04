import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';

export default function ResetPasswordPage({ onNavigateToLogin }) {
  const { updatePassword, signOut, isRecovery, isConfigured, session } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isRecovery) {
      setError('Invalid or expired recovery link. Please request a new password reset.');
    }
  }, [isRecovery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password.trim()) {
      setError('Please enter a new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const strength = getPasswordStrength(password);
    if (strength.level < 3) {
      setError('Password must be Strong or Very Strong to continue.');
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(async () => {
        await signOut();
        onNavigateToLogin?.();
      }, 2000);
    } catch (err) {
      const msg = err.message ?? 'Could not update password.';
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
        setError('This recovery link has expired or is invalid. Please request a new password reset.');
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
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

  if (!isRecovery) {
    return (
      <div className="auth-shell">
        <div className="auth-shell__inner">
          <h1 className="dashboard-overview__title">Invalid Recovery Link</h1>
          <p className="dashboard-overview__quote">"This password reset link is no longer valid."</p>
          <div className="dashboard-overview__panel auth-panel">
            {error && <p className="auth-form__error">{error}</p>}
            <button
              type="button"
              className="dashboard-overview__btn auth-form__submit"
              onClick={() => onNavigateToLogin?.()}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__inner">
        <h1 className="dashboard-overview__title">Reset Password</h1>
        <p className="dashboard-overview__quote">"Create a new password for your account."</p>

        <div className="dashboard-overview__panel auth-panel">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="dashboard-modal__input-group">
              <label className="dashboard-modal__label" htmlFor="reset-password">
                New Password
              </label>
              <div className="auth-modal__password-wrapper">
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  className="dashboard-modal__input"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="auth-modal__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
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

            <div className="dashboard-modal__input-group">
              <label className="dashboard-modal__label" htmlFor="reset-confirm-password">
                Confirm Password
              </label>
              <div className="auth-modal__password-wrapper">
                <input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="dashboard-modal__input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="auth-modal__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={submitting}
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
              </div>
            </div>

            {error && <p className="auth-form__error">{error}</p>}
            {success && <p className="auth-form__success">{success}</p>}

            <button
              type="submit"
              className="dashboard-overview__btn auth-form__submit"
              disabled={submitting}
            >
              {submitting ? 'Updating Password…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function getPasswordStrength(password) {
  if (!password) {
    return { level: 0, label: '', className: 'weak' };
  }

  const rules = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'number', label: 'At least 1 number', met: /\d/.test(password) },
    { id: 'special', label: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = rules.filter((rule) => rule.met).length;
  if (score <= 1) return { level: 1, label: 'Weak', className: 'weak' };
  if (score === 2) return { level: 2, label: 'Fair', className: 'fair' };
  if (score === 3) return { level: 3, label: 'Strong', className: 'strong' };
  return { level: 4, label: 'Very Strong', className: 'very-strong' };
}