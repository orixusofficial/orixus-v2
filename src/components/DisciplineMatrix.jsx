import { useState, useMemo, useCallback } from 'react';
import '../styles/matrix.css';

const STATIC_RANGES = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
];

/**
 * Generate an array of Date objects starting from TODAY and continuing FORWARD.
 */
function getDays(count) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

/**
 * Turn a Date into a stable string key: "YYYY-MM-DD"
 */
function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format a Date for tooltip display
 */
function formatTooltipDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Check if a date is today.
 */
function isToday(date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/**
 * Check if date A is before date B (ignoring time)
 */
function isBefore(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return a < b;
}

/**
 * STRICT ANALYTICS LOGIC
 */
function computeStats(habits, days, completionData) {
  if (!habits.length || !days.length) return { totalDone: 0, rate: 0, streak: 0 };

  let totalDone = 0;
  let totalActivePossible = 0;

  habits.forEach((habit) => {
    days.forEach((day) => {
      const active = !isBefore(day, habit.createdAt);
      if (active) {
        totalActivePossible++;
        if (completionData[`${habit.id}:${dateKey(day)}`]) {
          totalDone++;
        }
      }
    });
  });

  const rate = totalActivePossible > 0 ? Math.round((totalDone / totalActivePossible) * 100) : 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = dateKey(today);
  const todayDone = habits.every(h => {
    const active = !isBefore(today, h.createdAt);
    return !active || completionData[`${h.id}:${todayStr}`];
  });
  
  if (todayDone) {
    streak++;
  }

  let currentCheck = new Date(today);
  currentCheck.setDate(today.getDate() - 1);

  for (let i = 0; i < 365; i++) {
    const checkStr = dateKey(currentCheck);
    const allDone = habits.length > 0 && habits.every(h => {
      const active = !isBefore(currentCheck, h.createdAt);
      return !active || completionData[`${h.id}:${checkStr}`];
    });

    if (allDone) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    } else {
      if (streak > 0 || i > 0) break; 
      currentCheck.setDate(currentCheck.getDate() - 1);
    }
  }

  return { totalDone, rate, streak };
}

