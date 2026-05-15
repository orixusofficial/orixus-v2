import { useState, useMemo } from 'react';
import DisciplineMatrix from '../components/DisciplineMatrix';
import '../styles/dashboard.css';

const INITIAL_HABITS = [
  { id: 'workout', label: 'Workout', createdAt: new Date('2026-05-10') },
  { id: 'reading', label: 'Reading', createdAt: new Date('2026-05-10') },
  { id: 'meditation', label: 'Meditation', createdAt: new Date('2026-05-10') },
  { id: 'deepwork', label: 'Deep Work', createdAt: new Date('2026-05-10') },
  { id: 'sleep', label: 'Sleep Early', createdAt: new Date('2026-05-10') },
];

const PHILOSOPHIES = [
  "Consistency compounds silently.",
  "Discipline survives when motivation disappears.",
  "Your future is built by repeated actions.",
  "Identity is earned daily.",
  "The version of you you want to become would not quit here.",
  "Excellence is not an act, but a habit.",
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

export default function Dashboard() {
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [habitToRemove, setHabitToRemove] = useState(null);

  const philosophy = useMemo(() => {
    return PHILOSOPHIES[Math.floor(Math.random() * PHILOSOPHIES.length)];
  }, []);

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

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__header-left">
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__philosophy">
            {philosophy}
          </p>
        </div>
      </div>

      <DisciplineMatrix 
        habits={habits} 
        onRemoveHabit={(habit) => setHabitToRemove(habit)}
        onOpenAddHabit={() => setIsAddOpen(true)}
      />

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
    </div>
  );
}
