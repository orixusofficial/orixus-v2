import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';

export default function LogoutPage({ onNavigate, onLoggedOut }) {
  const { signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signOut();
      onLoggedOut?.();
    } catch (err) {
      setError(err.message ?? 'Could not end session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-overview">
      <h1 className="dashboard-overview__title">Logout Protocol</h1>
      <p className="dashboard-overview__quote">“Secure your post before leaving.”</p>
      <div className="dashboard-overview__panel" style={{ marginTop: '20px', maxWidth: '400px' }}>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Terminate your active session on this device?
        </p>
        {error && <p className="auth-form__error">{error}</p>}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            type="button"
            className="dashboard-overview__btn"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
            onClick={() => onNavigate('dashboard')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dashboard-overview__btn"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? 'Securing…' : 'Confirm Exit'}
          </button>
        </div>
      </div>
    </div>
  );
}
