import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import '../styles/matrix.css';

const STATIC_RANGES = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
];

/**
 * Parse and normalize a habit's creation date.
 */
function getHabitStartDate(habit) {
  const date = new Date(habit.createdAt || habit.created_at);
  date.setHours(0, 0, 0, 0);
  return date;
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
 * Check if a date is in the future.
 */
function isFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d > today;
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
 * STRICT ANALYTICS LOGIC (DETERMINISTIC)
 */
function computeStats(habits, activeDaysCount, completionData) {
  if (!habits.length) return { totalDone: 0, rate: 0, streak: 0 };

  let totalDone = 0;
  let totalActivePossible = 0;

  habits.forEach((habit) => {
    const startDate = getHabitStartDate(habit);
    for (let i = 0; i < activeDaysCount; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);

      const active = !isFuture(cellDate);
      if (active) {
        totalActivePossible++;
        if (completionData[`${habit.id}:${dateKey(cellDate)}`]) {
          totalDone++;
        }
      }
    }
  });

  const rate = totalActivePossible > 0 ? Math.round((totalDone / totalActivePossible) * 100) : 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDayFullyCompleted = (date) => {
    const dateStr = dateKey(date);
    const activeHabits = habits.filter(h => !isBefore(date, getHabitStartDate(h)));
    if (activeHabits.length === 0) return false;
    return activeHabits.every(h => completionData[`${h.id}:${dateStr}`]);
  };

  const todayCompleted = isDayFullyCompleted(today);

  let checkDate = new Date(today);
  if (todayCompleted) {
    streak = 1;
    checkDate.setDate(today.getDate() - 1);
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (isDayFullyCompleted(yesterday)) {
      streak = 1;
      checkDate.setDate(today.getDate() - 2);
    } else {
      streak = 0;
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

  return { totalDone, rate, streak };
}

/* ---- Redesigned Premium Custom Duration Modal (Two-Stage Glassmorphism) ---- */
function CustomDurationModal({ isOpen, onClose, onConfirm, initialValue }) {
  const [value, setValue] = useState(initialValue);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (value > 0) {
      setStep(2);
    }
  };

  const handleFinalConfirm = () => {
    onConfirm(Number(value));
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const selectPreset = (presetDays) => {
    setValue(presetDays);
  };

  return (
    <div className="matrix-modal-overlay" onClick={handleClose}>
      <div className="matrix-modal" onClick={e => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <h3 className="matrix-modal__title">Set Your Discipline Timeline</h3>
            <p className="matrix-modal__subtitle">How long are you willing to stay committed?</p>

            <div className="matrix-modal__presets">
              <button className="matrix-modal__preset-btn" onClick={() => selectPreset(30)}>30 Days</button>
              <button className="matrix-modal__preset-btn" onClick={() => selectPreset(60)}>60 Days</button>
              <button className="matrix-modal__preset-btn" onClick={() => selectPreset(90)}>90 Days</button>
              <button className="matrix-modal__preset-btn" onClick={() => selectPreset(365)}>365 Days</button>
            </div>

            <div className="matrix-modal__input-group">
              <input
                type="number"
                className="matrix-modal__input"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Custom Timeline Days"
                min="1"
                autoFocus
              />
            </div>

            <div className="matrix-modal__actions">
              <button className="matrix-modal__btn matrix-modal__btn--secondary" onClick={handleClose}>
                Cancel
              </button>
              <button className="matrix-modal__btn matrix-modal__btn--primary" onClick={handleNext}>
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="matrix-modal__title">Are You Really Ready?</h3>
            <p className="matrix-modal__desc">
              This decision changes your discipline path. Weak goals create weak results.
            </p>

            <div className="matrix-modal__actions">
              <button className="matrix-modal__btn matrix-modal__btn--secondary" onClick={() => setStep(1)}>
                Go Back
              </button>
              <button className="matrix-modal__btn matrix-modal__btn--primary" onClick={handleFinalConfirm}>
                I’m Ready
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---- Day column labels ---- */
function DayLabels({ days, displayMode }) {
  const formatDate = (day, index) => {
    if (displayMode === 'number') {
      return `${index + 1}`;
    }
    return day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="matrix__day-labels">
      <div className="matrix__day-labels-spacer" />
      <div className="matrix__day-labels-cells">
        {days.map((day, i) => (
          <div className="matrix__day-label" key={i}>
            {formatDate(day, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Main Component ---- */
export default function DisciplineMatrix({
  habits,
  onRemoveHabit,
  onOpenAddHabit,
  completionData,
  setCompletionData,
  onToggleCompletion,
  customDays,
  setCustomDays,
  range,
  setRange,
  habitDisplayMode = 'date'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // Set initial scroll position to 0 so day 1 is always visible first
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  const activeDaysCount = useMemo(() => {
    const found = STATIC_RANGES.find((r) => r.key === range);
    return found ? found.days : customDays;
  }, [range, customDays]);

  const headerDays = useMemo(() => {
    if (habits.length > 0) {
      const firstHabitStart = getHabitStartDate(habits[0]);
      const result = [];
      for (let i = 0; i < activeDaysCount; i++) {
        const d = new Date(firstHabitStart);
        d.setDate(firstHabitStart.getDate() + i);
        result.push(d);
      }
      return result;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = [];
      for (let i = 0; i < activeDaysCount; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        result.push(d);
      }
      return result;
    }
  }, [habits, activeDaysCount]);

  const toggleCell = useCallback((habitId, date) => {
    const dk = dateKey(date);
    const key = `${habitId}:${dk}`;
    const nextCompleted = !completionData[key];

    if (onToggleCompletion) {
      onToggleCompletion(habitId, dk, nextCompleted);
      return;
    }

    setCompletionData((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  }, [completionData, onToggleCompletion, setCompletionData]);

  const stats = useMemo(
    () => computeStats(habits, activeDaysCount, completionData),
    [habits, activeDaysCount, completionData]
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

      {/* Modern SaaS 3-Card Metrics Grid */}
      <div className="matrix__stats-grid">
        <div className="matrix__stat-card">
          <span className="matrix__stat-card-value">{stats.totalDone}</span>
          <span className="matrix__stat-card-label">Discipline Score</span>
          <span className="matrix__stat-card-desc">Built through consistency</span>
        </div>
        <div className="matrix__stat-card">
          <span className="matrix__stat-card-value">{stats.streak}</span>
          <span className="matrix__stat-card-label">Current Streak</span>
          <span className="matrix__stat-card-desc">Momentum maintained</span>
        </div>
        <div className="matrix__stat-card">
          <span className="matrix__stat-card-value">{stats.rate}%</span>
          <span className="matrix__stat-card-label">Execution Rate</span>
          <span className="matrix__stat-card-desc">Daily commitments completed</span>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="matrix__grid-wrapper">
        <div className="matrix__scroll-container" ref={scrollContainerRef}>
          <DayLabels days={headerDays} displayMode={habitDisplayMode} />

          <div className="matrix__table">
            {habits.map((habit) => {
              const habitStartDate = getHabitStartDate(habit);
              return (
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
                    {Array.from({ length: activeDaysCount }).map((_, i) => {
                      const cellDate = new Date(habitStartDate);
                      cellDate.setDate(habitStartDate.getDate() + i);
                      const key = `${habit.id}:${dateKey(cellDate)}`;
                      const done = !!completionData[key];
                      const today = isToday(cellDate);
                      const inactive = false; // Checkbox 1 is always start date, so no cells are before start date
                      const future = isFuture(cellDate);
                      const interactive = today;

                      let cellClass = 'matrix__cell';
                      if (done) cellClass += ' matrix__cell--done';
                      else if (inactive) cellClass += ' matrix__cell--inactive';
                      else if (future) cellClass += ' matrix__cell--future';
                      else cellClass += ' matrix__cell--missed';

                      if (today) cellClass += ' matrix__cell--today';

                      const getCellLabel = () => {
                        if (!done) return null;
                        if (habitDisplayMode === 'number') {
                          return `${i + 1}`;
                        }
                        return cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      };

                      return (
                        <div
                          key={i}
                          className={cellClass}
                          onClick={() => interactive && toggleCell(habit.id, cellDate)}
                          role="button"
                          tabIndex={interactive ? 0 : -1}
                          onKeyDown={(e) => {
                            if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              toggleCell(habit.id, cellDate);
                            }
                          }}
                        >
                          <div className="matrix__cell-inner" />
                          {done && <div className="matrix__cell-label">{getCellLabel()}</div>}
                          <div className="matrix__cell-tooltip">
                            {inactive ? 'Not yet established' : future ? `${habit.label} · Future Day` : `${habit.label} · ${formatTooltipDate(cellDate)}${today ? ' · Today' : ''}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integrated Legend */}
        <div className="matrix__footer">
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