/* ---- Custom Duration Modal ---- */
function CustomDurationModal({ isOpen, onClose, onConfirm, initialValue }) {
  const [value, setValue] = useState(initialValue);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    if (value > 0) {
      setShowConfirm(true);
    }
  };

  const handleFinalConfirm = () => {
    onConfirm(Number(value));
    setShowConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="matrix-modal-overlay" onClick={handleClose}>
      <div className="matrix-modal" onClick={e => e.stopPropagation()}>
        <div className="matrix-modal__content">
          {!showConfirm ? (
            <>
              <h3 className="matrix-modal__title">Build Your System</h3>
              <p className="matrix-modal__motto">“A system only works if you commit to it.”</p>
              <div className="matrix-modal__input-group">
                <input 
                  type="number" 
                  className="matrix-modal__input" 
                  value={value} 
                  onChange={e => setValue(e.target.value)}
                  placeholder="Days"
                  autoFocus
                />
                <span className="matrix-modal__input-suffix">Days</span>
              </div>
              <div className="matrix-modal__actions">
                <button className="matrix-modal__btn matrix-modal__btn--secondary" onClick={handleClose}>Cancel</button>
                <button className="matrix-modal__btn matrix-modal__btn--primary" onClick={handleApply}>Apply</button>
              </div>
            </>
          ) : (
            <>
              <h3 className="matrix-modal__title">Are you sure?</h3>
              <p className="matrix-modal__desc">You are about to switch the Discipline Matrix to a <strong>{value}-day</strong> tracking window.</p>
              <div className="matrix-modal__actions">
                <button className="matrix-modal__btn matrix-modal__btn--secondary" onClick={() => setShowConfirm(false)}>Back</button>
                <button className="matrix-modal__btn matrix-modal__btn--primary" onClick={handleFinalConfirm}>Confirm</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Day column labels ---- */
function DayLabels({ days }) {
  const step = days.length <= 7 ? 1 : days.length <= 30 ? 5 : days.length <= 90 ? 10 : 30;

  return (
    <div className="matrix__day-labels">
      <div className="matrix__day-labels-spacer" />
      <div className="matrix__day-labels-cells">
        {days.map((day, i) => {
          const show = i % step === 0 || i === days.length - 1;
          return (
            <div className="matrix__day-label" key={i}>
              {show ? day.getDate() : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Main Component ---- */
export default function DisciplineMatrix({ habits, onRemoveHabit, onOpenAddHabit }) {
  const [range, setRange] = useState('30d');
  const [customDays, setCustomDays] = useState(365);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeDaysCount = useMemo(() => {
    const found = STATIC_RANGES.find((r) => r.key === range);
    return found ? found.days : customDays;
  }, [range, customDays]);

  const days = useMemo(() => getDays(activeDaysCount), [activeDaysCount]);

  const [completionData, setCompletionData] = useState({});

  const toggleCell = useCallback((habitId, date) => {
    const key = `${habitId}:${dateKey(date)}`;
    setCompletionData((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  }, []);

  const stats = useMemo(
    () => computeStats(habits, days, completionData),
    [habits, days, completionData]
  );

  return (
    <section className="matrix">
      <div className="matrix__header">
        <div className="matrix__header-left">
          <h2 className="matrix__title">Discipline Matrix</h2>
          <button 
            className="matrix__add-btn" 
            onClick={onOpenAddHabit}
            aria-label="Add habit"
          >
            + Add Habit
          </button>
        </div>
        
        <div className="matrix__range">
          {STATIC_RANGES.map((r) => (
            <button
              key={r.key}
              className={`matrix__range-btn${range === r.key ? ' matrix__range-btn--active' : ''}`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
          <button
            className={`matrix__range-btn${range === 'custom' ? ' matrix__range-btn--active' : ''}`}
            onClick={() => {
              setRange('custom');
              setIsModalOpen(true);
            }}
          >
            Custom
          </button>
        </div>
      </div>

      <div className="matrix__grid-wrapper">
        <div className="matrix__summary">
          <div className="matrix__stat">
            <span className="matrix__stat-value">{stats.totalDone}</span>
            <span className="matrix__stat-label">Discipline Score</span>
            <span className="matrix__stat-desc">Built through consistency</span>
          </div>
          <div className="matrix__stat">
            <span className="matrix__stat-value">{stats.streak}</span>
            <span className="matrix__stat-label">Current Streak</span>
            <span className="matrix__stat-desc">Momentum maintained</span>
          </div>
          <div className="matrix__stat">
            <span className="matrix__stat-value">{stats.rate}%</span>
            <span className="matrix__stat-label">Execution Rate</span>
            <span className="matrix__stat-desc">Daily commitments completed</span>
          </div>
        </div>

        <DayLabels days={days} />

        <div className="matrix__table">
          {habits.map((habit) => (
            <div className="matrix__row" key={habit.id}>
              <div className="matrix__label-group">
                <button 
                  className="matrix__remove-btn" 
                  onClick={() => onRemoveHabit(habit)}
                  aria-label="Remove habit"
                >
                  ×
                </button>
                <div className="matrix__label" title={habit.label}>
                  {habit.label}
                </div>
              </div>
              <div className="matrix__cells">
                {days.map((day, i) => {
                  const key = `${habit.id}:${dateKey(day)}`;
                  const done = !!completionData[key];
                  const today = isToday(day);
                  const inactive = isBefore(day, habit.createdAt);

                  let cellClass = 'matrix__cell';
                  if (done) cellClass += ' matrix__cell--done';
                  else if (inactive) cellClass += ' matrix__cell--inactive';
                  else if (!today && isBefore(day, new Date())) cellClass += ' matrix__cell--missed';
                  
                  if (today) cellClass += ' matrix__cell--today';

                  return (
                    <div
                      key={i}
                      className={cellClass}
                      onClick={() => !inactive && toggleCell(habit.id, day)}
                      role="button"
                      tabIndex={inactive ? -1 : 0}
                      onKeyDown={(e) => {
                        if (!inactive && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          toggleCell(habit.id, day);
                        }
                      }}
                    >
                      <div className="matrix__cell-inner" />
                      <div className="matrix__cell-tooltip">
                        {inactive ? 'Not yet established' : habit.label} · {formatTooltipDate(day)}{today ? ' · Today' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="matrix__legend">
          <div className="matrix__legend-item">
            <div className="matrix__legend-cell matrix__legend-cell--inactive" />
            <span className="matrix__legend-label">Pre-Habit</span>
          </div>
          <div className="matrix__legend-item">
            <div className="matrix__legend-cell matrix__legend-cell--empty" />
            <span className="matrix__legend-label">Missed</span>
          </div>
          <div className="matrix__legend-item">
            <div className="matrix__legend-cell matrix__legend-cell--filled" />
            <span className="matrix__legend-label">Done</span>
          </div>
        </div>
      </div>

      <CustomDurationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        initialValue={customDays}
        onConfirm={(val) => setCustomDays(val)}
      />
    </section>
  );
}
