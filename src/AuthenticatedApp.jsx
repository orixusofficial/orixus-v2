import { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import HabitsPage from './pages/HabitsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LogoutPage from './pages/LogoutPage';
import { useAuth } from './contexts/AuthContext';
import { useUserData } from './hooks/useUserData';
import './styles/dashboard.css';

function AddHabitModal({ isOpen, onClose, onAdd }) {
  const [label, setLabel] = useState('');
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (label.trim()) {
      setStep(2);
    }
  };

  const handleFinalCommit = async () => {
    setError('');
    setSaving(true);
    try {
      await onAdd(label.trim());
      setLabel('');
      setStep(1);
      onClose();
    } catch (err) {
      setError(err.message ?? 'Could not create habit.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setLabel('');
    setStep(1);
    setError('');
    onClose();
  };

  return (
    <div className="dashboard-modal-overlay" onClick={handleClose}>
      <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <h3 className="dashboard-modal__title">New Commitment</h3>
            <p className="dashboard-modal__motto">“What we do consistently defines us.”</p>
            <form onSubmit={handleNext}>
              <div className="dashboard-modal__input-group">
                <input
                  type="text"
                  className="dashboard-modal__input"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Habit Name (e.g. Morning Run)"
                  autoFocus
                />
              </div>
              {error && <p className="auth-form__error">{error}</p>}
              <div className="dashboard-modal__actions">
                <button
                  type="button"
                  className="dashboard-modal__btn dashboard-modal__btn--secondary"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button type="submit" className="dashboard-modal__btn dashboard-modal__btn--primary">
                  Initialize
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="dashboard-modal__commitment">
            <h3 className="dashboard-modal__title">Are you really ready?</h3>
            <p className="dashboard-modal__desc">
              Committing to <strong>{label}</strong> is a contract with yourself. Once established, the
              discipline system expects total consistency until the cycle is complete.
            </p>
            <div className="dashboard-modal__warning">
              <p>• Cannot be renamed</p>
              <p>• Cannot be deleted without consequence</p>
            </div>
            {error && <p className="auth-form__error">{error}</p>}
            <div className="dashboard-modal__actions">
              <button
                type="button"
                className="dashboard-modal__btn dashboard-modal__btn--secondary"
                onClick={() => setStep(1)}
              >
                Go Back
              </button>
              <button
                type="button"
                className="dashboard-modal__btn dashboard-modal__btn--primary"
                onClick={handleFinalCommit}
                disabled={saving}
              >
                {saving ? 'Committing…' : 'I Commit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RemoveHabitModal({ isOpen, habit, onClose, onConfirm }) {
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !habit) return null;

  const handleConfirm = async () => {
    setError('');
    setRemoving(true);
    try {
      await onConfirm(habit.id);
    } catch (err) {
      setError(err.message ?? 'Could not remove habit.');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="dashboard-modal-overlay" onClick={onClose}>
      <div className="dashboard-modal dashboard-modal--danger" onClick={(e) => e.stopPropagation()}>
        <h3 className="dashboard-modal__title">Really?</h3>
        <div className="dashboard-modal__quote-box">
          <p className="dashboard-modal__quote">“Discipline breaks when excuses begin.”</p>
        </div>
        <p className="dashboard-modal__desc">
          The version of you you want to become would not quit here. Temporary discomfort creates
          permanent identity.
        </p>
        {error && <p className="auth-form__error">{error}</p>}
        <div className="dashboard-modal__actions">
          <button type="button" className="dashboard-modal__btn dashboard-modal__btn--primary" onClick={onClose}>
            Stay Committed
          </button>
          <button
            type="button"
            className="dashboard-modal__btn dashboard-modal__btn--text"
            onClick={handleConfirm}
            disabled={removing}
          >
            {removing ? 'Removing…' : 'Remove Anyway'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthenticatedApp({ activeItem, onNavigate, onLoggedOut }) {
  const { user } = useAuth();
  const {
    habits,
    completionData,
    toggleCompletion,
    journalEntries,
    profile,
    loading,
    error,
    addHabit,
    removeHabit,
    addJournalEntry,
  } = useUserData();

  const [customDays, setCustomDays] = useState(365);
  const [range, setRange] = useState('30d');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [habitToRemove, setHabitToRemove] = useState(null);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="dashboard-overview">
          <p className="auth-shell__status">Loading your discipline data…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="dashboard-overview">
          <h1 className="dashboard-overview__title">Sync Error</h1>
          <p className="auth-form__error">{error}</p>
          <p className="auth-shell__hint">
            Confirm the database migration ran and your Supabase keys are correct.
          </p>
        </div>
      );
    }

    switch (activeItem) {
      case 'habits':
        return (
          <HabitsPage
            habits={habits}
            onRemoveHabit={(habit) => setHabitToRemove(habit)}
            onOpenAddHabit={() => setIsAddOpen(true)}
            completionData={completionData}
            onToggleCompletion={toggleCompletion}
            customDays={customDays}
            setCustomDays={setCustomDays}
            range={range}
            setRange={setRange}
            habitDisplayMode={profile?.habit_display_mode || 'date'}
          />
        );
      case 'analytics':
        return <AnalyticsPage habits={habits} completionData={completionData} />;
      case 'journal':
        return <JournalPage entries={journalEntries} onAddEntry={addJournalEntry} defaultMood={profile?.default_journal_mood || 'focused'} />;
      case 'profile':
        return <ProfilePage habits={habits} completionData={completionData} journalEntries={journalEntries} profile={profile} />;
      case 'settings':
        return <SettingsPage />;
      case 'logout':
        return <LogoutPage onNavigate={onNavigate} onLoggedOut={onLoggedOut} />;
      default:
        return (
          <HabitsPage
            habits={habits}
            onRemoveHabit={(habit) => setHabitToRemove(habit)}
            onOpenAddHabit={() => setIsAddOpen(true)}
            completionData={completionData}
            onToggleCompletion={toggleCompletion}
            customDays={customDays}
            setCustomDays={setCustomDays}
            range={range}
            setRange={setRange}
            habitDisplayMode={profile?.habit_display_mode || 'date'}
          />
        );
    }
  };

  return (
    <AppLayout activeItem={activeItem} onNavigate={onNavigate} isAuthenticated>
      {renderContent()}

      <AddHabitModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={addHabit} />

      <RemoveHabitModal
        isOpen={!!habitToRemove}
        habit={habitToRemove}
        onClose={() => setHabitToRemove(null)}
        onConfirm={async (id) => {
          await removeHabit(id);
          setHabitToRemove(null);
        }}
      />
    </AppLayout>
  );
}
