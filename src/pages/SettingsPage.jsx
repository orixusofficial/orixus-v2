import { useState } from 'react';
import '../styles/dashboard.css';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-quote">“Optimize the environment to ensure compliance.”</p>
      </div>

      <div className="settings-layout">
        <div className="settings-section-card">
          <h3 className="section-title settings-section-title">Tactical Interfaces</h3>
          
          <div className="settings-option-item">
            <div className="settings-option-info">
              <span className="settings-option-label">Audio Affirmations</span>
              <span className="settings-option-desc">Play sleek metal cues on checkmark completion</span>
            </div>
            <button 
              className={`settings-toggle-btn ${soundEnabled ? 'toggle-active' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="settings-option-item">
            <div className="settings-option-info">
              <span className="settings-option-label">Haptic Vibration Cues</span>
              <span className="settings-option-desc">Trigger mechanical ticks when cells are checked</span>
            </div>
            <button 
              className={`settings-toggle-btn ${hapticFeedback ? 'toggle-active' : ''}`}
              onClick={() => setHapticFeedback(!hapticFeedback)}
            >
              {hapticFeedback ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="settings-option-item">
            <div className="settings-option-info">
              <span className="settings-option-label">High-Contrast Glow Modes</span>
              <span className="settings-option-desc">Elevate gold borders and check box luminescence</span>
            </div>
            <button 
              className={`settings-toggle-btn ${highContrast ? 'toggle-active' : ''}`}
              onClick={() => setHighContrast(!highContrast)}
            >
              {highContrast ? 'ACTIVE' : 'INACTIVE'}
            </button>
          </div>
        </div>

        <div className="settings-section-card">
          <h3 className="section-title settings-section-title">Operations Notifications</h3>
          
          <div className="settings-option-item">
            <div className="settings-option-info">
              <span className="settings-option-label">Evening Realignment Prompts</span>
              <span className="settings-option-desc">Notify at 9:00 PM if commitments remain incomplete</span>
            </div>
            <button 
              className={`settings-toggle-btn ${dailyReminder ? 'toggle-active' : ''}`}
              onClick={() => setDailyReminder(!dailyReminder)}
            >
              {dailyReminder ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
