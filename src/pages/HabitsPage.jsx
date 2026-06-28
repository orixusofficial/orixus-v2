import { useState, useEffect } from 'react';
import DisciplineMatrix from '../components/DisciplineMatrix';
import OnboardingModal from '../components/OnboardingModal';

export default function HabitsPage({
  habits,
  onRemoveHabit,
  onOpenAddHabit,
  completionData,
  onToggleCompletion,
  customDays,
  setCustomDays,
  range,
  setRange,
  habitDisplayMode,
  refreshHabits,
}) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (habits.length === 0) {
      setShowOnboarding(true);
    }
  }, [habits.length]);

  const handleHabitsCreated = () => {
    refreshHabits?.();
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="habits-page">
      {showOnboarding && (
        <OnboardingModal
          onClose={handleCloseOnboarding}
          onHabitsCreated={handleHabitsCreated}
          range={range}
          onRangeChange={setRange}
          customDays={customDays}
          onCustomDaysChange={setCustomDays}
        />
      )}
      <DisciplineMatrix
        habits={habits}
        onRemoveHabit={onRemoveHabit}
        onOpenAddHabit={onOpenAddHabit}
        completionData={completionData}
        onToggleCompletion={onToggleCompletion}
        customDays={customDays}
        setCustomDays={setCustomDays}
        range={range}
        setRange={setRange}
        habitDisplayMode={habitDisplayMode}
      />
    </div>
  );
}
