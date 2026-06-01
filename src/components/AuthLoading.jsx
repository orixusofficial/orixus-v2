import '../styles/dashboard.css';

export default function AuthLoading() {
  return (
    <div className="auth-shell">
      <div className="auth-shell__inner">
        <p className="auth-shell__status">Establishing secure session…</p>
      </div>
    </div>
  );
}
