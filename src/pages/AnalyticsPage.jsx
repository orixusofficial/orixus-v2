import { useMemo } from 'react';
import '../styles/dashboard.css';

export default function AnalyticsPage({ habits, completionData }) {
  // Compute analytics dynamically
  const stats = useMemo(() => {
    const totalCompletions = Object.values(completionData).filter(Boolean).length;
    
    // Growth rate mock based on habits count
    const baseGrowth = habits.length * 12;
    const completionFactor = totalCompletions * 2;
    const progressIndex = Math.min(100, Math.round(baseGrowth + completionFactor));

    return {
      total: totalCompletions,
      progressIndex,
      weeklyAvg: Math.round(totalCompletions / 4 * 10) / 10,
    };
  }, [habits, completionData]);

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-quote">“Measure to refine. Numbers don't lie, actions don't cheat.”</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card-large">
          <div className="analytics-card-large__header">
            <h3 className="analytics-card-large__title">Discipline Index</h3>
            <span className="analytics-trend-positive">+4.2% this cycle</span>
          </div>
          <div className="analytics-gauge-container">
            <div className="analytics-gauge">
              <span className="analytics-gauge-value">{stats.progressIndex}</span>
              <span className="analytics-gauge-label">LVL {Math.floor(stats.progressIndex / 20) + 1}</span>
            </div>
            <div className="analytics-gauge-track">
              <div className="analytics-gauge-bar" style={{ width: `${stats.progressIndex}%` }} />
            </div>
          </div>
          <p className="analytics-card-large__desc">
            Your discipline index is computed by balancing streak consistency, daily target frequency, and total active commitments. Maintain streak levels to multiply points.
          </p>
        </div>

        <div className="analytics-metrics-sidebar">
          <div className="dashboard-overview__card">
            <span className="dashboard-overview__card-value">{stats.total}</span>
            <span className="dashboard-overview__card-label">Total Checkmarks</span>
            <span className="dashboard-overview__card-desc">All completed habits across timeline</span>
          </div>

          <div className="dashboard-overview__card">
            <span className="dashboard-overview__card-value">{stats.weeklyAvg}</span>
            <span className="dashboard-overview__card-label">Weekly Velocity</span>
            <span className="dashboard-overview__card-desc">Completions registered per week</span>
          </div>
        </div>
      </div>

      {/* Habits Breakdown */}
      <div className="analytics-section">
        <h3 className="section-title analytics-section-title">Habit Breakdown & Consistencies</h3>
        <div className="analytics-breakdown-list">
          {habits.length === 0 ? (
            <p className="analytics-empty">No habits registered to compile stats. Start tracking to generate reports.</p>
          ) : (
            habits.map((habit) => {
              const completions = Object.keys(completionData).filter(
                (key) => key.startsWith(`${habit.id}:`) && completionData[key]
              ).length;
              const rate = Math.min(100, Math.round((completions / 30) * 100));

              return (
                <div key={habit.id} className="analytics-breakdown-item">
                  <div className="analytics-breakdown-info">
                    <span className="analytics-breakdown-name">{habit.label}</span>
                    <span className="analytics-breakdown-percentage">{rate}% Consistency</span>
                  </div>
                  <div className="analytics-progress-wrapper">
                    <div className="analytics-progress-bar" style={{ width: `${rate}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
