import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createHabit } from '../services/habits';
import '../styles/onboarding-modal.css';

const DURATION_OPTIONS = [
  { value: 7, label: '7 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' },
  { value: 'custom', label: 'Custom' },
];

const RANGE_MAP = {
  7: '7d',
  30: '30d',
  90: '90d',
  custom: 'custom',
};

const RANGE_TO_DAYS = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export default function OnboardingModal({ onClose, onHabitsCreated, range, onRangeChange, customDays, onCustomDaysChange }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [habitRows, setHabitRows] = useState([
    { id: 1, name: '', duration: 9999 },
    { id: 2, name: '', duration: 9999 },
    { id: 3, name: '', duration: 9999 },
  ]);
  const [defaultDuration, setDefaultDuration] = useState(() => {
    if (range === 'custom') return 'custom';
    return RANGE_TO_DAYS[range] || 30;
  });
  const [customDuration, setCustomDuration] = useState(customDays?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (range === 'custom') {
      setDefaultDuration('custom');
      setCustomDuration(customDays?.toString() || '');
    } else {
      setDefaultDuration(RANGE_TO_DAYS[range] || 30);
    }
  }, [range, customDays]);

  const handleAddRow = () => {
    if (habitRows.length >= 10) return;
    const newId = Math.max(...habitRows.map((r) => r.id)) + 1;
    setHabitRows([...habitRows, { id: newId, name: '', duration: 9999 }]);
  };

  const handleRemoveRow = (id) => {
    if (habitRows.length <= 1) return;
    setHabitRows(habitRows.filter((row) => row.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    setHabitRows(habitRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleNextStep = () => {
    setError('');
    const filledRows = habitRows.filter((row) => row.name.trim());

    if (filledRows.length === 0) {
      setError('Please add at least one habit to get started.');
      return;
    }

    setStep(2);
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  const handleDurationSelect = (value) => {
    setDefaultDuration(value);
    if (onRangeChange) {
      const mapped = RANGE_MAP[value] || '30d';
      onRangeChange(mapped);
    }
    if (typeof value === 'number' && onCustomDaysChange) {
      onCustomDaysChange(value);
    }
  };

  const handleCustomChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomDuration(raw);
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && onCustomDaysChange) {
      onCustomDaysChange(parsed);
    }
  };

  const handleContinue = () => {
    let duration;
    if (defaultDuration === 'custom') {
      const parsed = parseInt(customDuration, 10);
      duration = Number.isNaN(parsed) || parsed < 1 ? 30 : parsed;
    } else {
      duration = typeof defaultDuration === 'number' ? defaultDuration : parseInt(defaultDuration, 10);
    }
    setHabitRows(habitRows.map((row) => ({ ...row, duration })));
    setStep(3);
  };

  const handleSubmit = async () => {
    setError('');
    const filledRows = habitRows.filter((row) => row.name.trim());

    console.log('Attempting to create habits:', filledRows.map(row => ({
      user_id: user.id,
      label: row.name.trim(),
      duration: row.duration
    })));

    setLoading(true);
    try {
      const habitPromises = filledRows.map((row) =>
        createHabit(user.id, row.name.trim(), row.duration)
      );
      const results = await Promise.all(habitPromises);
      console.log('Supabase response - data:', results, 'error:', null);
      onHabitsCreated?.();
      onClose();
    } catch (err) {
      console.log('Supabase response - data:', null, 'error:', err);
      console.error('Error creating habits:', err);
      setError('Failed to create habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Discipline';
  };

  const renderStepIndicator = () => (
    <div className="onboarding-modal__step-indicator">
      <span className="onboarding-modal__step-text">Step {step} of 3</span>
      <div className="onboarding-modal__step-dots">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`onboarding-modal__step-dot${s === step ? ' onboarding-modal__step-dot--active' : ''}${s < step ? ' onboarding-modal__step-dot--completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="onboarding-modal__logo">ORIXUS</div>
      <p className="onboarding-modal__welcome">
        Welcome, <span className="onboarding-modal__welcome-name">{getUserDisplayName()}</span>
      </p>
      <h2 className="onboarding-modal__title">Let's build your first habits</h2>
      <p className="onboarding-modal__subtitle">
        Add the habits you want to track daily. You can always add more later.
      </p>

      <div className="onboarding-modal__habits">
        {habitRows.map((row, index) => (
          <div key={row.id} className="onboarding-modal__habit-row">
            <div className="onboarding-modal__habit-number">{index + 1}</div>
            <input
              type="text"
              className="onboarding-modal__habit-input"
              placeholder="e.g. Morning workout"
              value={row.name}
              onChange={(e) => handleRowChange(row.id, 'name', e.target.value)}
              disabled={loading}
            />
            {habitRows.length > 1 && (
              <button
                type="button"
                className="onboarding-modal__remove-btn"
                onClick={() => handleRemoveRow(row.id)}
                disabled={loading}
                aria-label="Remove habit"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {habitRows.length < 10 && (
        <button
          type="button"
          className="onboarding-modal__add-btn"
          onClick={handleAddRow}
          disabled={loading}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add another habit
        </button>
      )}

      {error && <p className="onboarding-modal__error">{error}</p>}

      <button
        type="button"
        className="onboarding-modal__submit"
        onClick={handleNextStep}
        disabled={loading}
      >
        Next →
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="onboarding-modal__logo">ORIXUS</div>
      <h2 className="onboarding-modal__title">Choose your commitment length</h2>
      <p className="onboarding-modal__subtitle">
        Select a default duration for all your habits. You can extend individual habits later.
      </p>

      <div className="onboarding-modal__duration-grid">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`onboarding-modal__duration-option${defaultDuration === option.value ? ' onboarding-modal__duration-option--active' : ''}`}
            onClick={() => handleDurationSelect(option.value)}
            disabled={loading}
          >
            {option.label}
          </button>
        ))}
      </div>

      {defaultDuration === 'custom' && (
        <div className="onboarding-modal__custom-duration">
          <input
            type="number"
            className="onboarding-modal__custom-input"
            placeholder="Enter days"
            value={customDuration}
            onChange={handleCustomChange}
            min="1"
            disabled={loading}
          />
        </div>
      )}

      {error && <p className="onboarding-modal__error">{error}</p>}

      <div className="onboarding-modal__button-row">
        <button
          type="button"
          className="onboarding-modal__secondary-btn"
          onClick={handleBackStep}
          disabled={loading}
        >
          ← Back
        </button>
        <button
          type="button"
          className="onboarding-modal__primary-btn"
          onClick={handleContinue}
          disabled={loading}
        >
          Continue →
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="onboarding-modal__logo">ORIXUS</div>
      <h2 className="onboarding-modal__title">You're making a commitment.</h2>
      
      <div className="onboarding-modal__quote">
        "Discipline is choosing between what you want now and what you want most."
      </div>

      <div className="onboarding-modal__disclaimer">
        <h3 className="onboarding-modal__disclaimer-title">Before you commit:</h3>
        <ul className="onboarding-modal__disclaimer-list">
          <li>Habits cannot be renamed once created</li>
          <li>Habits cannot be deleted without consequence to your streak and stats</li>
          <li>Missing a day breaks your streak — there are no exceptions</li>
          <li>This is a contract with yourself</li>
        </ul>
      </div>

      {error && <p className="onboarding-modal__error">{error}</p>}

      <button
        type="button"
        className="onboarding-modal__submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Creating habits...' : 'I Commit — Start Tracking'}
      </button>
    </>
  );

  return (
    <div className="onboarding-modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="onboarding-modal" onClick={(e) => e.stopPropagation()}>
        {renderStepIndicator()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}