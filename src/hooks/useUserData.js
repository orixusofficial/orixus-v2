import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as habitsService from '../services/habits';
import * as completionsService from '../services/completions';
import * as journalService from '../services/journal';
import { ensureProfile, fetchProfile, updateProfile } from '../services/profile';
import * as cyclesService from '../services/cycles';

export function useUserData() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState({});
  const [journalEntries, setJournalEntries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [completedCycles, setCompletedCycles] = useState([]);

  const loadAll = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setCompletionData({});
      setJournalEntries([]);
      setProfile(null);
      setCurrentCycle(null);
      setCompletedCycles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (user.isMock) {
        const habitsRows = JSON.parse(localStorage.getItem('orixus_habits') || '[]');
        const completionMap = JSON.parse(localStorage.getItem('orixus_completions') || '{}');
        const journalRows = JSON.parse(localStorage.getItem('orixus_journal') || '[]');
        const profileRow = JSON.parse(
          localStorage.getItem('orixus_profile') || '{"display_name": "Dev Operator"}'
        );
        const currentCycleData = JSON.parse(localStorage.getItem('orixus_current_cycle') || 'null');
        const completedCyclesData = JSON.parse(localStorage.getItem('orixus_completed_cycles') || '[]');

        const mappedHabits = habitsRows.map(h => ({
          ...h,
          createdAt: new Date(h.createdAt),
        }));

        setHabits(mappedHabits);
        setCompletionData(completionMap);
        setJournalEntries(journalRows);
        setProfile(profileRow);
        setCurrentCycle(currentCycleData);
        setCompletedCycles(completedCyclesData);
        setLoading(false);
        return;
      }

      await ensureProfile(user);
      const [habitsRows, completionMap, journalRows, profileRow, currentCycleData, completedCyclesData] = await Promise.all([
        habitsService.fetchHabits(user.id),
        completionsService.fetchCompletions(user.id),
        journalService.fetchJournalEntries(user.id),
        fetchProfile(user.id),
        cyclesService.fetchCurrentCycle(user.id),
        cyclesService.fetchCycleHistory(user.id)
      ]);

      setHabits(habitsRows);
      setCompletionData(completionMap);
      setJournalEntries(journalRows);
      setProfile(profileRow);
      setCurrentCycle(currentCycleData);
      setCompletedCycles(completedCyclesData);
      setLoading(false);
    } catch (err) {
      setError(err.message ?? 'Failed to load your data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const addHabit = useCallback(
    async (label) => {
      if (!user) return;

      if (user.isMock) {
        const createdAt = new Date();
        createdAt.setHours(0, 0, 0, 0);
        const created = {
          id: `habit-${Date.now()}`,
          label,
          createdAt,
        };
        setHabits((prev) => {
          const next = [...prev, created];
          localStorage.setItem('orixus_habits', JSON.stringify(next));
          return next;
        });
        return;
      }
      const created = await habitsService.createHabit(user.id, label, 30);
      setHabits((prev) => [...prev, created]);
    },
    [user],
  );

  const removeHabit = useCallback(
    async (habitId) => {
      if (user?.isMock) {
        setHabits((prev) => {
          const next = prev.filter((h) => h.id !== habitId);
          localStorage.setItem('orixus_habits', JSON.stringify(next));
          return next;
        });
        setCompletionData((prev) => {
          const next = { ...prev };
          const prefix = `${habitId}:`;
          for (const key of Object.keys(next)) {
            if (key.startsWith(prefix)) delete next[key];
          }
          localStorage.setItem('orixus_completions', JSON.stringify(next));
          return next;
        });
        return;
      }
      await habitsService.deleteHabit(habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      setCompletionData((prev) => {
        const next = { ...prev };
        const prefix = `${habitId}:`;
        for (const key of Object.keys(next)) {
          if (key.startsWith(prefix)) delete next[key];
        }
        return next;
      });
    },
    [user],
  );

  const updateHabitDuration = useCallback(
    async (habitId, newDuration) => {
      if (!user) return;

      const habit = habits.find(h => h.id === habitId);
      const parsedDuration = Number(newDuration);
      
      // Validation BEFORE any state or database update
      if (habit) {
        const habitStart = new Date(habit.createdAt);
        habitStart.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - habitStart.getTime();
        const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        if (Number.isNaN(parsedDuration) || parsedDuration < currentDay) {
          throw new Error(`You're currently on Day ${currentDay}. Duration cannot be less than ${currentDay} days.`);
        }
      } else {
        if (Number.isNaN(parsedDuration) || parsedDuration < 1) {
          throw new Error('Invalid duration');
        }
      }

      // Only proceed with updates if validation passed
      if (user.isMock) {
        setHabits((prev) => {
          const next = prev.map((h) => (h.id === habitId ? { ...h, duration: parsedDuration } : h));
          localStorage.setItem('orixus_habits', JSON.stringify(next));
          return next;
        });
        return;
      }

      await habitsService.updateHabitDuration(user.id, habitId, parsedDuration, habits);
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, duration: parsedDuration } : h))
      );
    },
    [user, habits],
  );

  const setCompletionDataPersisted = useCallback((updater) => {
    setCompletionData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  const toggleCompletion = useCallback(
    async (habitId, dateKeyStr, nextCompleted) => {
      if (!user) return;

      setCompletionData((prev) => {
        const key = `${habitId}:${dateKeyStr}`;
        const next = { ...prev };
        if (nextCompleted) {
          next[key] = true;
        } else {
          delete next[key];
        }
        if (user.isMock) {
          localStorage.setItem('orixus_completions', JSON.stringify(next));
        }
        return next;
      });

      if (user.isMock) return;

      try {
        await completionsService.setCompletion(user.id, habitId, dateKeyStr, nextCompleted);
      } catch (err) {
        setCompletionData((prev) => {
          const key = `${habitId}:${dateKeyStr}`;
          const next = { ...prev };
          if (nextCompleted) {
            delete next[key];
          } else {
            next[key] = true;
          }
          return next;
        });
        throw err;
      }
    },
    [user],
  );

  const addJournalEntry = useCallback(
    async (entry) => {
      if (!user) return;
      if (user.isMock) {
        const created = {
          id: `journal-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          createdAt: new Date().toISOString(),
        };
        setJournalEntries((prev) => {
          const next = [created, ...prev];
          localStorage.setItem('orixus_journal', JSON.stringify(next));
          return next;
        });
        return;
      }
      const created = await journalService.createJournalEntry(user.id, entry);
      setJournalEntries((prev) => [created, ...prev]);
    },
    [user],
  );

  const updateProfileSettings = useCallback(
    async (updates) => {
      if (!user) return;
      if (user.isMock) {
        setProfile((prev) => {
          const next = { ...prev, ...updates };
          localStorage.setItem('orixus_profile', JSON.stringify(next));
          return next;
        });
        return;
      }
      const updated = await updateProfile(user.id, updates);
      setProfile(updated);
    },
    [user],
  );

  const resetAllHabits = useCallback(async () => {
    if (!user) return;
    
    if (user.isMock) {
      setHabits([]);
      setCompletionData({});
      localStorage.setItem('orixus_habits', '[]');
      localStorage.setItem('orixus_completions', '{}');
      return;
    }
    await habitsService.deleteAllHabits(user.id);
    await completionsService.deleteAllCompletions(user.id);
    setHabits([]);
    setCompletionData({});
  }, [user]);

  const resetStreak = useCallback(async () => {
    if (!user) return;
    if (user.isMock) {
      setCompletionData({});
      localStorage.setItem('orixus_completions', '{}');
      return;
    }
    await completionsService.deleteAllCompletions(user.id);
    setCompletionData({});
  }, [user]);

  const deleteAllJournalEntries = useCallback(async () => {
    if (!user) return;
    if (user.isMock) {
      setJournalEntries([]);
      localStorage.setItem('orixus_journal', '[]');
      return;
    }
    await journalService.deleteAllJournalEntries(user.id);
    setJournalEntries([]);
  }, [user]);

  const calculateStreak = useCallback(() => {
    if (!completionData || Object.keys(completionData).length === 0 || habits.length === 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatDateKey = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const getActiveHabitsForDate = (date) => {
      return habits.filter(h => {
        const habitStart = new Date(h.createdAt);
        habitStart.setHours(0, 0, 0, 0);
        const habitEnd = new Date(habitStart);
        habitEnd.setDate(habitStart.getDate() + (h.duration || 30) - 1);
        habitEnd.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate >= habitStart && checkDate <= habitEnd;
      });
    };

    const dateKeys = new Set();
    Object.keys(completionData).forEach(key => {
      const dateKeyStr = key.split(':')[1];
      if (dateKeyStr) {
        dateKeys.add(dateKeyStr);
      }
    });

    const sortedDates = Array.from(dateKeys)
      .map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        return date;
      })
      .sort((a, b) => b - a);

    if (sortedDates.length === 0) {
      return 0;
    }

    const mostRecentDate = sortedDates[0];
    const daysDiff = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) {
      return 0;
    }

    let streak = 0;
    let currentDate = daysDiff === 0 ? today : mostRecentDate;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);

      const checkDateStr = formatDateKey(checkDate);

      const completedHabitIds = new Set();
      Object.keys(completionData).forEach(key => {
        const [habitId, dateKeyStr] = key.split(':');
        if (dateKeyStr === checkDateStr) {
          completedHabitIds.add(habitId);
        }
      });

      const activeHabitsForDay = getActiveHabitsForDate(checkDate);
      if (activeHabitsForDay.length === 0) {
        break;
      }

      const allCompleted = activeHabitsForDay.every(h => completedHabitIds.has(h.id));
      if (allCompleted) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [completionData, habits]);

  const createCycle = useCallback(
    async (duration) => {
      if (!user) return;

      if (user.isMock) {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + duration);
        
        const newCycle = {
          id: `cycle-${Date.now()}`,
          duration,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          current_rank: 'Initiate',
          final_rank: null,
          completion_percentage: 0,
          completion_result: null,
          ended_at: null,
          created_at: new Date().toISOString()
        };
        
        setCurrentCycle(newCycle);
        localStorage.setItem('orixus_current_cycle', JSON.stringify(newCycle));
        return newCycle;
      }

      const newCycle = await cyclesService.createCycle(user.id, duration);
      setCurrentCycle(newCycle);
      return newCycle;
    },
    [user],
  );

  const completeCycle = useCallback(
    async () => {
      if (!user || !currentCycle) return;

      if (user.isMock) {
        const startDate = new Date(currentCycle.start_date);
        const endDate = new Date(currentCycle.end_date);
        const actualDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalHabits = habits.length;
        const totalCheckIns = Object.values(completionData).filter(v => v).length;
        const completionPercentage = totalHabits > 0 && actualDays > 0 
          ? Math.round((totalCheckIns / (totalHabits * actualDays)) * 100) 
          : 0;

        const completionResult = cyclesService.calculateCompletionResult(completionPercentage);
        const finalRank = currentCycle.current_rank || currentCycle.rank || 'Initiate';

        const completedCycle = {
          ...currentCycle,
          status: 'completed',
          completed_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
          current_rank: finalRank,
          final_rank: finalRank,
          completion_percentage: completionPercentage,
          completion_result: completionResult
        };
        
        setCompletedCycles(prev => [completedCycle, ...prev]);
        setCurrentCycle(null);
        localStorage.removeItem('orixus_current_cycle');
        localStorage.setItem('orixus_completed_cycles', JSON.stringify([completedCycle, ...completedCycles]));
        return completedCycle;
      }

      const startDate = new Date(currentCycle.start_date);
      const endDate = new Date(currentCycle.end_date);
      const actualDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalHabits = habits.length;
      const totalCheckIns = Object.values(completionData).filter(v => v).length;
      const completionPercentage = totalHabits > 0 && actualDays > 0 
        ? Math.round((totalCheckIns / (totalHabits * actualDays)) * 100) 
        : 0;

      const completionResult = cyclesService.calculateCompletionResult(completionPercentage);
      const finalRank = currentCycle.current_rank || currentCycle.rank || 'Initiate';

      const completedCycle = await cyclesService.completeCycle(
        currentCycle.id, 
        user.id, 
        finalRank,
        completionPercentage,
        completionResult
      );
      setCompletedCycles(prev => [completedCycle, ...prev]);
      setCurrentCycle(null);
      return completedCycle;
    },
    [user, currentCycle, completedCycles, habits, completionData],
  );

  const updateCycleRank = useCallback(
    async (rank) => {
      if (!user || !currentCycle) return;

      if (user.isMock) {
        const updatedCycle = {
          ...currentCycle,
          current_rank: rank
        };
        setCurrentCycle(updatedCycle);
        localStorage.setItem('orixus_current_cycle', JSON.stringify(updatedCycle));
        return updatedCycle;
      }

      const updatedCycle = await cyclesService.updateCycleRank(currentCycle.id, user.id, rank);
      setCurrentCycle(updatedCycle);
      return updatedCycle;
    },
    [user, currentCycle],
  );

  const updateCycleDuration = useCallback(
    async (newDuration) => {
      if (!user || !currentCycle) return;

      const parsedDuration = Number(newDuration);
      if (Number.isNaN(parsedDuration) || parsedDuration < 1) return;

      if (user.isMock) {
        const startDate = new Date(currentCycle.start_date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parsedDuration);

        const updatedCycle = {
          ...currentCycle,
          duration: parsedDuration,
          end_date: endDate.toISOString().split('T')[0]
        };
        setCurrentCycle(updatedCycle);
        localStorage.setItem('orixus_current_cycle', JSON.stringify(updatedCycle));
        return updatedCycle;
      }

      const updatedCycle = await cyclesService.updateCycleDuration(currentCycle.id, user.id, parsedDuration);
      setCurrentCycle(updatedCycle);
      return updatedCycle;
    },
    [user, currentCycle],
  );

  return {
    habits,
    completionData,
    setCompletionData: setCompletionDataPersisted,
    toggleCompletion,
    journalEntries,
    profile,
    loading,
    error,
    refresh: loadAll,
    addHabit,
    removeHabit,
    updateHabitDuration,
    addJournalEntry,
    updateProfileSettings,
    resetAllHabits,
    resetStreak,
    deleteAllJournalEntries,
    calculateStreak,
    currentCycle,
    completedCycles,
    createCycle,
    completeCycle,
    updateCycleRank,
    updateCycleDuration,
  };
}

