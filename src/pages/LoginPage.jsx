import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';

export default function LoginPage({ onNavigate }) {
  const { signIn, resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err.message ?? 'Authentication failed.');
    } finally {
      setSubmitting(false);
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
          <p className="dashboard-overview__quote">“Supply your Supabase parameters to continue.”</p>
          <p className="auth-shell__hint">
            Copy <code>.env.example</code> to <code>.env</code> and set <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__inner">
        <h1 className="dashboard-overview__title">Login Protocol</h1>
        <p className="dashboard-overview__quote">“Authenticate to sync your parameters.”</p>

        <div className="dashboard-overview__panel auth-panel">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="dashboard-modal__input-group">
              <input
                type="email"
                className="dashboard-modal__input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="dashboard-modal__input-group">
              <input
                type="password"
                className="dashboard-modal__input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="auth-form__error">{error}</p>}
            {resetMessage && <p className="auth-form__success">{resetMessage}</p>}
            <button
              type="submit"
              className="dashboard-overview__btn auth-form__submit"
              disabled={submitting}
            >
              {submitting ? 'Authenticating…' : 'Access Account'}
            </button>
          </form>
          <div className="auth-form__row">
            <label className="auth-form__checkbox-label">
              <input
                type="checkbox"
                className="auth-form__checkbox"
                disabled={submitting}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="auth-form__link auth-form__link--forgot"
              onClick={handleForgotPassword}
              disabled={resetLoading}
            >
              {resetLoading ? 'Sending…' : 'Forgot password?'}
            </button>
          </div>
          <p className="auth-form__footer">
            No account?{' '}
            <button type="button" className="auth-form__link" onClick={() => onNavigate('signup')}>
              Initialize operator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
