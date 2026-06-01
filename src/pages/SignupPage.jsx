import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';

export default function SignupPage({ onNavigate }) {
  const { signUp, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email.trim(), password);
      // Session is set automatically when email confirmation is off
    } catch (err) {
      setError(err.message ?? 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="auth-shell">
        <div className="auth-shell__inner">
          <h1 className="dashboard-overview__title">Configuration Required</h1>
          <p className="auth-shell__hint">Set Supabase env vars in <code>.env</code> to register.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__inner">
        <h1 className="dashboard-overview__title">Operator Registration</h1>
        <p className="dashboard-overview__quote">“Commit to the system. Your data stays yours.”</p>

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
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="dashboard-modal__input-group">
              <input
                type="password"
                className="dashboard-modal__input"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            {error && <p className="auth-form__error">{error}</p>}
            <button
              type="submit"
              className="dashboard-overview__btn auth-form__submit"
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Establish Account'}
            </button>
          </form>
          <p className="auth-form__footer">
            Already registered?{' '}
            <button type="button" className="auth-form__link" onClick={() => onNavigate('login')}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
