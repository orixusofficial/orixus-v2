import { useState } from 'react';
import '../styles/dashboard.css';

export default function JournalPage({ entries = [], onAddEntry }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('EXCELLENT');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
              <input
                type="text"
                className="journal-input"
                placeholder="Entry Focus (e.g. Friction Point Solved)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="journal-form-group">
              <textarea
                className="journal-textarea"
                placeholder="Log your thoughts, challenges defeated, or tactical lessons..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
              />
            </div>

            <div className="journal-form-row">
              <div className="journal-form-group">
                <label className="journal-label">Discipline State</label>
                <select className="journal-select" value={mood} onChange={(e) => setMood(e.target.value)}>
                  <option value="EXCELLENT">EXCELLENT (TOTAL COMMITMENT)</option>
                  <option value="GOOD">GOOD (CONSISTENT)</option>
                  <option value="NEUTRAL">NEUTRAL (SURVIVED)</option>
                  <option value="FAILED">SLIPPING (REQUIRED ALIGNMENT)</option>
                </select>
              </div>

              <button type="submit" className="journal-submit-btn" disabled={submitting}>
                {submitting ? 'Saving…' : 'Commit Entry'}
              </button>
            </div>
            {error && <p className="auth-form__error">{error}</p>}
          </form>
        </div>

        <div className="journal-entries-list">
          <h3 className="section-title journal-section-title">Historical Logs</h3>
          {entries.length === 0 ? (
            <p className="auth-shell__hint">No entries yet. Log your first reflection above.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="journal-entry-card">
                <div className="journal-entry-header">
                  <span className="journal-entry-date">{entry.date}</span>
                  <span className={`journal-entry-mood mood-${entry.mood.toLowerCase()}`}>{entry.mood}</span>
                </div>
                <h4 className="journal-entry-title">{entry.title}</h4>
                <p className="journal-entry-content">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
