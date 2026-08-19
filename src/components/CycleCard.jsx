import { useState, useMemo } from 'react';

export default function CycleCard({ currentCycle, completedCycles, onCreateCycle, onCompleteCycle }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [duration, setDuration] = useState(30);

  const cycleProgress = useMemo(() => {
    if (!currentCycle) return 0;
    
    const startDate = new Date(currentCycle.start_date);
    const endDate = new Date(currentCycle.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));
  }, [currentCycle]);

  const currentDay = useMemo(() => {
    if (!currentCycle) return 0;
    
    const startDate = new Date(currentCycle.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    return Math.max(1, elapsedDays);
  }, [currentCycle]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCreateCycle = () => {
    onCreateCycle(duration);
    setShowCreateModal(false);
    setDuration(30);
  };

  if (!currentCycle) {
    return (
      <div className="cycle-card cycle-card--no-cycle">
        <div className="cycle-card__content">
          <h3 className="cycle-card__title">No Active Cycle</h3>
          <p className="cycle-card__subtitle">Start a new discipline cycle to track your progress</p>
          <button 
            className="cycle-card__btn cycle-card__btn--primary"
            onClick={() => setShowCreateModal(true)}
          >
            Start Cycle
          </button>
        </div>

        {showCreateModal && (
          <div className="cycle-modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="cycle-modal" onClick={e => e.stopPropagation()}>
              <h3 className="cycle-modal__title">Start New Cycle</h3>
              <p className="cycle-modal__subtitle">Choose your cycle duration</p>
              
              <div className="cycle-modal__presets">
                <button 
                  className={`cycle-modal__preset-btn ${duration === 30 ? 'cycle-modal__preset-btn--active' : ''}`}
                  onClick={() => setDuration(30)}
                >
                  30 Days
                </button>
                <button 
                  className={`cycle-modal__preset-btn ${duration === 60 ? 'cycle-modal__preset-btn--active' : ''}`}
                  onClick={() => setDuration(60)}
                >
                  60 Days
                </button>
                <button 
                  className={`cycle-modal__preset-btn ${duration === 90 ? 'cycle-modal__preset-btn--active' : ''}`}
                  onClick={() => setDuration(90)}
                >
                  90 Days
                </button>
              </div>

              <div className="cycle-modal__actions">
                <button 
                  className="cycle-modal__btn cycle-modal__btn--secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="cycle-modal__btn cycle-modal__btn--primary"
                  onClick={handleCreateCycle}
                >
                  Start Cycle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="cycle-card">
      <div className="cycle-card__header">
        <div className="cycle-card__header-left">
          <h3 className="cycle-card__title">Current Cycle</h3>
          <span className="cycle-card__rank">{currentCycle.rank}</span>
        </div>
        <div className="cycle-card__progress">
          <span className="cycle-card__progress-text">Day {currentDay} of {currentCycle.duration}</span>
          <div className="cycle-card__progress-bar">
            <div 
              className="cycle-card__progress-fill" 
              style={{ width: `${cycleProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="cycle-card__stats">
        <div className="cycle-card__stat">
          <span className="cycle-card__stat-label">Start Date</span>
          <span className="cycle-card__stat-value">{formatDate(currentCycle.start_date)}</span>
        </div>
        <div className="cycle-card__stat">
          <span className="cycle-card__stat-label">End Date</span>
          <span className="cycle-card__stat-value">{formatDate(currentCycle.end_date)}</span>
        </div>
        <div className="cycle-card__stat">
          <span className="cycle-card__stat-label">Duration</span>
          <span className="cycle-card__stat-value">{currentCycle.duration} Days</span>
        </div>
      </div>

      {completedCycles.length > 0 && (
        <div className="cycle-card__history">
          <h4 className="cycle-card__history-title">Completed Cycles</h4>
          <div className="cycle-card__history-list">
            {completedCycles.slice(0, 3).map(cycle => (
              <div key={cycle.id} className="cycle-card__history-item">
                <div className="cycle-card__history-item-left">
                  <span className="cycle-card__history-item-rank">{cycle.rank}</span>
                  <span className="cycle-card__history-item-dates">
                    {formatDate(cycle.start_date)} - {formatDate(cycle.end_date)}
                  </span>
                </div>
                <span className="cycle-card__history-item-duration">{cycle.duration} Days</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
