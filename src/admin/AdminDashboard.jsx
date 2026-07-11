import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import { fetchAdminStats, fetchUserGrowth, fetchRecentSignups, fetchActivityOverview } from '../services/admin';
import '../styles/admin-dashboard.css';

const ICONS = {
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  active: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  habits: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  journal: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  checkins: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalHabits: 0,
    totalJournalEntries: 0,
    totalCheckIns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userGrowth, setUserGrowth] = useState([]);
  const [recentSignups, setRecentSignups] = useState([]);
  const [activityOverview, setActivityOverview] = useState([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsData, growthData, signupsData, activityData] = await Promise.all([
          fetchAdminStats(),
          fetchUserGrowth(),
          fetchRecentSignups(),
          fetchActivityOverview(),
        ]);
        setStats(statsData);
        setUserGrowth(growthData);
        setRecentSignups(signupsData);
        setActivityOverview(activityData);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="admin-dashboard__stats">
        <StatCard label="Total Users" value={loading ? '...' : stats.totalUsers} icon={ICONS.users} />
        <StatCard label="Active Users" value={loading ? '...' : stats.activeUsers} icon={ICONS.active} />
        <StatCard label="Total Habits" value={loading ? '...' : stats.totalHabits} icon={ICONS.habits} />
        <StatCard label="Total Journal Entries" value={loading ? '...' : stats.totalJournalEntries} icon={ICONS.journal} />
        <StatCard label="Total Check-ins" value={loading ? '...' : stats.totalCheckIns} icon={ICONS.checkins} />
      </div>

      {/* Placeholder Sections */}
      <div className="admin-dashboard__sections">
        <div className="admin-dashboard__section">
          <h2 className="admin-dashboard__section-title">User Growth</h2>
          <div className="admin-dashboard__section-content">
            {loading ? (
              <div>Loading…</div>
            ) : userGrowth.length > 0 ? (
              <div className="admin-dashboard__data-count">{userGrowth.length} users total</div>
            ) : (
              <div className="admin-dashboard__no-data">No data available</div>
            )}
          </div>
        </div>

        <div className="admin-dashboard__section">
          <h2 className="admin-dashboard__section-title">Activity Overview</h2>
          <div className="admin-dashboard__section-content">
            {loading ? (
              <div>Loading…</div>
            ) : activityOverview.length > 0 ? (
              <div className="admin-dashboard__data-count">{activityOverview.length} recent check-ins</div>
            ) : (
              <div className="admin-dashboard__no-data">No data available</div>
            )}
          </div>
        </div>

        <div className="admin-dashboard__section">
          <h2 className="admin-dashboard__section-title">Recent Signups</h2>
          <div className="admin-dashboard__section-content">
            {loading ? (
              <div>Loading…</div>
            ) : recentSignups.length > 0 ? (
              <div className="admin-dashboard__signup-list">
                {recentSignups.map((signup) => (
                  <div key={signup.id} className="admin-dashboard__signup-item">
                    <span className="admin-dashboard__signup-name">{signup.display_name || 'Anonymous'}</span>
                    <span className="admin-dashboard__signup-date">
                      {new Date(signup.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-dashboard__no-data">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
