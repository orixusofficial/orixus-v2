import DisciplineMatrix from '../components/DisciplineMatrix';

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
}) {
  return (
    <div className="habits-page">
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
      />
    </div>
  );
}
