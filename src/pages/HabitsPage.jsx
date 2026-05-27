import DisciplineMatrix from '../components/DisciplineMatrix';

export default function HabitsPage({ habits, onRemoveHabit, onOpenAddHabit, completionData, setCompletionData, customDays, setCustomDays, range, setRange }) {
  return (
    <div className="habits-page">
      <DisciplineMatrix 
        habits={habits} 
        onRemoveHabit={onRemoveHabit}
        onOpenAddHabit={onOpenAddHabit}
        completionData={completionData}
        setCompletionData={setCompletionData}
        customDays={customDays}
        setCustomDays={setCustomDays}
        range={range}
        setRange={setRange}
      />
    </div>
  );
}
