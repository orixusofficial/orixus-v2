import { useMemo } from 'react';
import '../styles/dashboard.css';

const MOTIVATIONS = [
  "Consistency compounds silently.",
  "Discipline survives when motivation disappears.",
  "Your future is built by repeated actions.",
  "Identity is earned daily.",
  "The version of you you want to become would not quit here.",
  "Excellence is not an act, but a habit.",
];

export default function DashboardOverview({ habits, completionData, onNavigate, onOpenAddHabit }) {
  const quote = useMemo(() => {
    return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  }, []);

  // Compute metrics dynamically from the global state
  const metrics = useMemo(() => {
    if (!habits.length) return { score: 0, streak: 0, rate: 0 };

    // Calculate dynamic stats
    let totalDone = 0;
    let totalActivePossible = 0;
    
    // We'll compute for the last 30 days of possible tracking
    const today = new Date();
    today.setHours(0,0,0,0);
    const pastDays = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - 29 + i);
      pastDays.push(d);
    }

    const dateKeyStr = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const isBefore = (dateA, dateB) => {
      const a = new Date(dateA);
      const b = new Date(dateB);
      a.setHours(0,0,0,0);
      b.setHours(0,0,0,0);
      return a < b;
    };

    habits.forEach((habit) => {
      pastDays.forEach((day) => {
        if (!isBefore(day, habit.createdAt)) {
          totalActivePossible++;
          if (completionData[`${habit.id}:${dateKeyStr(day)}`]) {
            totalDone++;
          }
        }
      });
    });

    const rate = totalActivePossible > 0 ? Math.round((totalDone / totalActivePossible) * 100) : 0;

    // Calculate consecutive streak
    let streak = 0;
    const isDayFullyCompleted = (date) => {
      const dateStr = dateKeyStr(date);
      const activeHabits = habits.filter(h => !isBefore(date, h.createdAt));
      if (activeHabits.length === 0) return false;
      return activeHabits.every(h => completionData[`${h.id}:${dateStr}`]);
    };

    let checkDate = new Date(today);
    if (isDayFullyCompleted(today)) {
      streak = 1;
      checkDate.setDate(today.getDate() - 1);
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (isDayFullyCompleted(yesterday)) {
        streak = 1;
        checkDate.setDate(today.getDate() - 2);
      }
    }

    if (streak > 0) {
      for (let i = 0; i < 365; i++) {
        if (isDayFullyCompleted(checkDate)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      score: totalDone,
      streak,
      rate
    };
  }, [habits, completionData]);

  // Compute stats per habit
  const habitsProgress = useMemo(() => {
    return habits.map((habit) => {
      // Find completions for this habit
      const count = Object.keys(completionData).filter(
        (key) => key.startsWith(`${habit.id}:`) && completionData[key]
      ).length;
      return {
        ...habit,
        completions: count,
      };
    });
  }, [habits, completionData]);

  return (
    <div className="dashboard-overview">
      <div className="dashboard-overview__header">
        <h1 className="dashboard-overview__title">Overview</h1>
        <p className="dashboard-overview__quote">“{quote}”</p>
      </div>

      <div className="dashboard-overview__grid">
        {/* Metric Cards */}
        <div className="dashboard-overview__stats">
          <div className="dashboard-overview__card">
            <span className="dashboard-overview__card-value">{metrics.score}</span>
            <span className="dashboard-overview__card-label">Discipline Score</span>
            <span className="dashboard-overview__card-desc">Overall completions registered</span>
          </div>

          <div className="dashboard-overview__card">
            <span className="dashboard-overview__card-value">{metrics.streak} <span className="dashboard-overview__card-unit">Days</span></span>
            <span className="dashboard-overview__card-label">Current Streak</span>
            <span className="dashboard-overview__card-desc">Consecutive perfect execution</span>
          </div>

          <div className="dashboard-overview__card">
            <span className="dashboard-overview__card-value">{metrics.rate}%</span>
            <span className="dashboard-overview__card-label">Execution Rate</span>
            <span className="dashboard-overview__card-desc">Last 30 days commitment ratio</span>
          </div>
        </div>

        {/* Habits Progress Panel */}
        <div className="dashboard-overview__panel">
          <div className="dashboard-overview__panel-header">
            <h2 className="dashboard-overview__panel-title">Active Commitments</h2>
            <button 
              className="dashboard-overview__action-btn"
              onClick={onOpenAddHabit}
            >
              + New Habit
            </button>
          </div>

          {habitsProgress.length === 0 ? (
            <div className="dashboard-overview__empty">
              <p>No active commitments. Establish your rules to begin.</p>
              <button className="dashboard-overview__btn" onClick={onOpenAddHabit}>Commit Now</button>
            </div>
          ) : (
            <div className="dashboard-overview__habits-list">
              {habitsProgress.map((habit) => (
                <div key={habit.id} className="dashboard-overview__habit-item">
                  <div className="dashboard-overview__habit-info">
                    <span className="dashboard-overview__habit-label">{habit.label}</span>
                    <span className="dashboard-overview__habit-stats">{habit.completions} completions</span>
                  </div>
                  <div className="dashboard-overview__progress-track">
                    <div 
                      className="dashboard-overview__progress-bar"
                      style={{ width: `${Math.min(100, Math.max(5, (habit.completions / 30) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="dashboard-overview__footer">
            <button 
              className="dashboard-overview__matrix-link"
              onClick={() => onNavigate('habits')}
            >
              Access Discipline Matrix &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
