import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as habitsService from '../services/habits';
import * as completionsService from '../services/completions';
import * as journalService from '../services/journal';
import { ensureProfile, fetchProfile, updateProfile } from '../services/profile';

export function useUserData() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState({});
  const [journalEntries, setJournalEntries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setCompletionData({});
      setJournalEntries([]);
      setProfile(null);
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

        setHabits(habitsRows);
        setCompletionData(completionMap);
        setJournalEntries(journalRows);
        setProfile(profileRow);
        setLoading(false);
        return;
      }

      await ensureProfile(user);
      const [habitsRows, completionMap, journalRows, profileRow] = await Promise.all([
        habitsService.fetchHabits(user.id),
        completionsService.fetchCompletions(user.id),
        journalService.fetchJournalEntries(user.id),
        fetchProfile(user.id),
      ]);

      setHabits(habitsRows);
      setCompletionData(completionMap);
      setJournalEntries(journalRows);
      setProfile(profileRow);
    } catch (err) {
      console.error('🔴 useUserData loadAll error:', err);
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
      const created = await habitsService.createHabit(user.id, label);
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

      if (user.isMock) {
        setHabits((prev) => {
          const next = prev.map((h) => (h.id === habitId ? { ...h, duration: newDuration } : h));
          localStorage.setItem('orixus_habits', JSON.stringify(next));
          return next;
        });
        return;
      }

      await habitsService.updateHabitDuration(user.id, habitId, newDuration);
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, duration: newDuration } : h))
      );
    },
    [user],
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

      if (completedHabitIds.size === habits.length) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [completionData, habits]);

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
  };
}

