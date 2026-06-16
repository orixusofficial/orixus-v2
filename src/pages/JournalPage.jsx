import { useState } from 'react';
import '../styles/dashboard.css';

export default function JournalPage({ entries = [], onAddEntry }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('EXCELLENT');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const MOOD_OPTIONS = [
    { value: 'FAILED', label: 'Failed', color: '#a85454' },
    { value: 'NEUTRAL', label: 'Neutral', color: '#A0A5AD' },
    { value: 'GOOD', label: 'Good', color: '#4A90E2' },
    { value: 'STRONG', label: 'Strong', color: '#5cb85c' },
    { value: 'EXCELLENT', label: 'Excellent', color: '#B38E46' },
  ];

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
    } catch (err) {
      setError(err.message ?? 'Could not save entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="journal-page">
      <div className="page-header">
        <h1 className="page-title">Tactical Journal</h1>
        <p className="page-quote">“Write to clear the fog. Reflect to reinforce standard behaviors.”</p>
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
          {entries.length === 0 ? (
            <p className="auth-shell__hint">No entries yet. Log your first reflection above.</p>
          ) : (
            entries.map((entry) => {
              const moodOption = MOOD_OPTIONS.find(m => m.value === entry.mood) || MOOD_OPTIONS[2];
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
  );
}
