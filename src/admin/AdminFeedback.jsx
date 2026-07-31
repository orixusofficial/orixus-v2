import { useState, useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';
import { fetchAllFeedback, deleteFeedback } from '../services/feedback';
import '../styles/admin-dashboard.css';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function Stars({ rating }) {
  return (
    <div className="admin-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`admin-star${s <= rating ? ' admin-star--filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

function FeedbackModal({ isOpen, onClose, feedback }) {
  const [toast, setToast] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedback.message);
      setToast('Message copied.');
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (!isOpen || !feedback) return null;

  return (
    <>
      <div className="admin-feedback-modal-overlay" onClick={onClose}>
        <div 
          className="admin-feedback-modal" 
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
        >
          <div className="admin-feedback-modal__header">
            <h2 className="admin-feedback-modal__title">Feedback Details</h2>
          </div>

          <div className="admin-feedback-modal__content">
            <div className="admin-feedback-modal__row">
              <span className="admin-feedback-modal__label">Username</span>
              <span className="admin-feedback-modal__value">
                {feedback.display_name || '—'}
              </span>
            </div>

            <div className="admin-feedback-modal__row">
              <span className="admin-feedback-modal__label">Category</span>
              <span className="admin-feedback-modal__value">{feedback.category}</span>
            </div>

            <div className="admin-feedback-modal__row">
              <span className="admin-feedback-modal__label">Rating</span>
              <div className="admin-feedback-modal__rating">
                <Stars rating={feedback.rating} />
              </div>
            </div>

            <div className="admin-feedback-modal__row">
              <span className="admin-feedback-modal__label">Date</span>
              <span className="admin-feedback-modal__value">
                {new Date(feedback.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="admin-feedback-modal__message-section">
              <span className="admin-feedback-modal__label">Message</span>
              <p className="admin-feedback-modal__message">{feedback.message}</p>
            </div>
          </div>

          <div className="admin-feedback-modal__actions">
            <button
              className="admin-feedback-modal__btn admin-feedback-modal__btn--secondary"
              onClick={handleCopy}
            >
              Copy Message
            </button>
            <button
              className="admin-feedback-modal__btn admin-feedback-modal__btn--primary"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {toast && (
            <div className="admin-feedback-modal__toast">
              {toast}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchAllFeedback()
      .then((data) => { if (mounted) setFeedback(data); })
      .catch((err) => { 
        console.error('Fetch feedback error:', err);
        if (mounted) setError(err.message); 
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = feedback.filter((item) => {
    const q = search.trim().toLowerCase();
    const name = (item.display_name || '').toLowerCase();
    const msg = (item.message || '').toLowerCase();
    return !q || name.includes(q) || msg.includes(q);
  });

  async function handleDelete(id) {
    const ok = window.confirm('Delete this feedback entry? This cannot be undone.');
    if (!ok) return;

    setDeletingId(id);
    try {
      await deleteFeedback(id);
      setFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Delete feedback error:', err);
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Feedback</h1>

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <span className="admin-search-icon"><SearchIcon /></span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by username or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {!loading && !error && (
        <p className="admin-result-count">
          {filtered.length.toLocaleString()} {filtered.length === 1 ? 'entry' : 'entries'}
        </p>
      )}

      {loading ? (
        <div className="admin-empty-state">
          <p className="admin-empty-state__title">Loading…</p>
        </div>
      ) : error ? (
        <div className="admin-empty-state">
          <p className="admin-empty-state__title">Failed to load feedback</p>
          <p className="admin-empty-state__desc">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <p className="admin-empty-state__title">No feedback yet</p>
          <p className="admin-empty-state__desc">Feedback submitted by users will appear here.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="admin-username">
                      {item.display_name ?? <span className="admin-muted">—</span>}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <Stars rating={item.rating} />
                  </td>
                  <td>
                    <span className="admin-table__message" title={item.message}>
                      {item.message}
                    </span>
                  </td>
                  <td className="admin-date">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="admin-table__action-cell">
                    <button
                      className="admin-view-btn"
                      onClick={() => setViewingFeedback(item)}
                      aria-label="View feedback"
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      aria-label="Delete feedback"
                      title="Delete"
                    >
                      {deletingId === item.id ? '…' : <TrashIcon />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FeedbackModal
        isOpen={!!viewingFeedback}
        onClose={() => setViewingFeedback(null)}
        feedback={viewingFeedback}
      />
    </div>
  );
}
