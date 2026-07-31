import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import { fetchAdminStats } from '../services/admin';
import '../styles/admin-dashboard.css';

const ICONS = {
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  habits: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  journal: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  feedback: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchAdminStats()
      .then((data) => { if (mounted) setStats(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const val = (key) => {
    if (loading) return '…';
    if (error) return '—';
    return (stats?.[key] ?? 0).toLocaleString();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Overview</h1>

      {error && (
        <div className="admin-error-banner">
          Failed to load stats — ensure the RLS migration has been applied.
        </div>
      )}

      <div className="admin-dashboard__stats">
        <StatCard label="Total Users"          value={val('totalUsers')}         icon={ICONS.users}    />
        <StatCard label="Total Habits"         value={val('totalHabits')}        icon={ICONS.habits}   />
        <StatCard label="Journal Entries"      value={val('totalJournalEntries')} icon={ICONS.journal}  />
        <StatCard label="Total Feedback"       value={val('totalFeedback')}      icon={ICONS.feedback} />
      </div>
    </div>
  );
}
