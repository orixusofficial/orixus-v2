import { useState, useEffect } from 'react';
import '../styles/dashboard.css';

export default function JournalPage({ entries = [], onAddEntry, defaultMood = 'neutral' }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(defaultMood);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  const MOOD_OPTIONS = [
    { value: 'failed', label: 'Failed', color: '#a85454' },
    { value: 'neutral', label: 'Neutral', color: '#A0A5AD' },
    { value: 'good', label: 'Good', color: '#4A90E2' },
    { value: 'strong', label: 'Strong', color: '#5cb85c' },
    { value: 'excellent', label: 'Excellent', color: '#B38E46' },
  ];

  useEffect(() => {
    setMood((defaultMood || 'neutral').toLowerCase());
  }, [defaultMood]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setError('');
    setSubmitting(true);
    try {
      await onAddEntry({
        title: title.trim(),
        content: content.trim(),
        mood,
      });
      setTitle('');
      setContent('');
      setComposeOpen(false);
    } catch (err) {
      setError(err.message ?? 'Could not save entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCompose = () => {
    setComposeOpen(true);
  };

  const handleCloseCompose = () => {
    setComposeOpen(false);
    setTitle('');
    setContent('');
    setError('');
  };

  return (
    <div className="journal-page">
      <div className="page-header">
        <h1 className="page-title">Tactical Journal</h1>
        <p className="page-quote">"Write to clear the fog. Reflect to reinforce standard behaviors."</p>
      </div>

      <div className="journal-layout">
        <div className="journal-form-panel">
          <h3 className="section-title journal-section-title">New Reflection</h3>
          <form onSubmit={handleSubmit} className="journal-form">
            <div className="journal-form-group">
              <label className="journal-label">Entry Focus</label>
              <input
                type="text"
                className="journal-input journal-input--enhanced"
                placeholder="e.g. Friction Point Solved"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="journal-form-group">
              <label className="journal-label">Reflection Details</label>
              <textarea
                className="journal-textarea journal-textarea--enhanced"
                placeholder="Log your thoughts, challenges defeated, or tactical lessons..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="journal-form-group">
              <label className="journal-label">How was your discipline today?</label>
              <div className="journal-discipline-selector">
                {MOOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`journal-discipline-pill ${mood === option.value ? 'journal-discipline-pill--selected' : ''}`}
                    style={{ '--mood-color': option.color }}
                    onClick={() => setMood(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="journal-submit-btn journal-submit-btn--full" disabled={submitting}>
              {submitting ? 'Saving…' : 'Commit Entry'}
            </button>
            {error && <p className="auth-form__error">{error}</p>}
          </form>
        </div>

        <div className="journal-entries-list">
          <h3 className="section-title journal-section-title">Historical Logs</h3>
          <div className="journal-entries-scroll">
            {entries.length === 0 ? (
              <p className="auth-shell__hint">No entries yet. Log your first reflection above.</p>
            ) : (
              entries.map((entry) => {
                const moodOption = MOOD_OPTIONS.find(m => m.value === (entry.mood || 'neutral').toLowerCase()) || MOOD_OPTIONS[2];
                return (
                  <div key={entry.id} className="journal-entry-card" style={{ '--card-border-color': moodOption.color }}>
                    <div className="journal-entry-header">
                      <span className="journal-entry-date">{entry.date}</span>
                      <span className="journal-entry-mood journal-entry-mood--prominent" style={{ '--mood-bg': moodOption.color, '--mood-color': moodOption.color }}>
                        {entry.mood}
                      </span>
                    </div>
                    <h4 className="journal-entry-title">{entry.title}</h4>
                    <p className="journal-entry-content">{entry.content}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button className="journal-fab" onClick={handleOpenCompose} aria-label="Compose">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {/* Mobile Compose Screen */}
      {composeOpen && (
        <div className="journal-compose-overlay">
          <div className="journal-compose-screen">
            <div className="journal-compose-nav">
              <button className="journal-compose-back" onClick={handleCloseCompose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button className="journal-compose-save" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Committing…' : 'Commit'}
              </button>
            </div>
            <div className="journal-compose-content">
              <input
                type="text"
                className="journal-compose-title"
                placeholder="Entry Focus"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="journal-compose-textarea"
                placeholder="Log your thoughts, challenges defeated, or tactical lessons..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="journal-compose-discipline">
              <div className="journal-discipline-selector">
                {MOOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`journal-discipline-pill ${mood === option.value ? 'journal-discipline-pill--selected' : ''}`}
                    style={{ '--mood-color': option.color }}
                    onClick={() => setMood(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="auth-form__error journal-compose-error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
