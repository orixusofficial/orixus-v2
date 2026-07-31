import { useState, useEffect, useMemo } from 'react';
import { fetchAdminUsers } from '../services/admin';
import '../styles/admin-dashboard.css';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function EmptyUsers({ isFiltered }) {
  return (
    <div className="admin-empty-state">
      <svg className="admin-empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <p className="admin-empty-state__title">
        {isFiltered ? 'No matching users' : 'No users yet'}
      </p>
      <p className="admin-empty-state__desc">
        {isFiltered
          ? 'Try a different search term.'
          : 'Users who sign up will appear here.'}
      </p>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchAdminUsers()
      .then((data) => { if (mounted) setUsers(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.display_name || '').toLowerCase().includes(q));
  }, [users, search]);

  const isFiltered = Boolean(search.trim());

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Users</h1>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <span className="admin-search-icon"><SearchIcon /></span>
          <input
            id="users-search"
            type="text"
            className="admin-search-input"
            placeholder="Search by username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="admin-result-count">
          {filtered.length.toLocaleString()} {filtered.length === 1 ? 'user' : 'users'}
          {isFiltered ? ' matching' : ' total'}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="admin-empty-state">
          <p className="admin-empty-state__title">Loading…</p>
        </div>
      ) : error ? (
        <div className="admin-empty-state">
          <p className="admin-empty-state__title">Failed to load users</p>
          <p className="admin-empty-state__desc">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyUsers isFiltered={isFiltered} />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Join Date</th>
                <th>Habits</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="admin-username">
                      {user.display_name || <span className="admin-muted">No name set</span>}
                    </span>
                  </td>
                  <td className="admin-date">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <span className="admin-count-badge">{user.habitCount}</span>
                  </td>
                  <td>
                    {user.currentStreak > 0 ? (
                      <span className="admin-streak">
                        🔥 {user.currentStreak}d
                      </span>
                    ) : (
                      <span className="admin-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
