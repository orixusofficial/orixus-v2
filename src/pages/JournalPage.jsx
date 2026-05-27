import { useState } from 'react';
import '../styles/dashboard.css';

export default function JournalPage() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "May 27, 2026",
      title: "Mental Resistance Defeated",
      content: "Woke up wanting to delay the workout. Practiced the 5-second rule and moved immediately. Focus was sharp. Discipline compounds when physical friction is highest.",
      mood: "EXCELLENT"
    },
    {
      id: 2,
      date: "May 26, 2026",
      title: "Consistency Checklist Completed",
      content: "All 5 habits completed before 8 PM. Sleep early is becoming easier to maintain. Visualizing targets at night helps eliminate morning hesitation.",
      mood: "GOOD"
    }
  ]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('EXCELLENT');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: title.trim(),
      content: content.trim(),
      mood
    };

    setEntries([newEntry, ...entries]);
    setTitle('');
    setContent('');
  };

  return (
    <div className="journal-page">
      <div className="dashboard-overview__header">
        <h1 className="dashboard-overview__title">Tactical Journal</h1>
        <p className="dashboard-overview__quote">“Write to clear the fog. Reflect to reinforce standard behaviors.”</p>
      </div>

      <div className="journal-layout">
        {/* Entry Creator */}
        <div className="journal-form-panel">
          <h3 className="journal-section-title">New Reflection</h3>
          <form onSubmit={handleSubmit} className="journal-form">
            <div className="journal-form-group">
              <input 
                type="text" 
                className="journal-input" 
                placeholder="Entry Focus (e.g. Friction Point Solved)"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            
            <div className="journal-form-group">
              <textarea 
                className="journal-textarea" 
                placeholder="Log your thoughts, challenges defeated, or tactical lessons..."
                value={content}
                onChange={e => setContent(e.target.value)}
                rows="5"
              />
            </div>

            <div className="journal-form-row">
              <div className="journal-form-group">
                <label className="journal-label">Discipline State</label>
                <select 
                  className="journal-select"
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                >
                  <option value="EXCELLENT">EXCELLENT (TOTAL COMMITMENT)</option>
                  <option value="GOOD">GOOD (CONSISTENT)</option>
                  <option value="NEUTRAL">NEUTRAL (SURVIVED)</option>
                  <option value="FAILED">SLIPPING (REQUIRED ALIGNMENT)</option>
                </select>
              </div>

              <button type="submit" className="journal-submit-btn">
                Commit Entry
              </button>
            </div>
          </form>
        </div>

        {/* Entries list */}
        <div className="journal-entries-list">
          <h3 className="journal-section-title">Historical Logs</h3>
          {entries.map((entry) => (
            <div key={entry.id} className="journal-entry-card">
              <div className="journal-entry-header">
                <span className="journal-entry-date">{entry.date}</span>
                <span className={`journal-entry-mood mood-${entry.mood.toLowerCase()}`}>{entry.mood}</span>
              </div>
              <h4 className="journal-entry-title">{entry.title}</h4>
              <p className="journal-entry-content">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
