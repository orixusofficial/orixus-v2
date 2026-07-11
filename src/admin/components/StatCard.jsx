export default function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value}</div>
      </div>
    </div>
  );
}
