import { useState, useMemo } from 'react';
import AppLayout from './layouts/AppLayout';
import DashboardOverview from './pages/DashboardOverview';
import HabitsPage from './pages/HabitsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import './styles/dashboard.css';

const INITIAL_HABITS = [
  { id: 'workout', label: 'Workout', createdAt: new Date('2026-05-10') },
  { id: 'reading', label: 'Reading', createdAt: new Date('2026-05-10') },
  { id: 'meditation', label: 'Meditation', createdAt: new Date('2026-05-10') },
  { id: 'deepwork', label: 'Deep Work', createdAt: new Date('2026-05-10') },
  { id: 'sleep', label: 'Sleep Early', createdAt: new Date('2026-05-10') },
];

/* ---- Premium Add Habit Modal (Two-Step Commitment) ---- */
function AddHabitModal({ isOpen, onClose, onAdd }) {
  const [label, setLabel] = useState('');
  const [step, setStep] = useState(1); 

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (label.trim()) {
      setStep(2);
    }
  };

  const handleFinalCommit = () => {
    onAdd(label.trim());
    setLabel('');
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    setLabel('');
    setStep(1);
    onClose();
  };

  return (
    <div className="dashboard-modal-overlay" onClick={handleClose}>
      <div className="dashboard-modal" onClick={e => e.stopPropagation()}>
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
                  onChange={e => setLabel(e.target.value)}
                  placeholder="Habit Name (e.g. Morning Run)"
                  autoFocus
                />
              </div>
              <div className="dashboard-modal__actions">
                <button type="button" className="dashboard-modal__btn dashboard-modal__btn--secondary" onClick={handleClose}>
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
              Committing to <strong>{label}</strong> is a contract with yourself. 
              Once established, the discipline system expects total consistency until the cycle is complete.
            </p>
            <div className="dashboard-modal__warning">
              <p>• Cannot be renamed</p>
              <p>• Cannot be deleted without consequence</p>
            </div>
            <div className="dashboard-modal__actions">
              <button className="dashboard-modal__btn dashboard-modal__btn--secondary" onClick={() => setStep(1)}>
                Go Back
              </button>
              <button className="dashboard-modal__btn dashboard-modal__btn--primary" onClick={handleFinalCommit}>
                I Commit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Premium Remove Habit Modal (Emotional Challenge) ---- */
function RemoveHabitModal({ isOpen, habit, onClose, onConfirm }) {
  if (!isOpen || !habit) return null;

  return (
    <div className="dashboard-modal-overlay" onClick={onClose}>
      <div className="dashboard-modal dashboard-modal--danger" onClick={e => e.stopPropagation()}>
        <h3 className="dashboard-modal__title">Really?</h3>
        <div className="dashboard-modal__quote-box">
          <p className="dashboard-modal__quote">“Discipline breaks when excuses begin.”</p>
        </div>
        <p className="dashboard-modal__desc">
          The version of you you want to become would not quit here. 
          Temporary discomfort creates permanent identity.
        </p>
        <div className="dashboard-modal__actions">
          <button className="dashboard-modal__btn dashboard-modal__btn--primary" onClick={onClose}>
            Stay Committed
          </button>
          <button className="dashboard-modal__btn dashboard-modal__btn--text" onClick={() => onConfirm(habit.id)}>
            Remove Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [completionData, setCompletionData] = useState({});
  const [customDays, setCustomDays] = useState(365);
  const [range, setRange] = useState('30d');

  // Modals for adding/removing habits
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [habitToRemove, setHabitToRemove] = useState(null);

  const addHabit = (label) => {
    const newHabit = {
      id: `${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      label,
      createdAt: new Date(),
    };
    setHabits([...habits, newHabit]);
  };

  const removeHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
    setHabitToRemove(null);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <DashboardOverview 
            habits={habits}
            completionData={completionData}
            onNavigate={setActiveItem}
            onOpenAddHabit={() => setIsAddOpen(true)}
          />
        );
      case 'habits':
        return (
          <HabitsPage 
            habits={habits}
            onRemoveHabit={(habit) => setHabitToRemove(habit)}
            onOpenAddHabit={() => setIsAddOpen(true)}
            completionData={completionData}
            setCompletionData={setCompletionData}
            customDays={customDays}
            setCustomDays={setCustomDays}
            range={range}
            setRange={setRange}
          />
        );
      case 'analytics':
        return <AnalyticsPage habits={habits} completionData={completionData} />;
      case 'journal':
        return <JournalPage />;
      case 'profile':
        return <ProfilePage habits={habits} completionData={completionData} />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return (
          <div className="dashboard-overview">
            <h1 className="dashboard-overview__title">Login Protocol</h1>
            <p className="dashboard-overview__quote">“Authenticate to sync your parameters.”</p>
            <div className="dashboard-overview__panel" style={{ marginTop: '20px', maxWidth: '400px' }}>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Secure tactical credentials are locked in default configuration.</p>
              <button 
                className="dashboard-overview__btn" 
                style={{ marginTop: '16px' }}
                onClick={() => {
                  alert('Session established successfully.');
                  setActiveItem('dashboard');
                }}
              >
                Access Account
              </button>
            </div>
          </div>
        );
      case 'logout':
        return (
          <div className="dashboard-overview">
            <h1 className="dashboard-overview__title">Logout Protocol</h1>
            <p className="dashboard-overview__quote">“Secure your post before leaving.”</p>
            <div className="dashboard-overview__panel" style={{ marginTop: '20px', maxWidth: '400px' }}>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Are you sure you want to terminate the active local session?</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  className="dashboard-overview__btn" 
                  style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                  onClick={() => setActiveItem('dashboard')}
                >
                  Cancel
                </button>
                <button 
                  className="dashboard-overview__btn"
                  onClick={() => {
                    alert('Session terminated.');
                    setActiveItem('login');
                  }}
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardOverview habits={habits} completionData={completionData} onNavigate={setActiveItem} onOpenAddHabit={() => setIsAddOpen(true)} />;
    }
  };

  return (
    <AppLayout activeItem={activeItem} onNavigate={setActiveItem}>
      {renderContent()}

      <AddHabitModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={addHabit}
      />

      <RemoveHabitModal 
        isOpen={!!habitToRemove}
        habit={habitToRemove}
        onClose={() => setHabitToRemove(null)}
        onConfirm={removeHabit}
      />
    </AppLayout>
  );
}
