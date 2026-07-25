import { useState, useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useAuth } from '../contexts/AuthContext';
import { submitFeedback } from '../services/feedback';
import '../styles/dashboard.css';

const AVATAR_COLORS = [
  { name: 'Gold', value: '#A79277' },
  { name: 'Blue', value: '#5B8FB9' },
  { name: 'Purple', value: '#8B5FB9' },
  { name: 'Green', value: '#5FB977' },
  { name: 'Red', value: '#B95B5B' },
];

const JOURNAL_MOODS = [
  { value: 'FAILED', label: 'Failed', color: '#a85454' },
  { value: 'NEUTRAL', label: 'Neutral', color: '#A0A5AD' },
  { value: 'GOOD', label: 'Good', color: '#4A90E2' },
  { value: 'STRONG', label: 'Strong', color: '#5cb85c' },
  { value: 'EXCELLENT', label: 'Excellent', color: '#B38E46' },
];

const SETTINGS_ICONS = {
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  palette: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  book: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  layout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  trash: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  refresh: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  starOutline: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm' }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`dashboard-modal-overlay ${isOpen ? 'dashboard-modal-overlay--visible' : ''}`} onClick={onClose}>
      <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="dashboard-modal__title">{title}</h3>
        <p className="dashboard-modal__desc">{message}</p>
        <div className="dashboard-modal__actions">
          <button className="dashboard-modal__btn dashboard-modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="dashboard-modal__btn dashboard-modal__btn--primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ isOpen, onClose, onSave, title, currentValue, type = 'text', options = [] }) {
  const [value, setValue] = useState(currentValue);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <div className={`dashboard-modal-overlay ${isOpen ? 'dashboard-modal-overlay--visible' : ''}`} onClick={onClose}>
      <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="dashboard-modal__title">{title}</h3>
        {type === 'select' ? (
          <div className="settings-modal-select-group">
            {options.map((option) => (
              <button
                key={option.value}
                className={`settings-modal-select-btn ${value === option.value ? 'settings-modal-select-btn--active' : ''}`}
                onClick={() => setValue(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : type === 'mood' ? (
          <div className="journal-discipline-selector">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`journal-discipline-pill ${value === option.value ? 'journal-discipline-pill--selected' : ''}`}
                style={{ '--mood-color': option.color }}
                onClick={() => setValue(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : type === 'color' ? (
          <div className="settings-modal-color-group">
            {options.map((color) => (
              <button
                key={color.value}
                className={`settings-modal-color-btn ${value === color.value ? 'settings-modal-color-btn--active' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setValue(color.value)}
                title={color.name}
              />
            ))}
          </div>
        ) : (
          <input
            type="text"
            className="dashboard-modal__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        )}
        <div className="dashboard-modal__actions">
          <button className="dashboard-modal__btn dashboard-modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="dashboard-modal__btn dashboard-modal__btn--primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage({ onLoggedOut, profile: profileProp, updateProfileSettings: updateProfileSettingsProp, refresh: refreshProp }) {
  const { signOut, user } = useAuth();
  const { resetAllHabits, resetStreak, deleteAllJournalEntries } = useUserData();
  const profile = profileProp;
  const updateProfileSettings = updateProfileSettingsProp;
  const refresh = refreshProp;
  const [username, setUsername] = useState(profile?.display_name || '');
  const [selectedColor, setSelectedColor] = useState(profile?.avatar_color || '#A79277');
  const [journalMood, setJournalMood] = useState(profile?.default_discipline_state || 'NEUTRAL');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(profile?.first_day_of_week || 'monday');
  const [habitDisplayMode, setHabitDisplayMode] = useState(profile?.habit_display_mode || 'date');
  const [notification, setNotification] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Feedback form state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackAllowContact, setFeedbackAllowContact] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000);
  };

  // Sync local state with profile prop changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.display_name || '');
      setSelectedColor(profile.avatar_color || '#A79277');
      setJournalMood(profile.default_discipline_state || 'NEUTRAL');
      setFirstDayOfWeek(profile.first_day_of_week || 'monday');
      setHabitDisplayMode(profile.habit_display_mode || 'date');
    }
  }, [profile]);

  const handleSaveUsername = async (value) => {
    try {
      await updateProfileSettings({ display_name: value });
      setUsername(value);
      await refresh();
      showNotification('Username updated successfully');
    } catch (error) {
      showNotification('Failed to update username', 'error');
    }
  };

  const handleSaveAvatarColor = async (color) => {
    try {
      setSelectedColor(color);
      await updateProfileSettings({ avatar_color: color });
      await refresh();
      showNotification('Avatar color updated successfully');
    } catch (error) {
      showNotification('Failed to update avatar color', 'error');
    }
  };

  const handleSaveJournalMood = async (mood) => {
    try {
      setJournalMood(mood);
      await updateProfileSettings({ default_discipline_state: mood });
      await refresh();
      showNotification('Default journal mood updated successfully');
    } catch (error) {
      console.error(error);
      showNotification('Failed to update journal mood', 'error');
    }
  };

  const handleSaveFirstDayOfWeek = async (day) => {
    try {
      setFirstDayOfWeek(day);
      await updateProfileSettings({ first_day_of_week: day });
      await refresh();
      showNotification('First day of week updated successfully');
    } catch (error) {
      showNotification('Failed to update first day of week', 'error');
    }
  };

  const handleSaveHabitDisplayMode = async (mode) => {
    try {
      setHabitDisplayMode(mode);
      await updateProfileSettings({ habit_display_mode: mode });
      await refresh();
      showNotification('Habit display mode updated successfully');
    } catch (error) {
      showNotification('Failed to update habit display mode', 'error');
    }
  };

  const handleConfirmResetAllHabits = async () => {
    try {
      await resetAllHabits();
      await refresh();
      showNotification('All habits and completions reset successfully');
      setConfirmAction(null);
    } catch (error) {
      showNotification('Failed to reset habits', 'error');
    }
  };

  const handleConfirmResetStreak = async () => {
    try {
      await resetStreak();
      await refresh();
      showNotification('Streak reset successfully');
      setConfirmAction(null);
    } catch (error) {
      showNotification('Failed to reset streak', 'error');
    }
  };

  const handleConfirmDeleteJournal = async () => {
    try {
      await deleteAllJournalEntries();
      await refresh();
      showNotification('All journal entries deleted successfully');
      setConfirmAction(null);
    } catch (error) {
      showNotification('Failed to delete journal entries', 'error');
    }
  };

  const getInitials = () => {
    const name = profile?.display_name || '';
    if (name) {
      const parts = name.split(' ').filter(Boolean);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    return 'DO';
  };

  const getRankLabel = () => {
    // Simple rank calculation based on profile data
    return 'Initiate';
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut();
      setShowLogoutConfirm(false);
      onLoggedOut?.();
    } catch (error) {
      showNotification('Failed to logout', 'error');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackRating || !feedbackCategory || !feedbackMessage.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (feedbackMessage.length > 250) {
      showNotification('Message must be 250 characters or less', 'error');
      return;
    }

    setFeedbackSubmitting(true);
    try {
      await submitFeedback({
        userId: user.id,
        rating: feedbackRating,
        category: feedbackCategory,
        message: feedbackMessage.trim(),
        allowContact: feedbackAllowContact,
      });
      
      setFeedbackSubmitting(false);
      setFeedbackModalOpen(false);
      showNotification('✓ Feedback Submitted');
      setFeedbackRating(0);
      setFeedbackCategory('');
      setFeedbackMessage('');
      setFeedbackAllowContact(false);
    } catch (error) {
      showNotification('Failed to submit feedback', 'error');
      setFeedbackSubmitting(false);
    }
  };

  const handleFeedbackModalClose = () => {
    if (!feedbackSubmitting) {
      setFeedbackModalOpen(false);
      setFeedbackRating(0);
      setFeedbackCategory('');
      setFeedbackMessage('');
      setFeedbackAllowContact(false);
    }
  };

  return (
    <div className="settings-page">
      {notification && (
        <div className={`settings-notification settings-notification--${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Profile Card */}
      <div className="settings-profile-card" onClick={() => setEditModal({ type: 'username', title: 'Edit Username' })}>
        <div className="settings-profile-card__left">
          <div className="settings-profile-avatar" style={{ backgroundColor: selectedColor }}>
            <span className="settings-profile-avatar__letters">{getInitials()}</span>
          </div>
          <div className="settings-profile-card__info">
            <span className="settings-profile-card__name">{profile?.display_name || 'Dev Operator'}</span>
            <span className="settings-profile-card__rank">{getRankLabel()}</span>
          </div>
        </div>
        <div className="settings-profile-card__right">
          {SETTINGS_ICONS.chevronRight}
        </div>
      </div>

      {/* Settings List */}
      <div className="settings-list">
        {/* Appearance Section */}
        <div className="settings-list-section">
          <h3 className="settings-list-section__title">Appearance</h3>
          
          <div className="settings-list-item" onClick={() => setEditModal({ type: 'color', title: 'Avatar Color' })}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.palette}</div>
            <span className="settings-list-item__label">Avatar Color</span>
            <div className="settings-list-item__right">
              <div className="settings-color-preview" style={{ backgroundColor: selectedColor }} />
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-list-section">
          <h3 className="settings-list-section__title">Preferences</h3>
          
          <div className="settings-list-item" onClick={() => setEditModal({ type: 'mood', title: 'Default Journal Mood' })}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.book}</div>
            <span className="settings-list-item__label">Default Journal Mood</span>
            <div className="settings-list-item__right">
              <span className="settings-list-item__value">{JOURNAL_MOODS.find(m => m.value === journalMood)?.label || 'Neutral'}</span>
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>

          <div className="settings-list-item" onClick={() => setEditModal({ type: 'firstDay', title: 'First Day of Week' })}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.calendar}</div>
            <span className="settings-list-item__label">First Day of Week</span>
            <div className="settings-list-item__right">
              <span className="settings-list-item__value">{firstDayOfWeek === 'monday' ? 'Monday' : 'Sunday'}</span>
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>

          <div className="settings-list-item" onClick={() => setEditModal({ type: 'displayMode', title: 'Habit Display Mode' })}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.layout}</div>
            <span className="settings-list-item__label">Habit Display Mode</span>
            <div className="settings-list-item__right">
              <span className="settings-list-item__value">{habitDisplayMode === 'date' ? 'Date' : 'Number'}</span>
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="settings-list-section settings-list-section--danger">
          <h3 className="settings-list-section__title">Danger Zone</h3>

          <div className="settings-list-item" onClick={() => setConfirmAction('resetAllHabits')}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.refresh}</div>
            <span className="settings-list-item__label">Reset All Habits</span>
            <div className="settings-list-item__right">
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>

          <div className="settings-list-item" onClick={() => setConfirmAction('resetStreak')}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.refresh}</div>
            <span className="settings-list-item__label">Reset Streak</span>
            <div className="settings-list-item__right">
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>

          <div className="settings-list-item settings-list-item--destructive" onClick={() => setConfirmAction('deleteJournal')}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.trash}</div>
            <span className="settings-list-item__label">Delete All Journal Entries</span>
            <div className="settings-list-item__right">
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>
        </div>

        {/* Help & Feedback Section */}
        <div className="settings-list-section">
          <h3 className="settings-list-section__title">Help & Feedback</h3>
          
          <div className="settings-feedback-card" onClick={() => setFeedbackModalOpen(true)}>
            <div className="settings-feedback-card__icon">💬</div>
            <div className="settings-feedback-card__content">
              <h4 className="settings-feedback-card__title">Feedback</h4>
              <p className="settings-feedback-card__description">
                Help improve Orixus by sharing bugs, ideas or suggestions.
              </p>
            </div>
            <div className="settings-feedback-card__button">
              Give Feedback
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="settings-list-section">
          <div className="settings-list-item settings-list-item--accent" onClick={handleLogout}>
            <div className="settings-list-item__icon">{SETTINGS_ICONS.logout}</div>
            <span className="settings-list-item__label">Logout</span>
            <div className="settings-list-item__right">
              {SETTINGS_ICONS.chevronRight}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        onSave={(value) => {
          if (editModal?.type === 'username') handleSaveUsername(value);
          else if (editModal?.type === 'color') handleSaveAvatarColor(value);
          else if (editModal?.type === 'mood') handleSaveJournalMood(value);
          else if (editModal?.type === 'firstDay') handleSaveFirstDayOfWeek(value);
          else if (editModal?.type === 'displayMode') handleSaveHabitDisplayMode(value);
        }}
        title={editModal?.title || ''}
        currentValue={editModal?.type === 'username' ? username : 
                     editModal?.type === 'color' ? selectedColor :
                     editModal?.type === 'mood' ? journalMood :
                     editModal?.type === 'firstDay' ? firstDayOfWeek :
                     editModal?.type === 'displayMode' ? habitDisplayMode : ''}
        type={editModal?.type === 'username' ? 'text' :
              editModal?.type === 'color' ? 'color' :
              editModal?.type === 'mood' ? 'mood' : 'select'}
        options={editModal?.type === 'color' ? AVATAR_COLORS :
                editModal?.type === 'mood' ? JOURNAL_MOODS :
                editModal?.type === 'firstDay' ? [{ value: 'monday', label: 'Monday' }, { value: 'sunday', label: 'Sunday' }] :
                editModal?.type === 'displayMode' ? [{ value: 'date', label: 'Date' }, { value: 'number', label: 'Number' }] : []}
      />

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmAction === 'resetAllHabits'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmResetAllHabits}
        title="Reset All Habits"
        message="Are you sure? This will delete all your habits and their completion history. This cannot be undone."
      />

      <ConfirmationModal
        isOpen={confirmAction === 'resetStreak'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmResetStreak}
        title="Reset Streak"
        message="Are you sure? This will clear all your completion history but keep your habits. This cannot be undone."
      />

      <ConfirmationModal
        isOpen={confirmAction === 'deleteJournal'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmDeleteJournal}
        title="Delete All Journal Entries"
        message="Are you sure? This will permanently delete all your journal entries. This cannot be undone."
      />

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Sign out?"
        message="Are you sure you want to sign out of your Orixus account?"
        confirmText="Sign Out"
      />

      {/* Feedback Modal */}
      <div className={`dashboard-modal-overlay ${feedbackModalOpen ? 'dashboard-modal-overlay--visible' : ''}`} onClick={handleFeedbackModalClose}>
        <div className="dashboard-modal dashboard-modal--feedback" onClick={(e) => e.stopPropagation()}>
          <h3 className="dashboard-modal__title">Give Feedback</h3>
          <form onSubmit={handleFeedbackSubmit} className="settings-feedback-form">
            <div className="settings-feedback-rating">
              <label className="settings-feedback-label">Rating</label>
              <div className="settings-feedback-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`settings-feedback-star ${star <= feedbackRating ? 'settings-feedback-star--active' : ''}`}
                    onClick={() => setFeedbackRating(star)}
                    aria-label={`Rate ${star} stars`}
                    disabled={feedbackSubmitting}
                  >
                    {star <= feedbackRating ? SETTINGS_ICONS.star : SETTINGS_ICONS.starOutline}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-feedback-field">
              <label className="settings-feedback-label" htmlFor="feedback-category">Category</label>
              <select
                id="feedback-category"
                className="settings-feedback-select"
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                required
                disabled={feedbackSubmitting}
              >
                <option value="">Select category</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="UI / UX">UI / UX</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>

            <div className="settings-feedback-field">
              <label className="settings-feedback-label" htmlFor="feedback-message">Feedback</label>
              <textarea
                id="feedback-message"
                className="settings-feedback-textarea"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                maxLength={250}
                placeholder="Share your thoughts..."
                required
                disabled={feedbackSubmitting}
              />
              <div className="settings-feedback-char-count">
                {feedbackMessage.length}/250
              </div>
            </div>

            <div className="settings-feedback-checkbox">
              <label className="settings-feedback-checkbox-label">
                <input
                  type="checkbox"
                  checked={feedbackAllowContact}
                  onChange={(e) => setFeedbackAllowContact(e.target.checked)}
                  disabled={feedbackSubmitting}
                />
                <span>Allow us to contact you regarding this feedback.</span>
              </label>
            </div>

            <div className="dashboard-modal__actions">
              <button
                type="button"
                className="dashboard-modal__btn dashboard-modal__btn--secondary"
                onClick={handleFeedbackModalClose}
                disabled={feedbackSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="dashboard-modal__btn dashboard-modal__btn--primary"
                disabled={feedbackSubmitting}
              >
                {feedbackSubmitting ? (
                  <span className="feedback-submitting">
                    <span className="feedback-spinner"></span>
                    Submitting...
                  </span>
                ) : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
