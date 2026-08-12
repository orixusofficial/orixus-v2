import { useState, useEffect } from 'react';
import JsonLd from '../components/JsonLd';
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
  onUpdateHabitDuration,
  userId,
}) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding only if there are no habits
    if (habits.length === 0) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
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
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: 'Habits', item: 'https://orixus.vercel.app/habits' }
        ]
      }} />
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
        onUpdateHabitDuration={onUpdateHabitDuration}
        userId={userId}
      />
    </div>
  );
}
