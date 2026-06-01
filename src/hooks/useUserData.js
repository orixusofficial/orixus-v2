import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as habitsService from '../services/habits';
import * as completionsService from '../services/completions';
import * as journalService from '../services/journal';
import { ensureProfile, fetchProfile } from '../services/profile';

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
      await ensureProfile(user.id);
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
      const created = await habitsService.createHabit(user.id, label);
      setHabits((prev) => [...prev, created]);
    },
    [user],
  );

  const removeHabit = useCallback(async (habitId) => {
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
  }, []);

  const setCompletionDataPersisted = useCallback(
    (updater) => {
      setCompletionData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        return next;
      });
    },
    [],
  );

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
        return next;
      });

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
      const created = await journalService.createJournalEntry(user.id, entry);
      setJournalEntries((prev) => [created, ...prev]);
    },
    [user],
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
    addJournalEntry,
  };
}
