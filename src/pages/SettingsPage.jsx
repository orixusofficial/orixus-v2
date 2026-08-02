import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, Info, ExternalLink, User, Bell, Book, Layout, RefreshCw, Trash, LogOut, MessageSquare, ChevronRight, Check, X, Upload, Image as ImageIcon, UserRound, Shield, AlertCircle, Star } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';
import { useAuth } from '../contexts/AuthContext';
import { submitFeedback } from '../services/feedback';
import { uploadAvatar, getAvatarSignedUrl } from '../services/avatar';
import '../styles/dashboard.css';

const ORIXUS_VERSION = '1.0.0';

const JOURNAL_MOODS = [
  { value: 'FAILED', label: 'Failed', color: '#a85454' },
  { value: 'NEUTRAL', label: 'Neutral', color: '#A0A5AD' },
  { value: 'GOOD', label: 'Good', color: '#4A90E2' },
  { value: 'STRONG', label: 'Strong', color: '#5cb85c' },
  { value: 'EXCELLENT', label: 'Excellent', color: '#B38E46' },
];


// Reusable SettingsRow component
function SettingsRow({ icon, label, right, onClick, disabled = false, destructive = false }) {
  return (
    <button
      className={`orixus-settings-row ${disabled ? 'orixus-settings-row--disabled' : ''} ${destructive ? 'orixus-settings-row--destructive' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="orixus-settings-row__icon">{icon}</div>
      <span className="orixus-settings-row__label">{label}</span>
      <div className="orixus-settings-row__right">{right}</div>
    </button>
  );
}

// Premium Toggle component
function PremiumToggle({ enabled, onChange, disabled = false }) {
  const toggleId = useRef(`orixus-toggle-${Math.random().toString(36).substr(2, 9)}`).current;

  const handleChange = (e) => {
    const newValue = e.target.checked;
    onChange(newValue);
  };

  return (
    <div className="orixus-toggle-container">
      <input
        id={toggleId}
        type="checkbox"
        className="orixus-toggle-checkbox"
        checked={enabled}
        onChange={handleChange}
        disabled={disabled}
        aria-label={enabled ? 'Disable reminders' : 'Enable reminders'}
      />
      <label htmlFor={toggleId} className="orixus-toggle-switch">
        <span className="orixus-toggle-slider" />
      </label>
    </div>
  );
}

// Status Pill component
function StatusPill({ status }) {
  const isVerified = status === 'verified';
  return (
    <span className={`orixus-status-pill ${isVerified ? 'orixus-status-pill--verified' : 'orixus-status-pill--pending'}`}>
      {isVerified ? 'Verified' : 'Not Verified'}
    </span>
  );
}

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
    <div className={`orixus-modal-overlay ${isOpen ? 'orixus-modal-overlay--visible' : ''}`} onClick={onClose}>
      <div className="orixus-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="orixus-modal__title">{title}</h3>
        <p className="orixus-modal__desc">{message}</p>
        <div className="orixus-modal__actions">
          <button className="orixus-modal__btn orixus-modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="orixus-modal__btn orixus-modal__btn--primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ 
  isOpen, 
  onClose, 
  currentPassword, 
  setCurrentPassword, 
  newPassword, 
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword, 
  showCurrentPassword, 
  setShowCurrentPassword, 
  showNewPassword, 
  setShowNewPassword, 
  showConfirmPassword, 
  setShowConfirmPassword, 
  passwordHealth, 
  passwordError, 
  passwordSuccess, 
  updatingPassword, 
  handlePasswordChange, 
  lastPasswordUpdate 
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="orixus-modal-overlay" onClick={onClose}>
      <div 
        className="orixus-modal orixus-modal--password" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="orixus-modal__header">
          <h2 className="orixus-modal__title">Change Password</h2>
          <button className="orixus-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div className="orixus-modal__field">
            <label className="orixus-modal__label" htmlFor="current-password">
              Current Password
            </label>
            <div className="orixus-modal__input-wrapper">
              <input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                className="orixus-modal__input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                disabled={updatingPassword}
              />
              <button
                type="button"
                className="orixus-modal__toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={updatingPassword}
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="orixus-modal__field">
            <label className="orixus-modal__label" htmlFor="new-password">
              New Password
            </label>
            <div className="orixus-modal__input-wrapper">
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                className="orixus-modal__input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={updatingPassword}
              />
              <button
                type="button"
                className="orixus-modal__toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={updatingPassword}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {newPassword && (
              <div className="orixus-modal__health">
                <div className="orixus-modal__strength">
                  <span className="orixus-modal__strength-label">Strength:</span>
                  <span className={`orixus-modal__strength-value orixus-modal__strength-value--${passwordHealth.strength.toLowerCase()}`}>
                    {passwordHealth.strength}
                  </span>
                </div>
                <div className="orixus-modal__checks">
                  <div className={`orixus-modal__check ${passwordHealth.checks.length ? 'orixus-modal__check--valid' : ''}`}>
                    {passwordHealth.checks.length ? <ShieldCheck size={12} /> : <Lock size={12} />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`orixus-modal__check ${passwordHealth.checks.uppercase ? 'orixus-modal__check--valid' : ''}`}>
                    {passwordHealth.checks.uppercase ? <ShieldCheck size={12} /> : <Lock size={12} />}
                    <span>Uppercase</span>
                  </div>
                  <div className={`orixus-modal__check ${passwordHealth.checks.lowercase ? 'orixus-modal__check--valid' : ''}`}>
                    {passwordHealth.checks.lowercase ? <ShieldCheck size={12} /> : <Lock size={12} />}
                    <span>Lowercase</span>
                  </div>
                  <div className={`orixus-modal__check ${passwordHealth.checks.number ? 'orixus-modal__check--valid' : ''}`}>
                    {passwordHealth.checks.number ? <ShieldCheck size={12} /> : <Lock size={12} />}
                    <span>Number</span>
                  </div>
                  <div className={`orixus-modal__check ${passwordHealth.checks.special ? 'orixus-modal__check--valid' : ''}`}>
                    {passwordHealth.checks.special ? <ShieldCheck size={12} /> : <Lock size={12} />}
                    <span>Special</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="orixus-modal__field">
            <label className="orixus-modal__label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="orixus-modal__input-wrapper">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className="orixus-modal__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={updatingPassword}
              />
              <button
                type="button"
                className="orixus-modal__toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={updatingPassword}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <span className="orixus-modal__error">Passwords do not match</span>
            )}
          </div>

          {passwordError && (
            <div className="orixus-modal__message orixus-modal__message--error">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="orixus-modal__message orixus-modal__message--success">
              {passwordSuccess}
            </div>
          )}

          <div className="orixus-modal__actions">
            <button
              type="button"
              className="orixus-modal__btn orixus-modal__btn--secondary"
              onClick={() => {
                onClose();
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordError('');
                setPasswordSuccess('');
              }}
              disabled={updatingPassword}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="orixus-modal__btn orixus-modal__btn--primary"
              disabled={updatingPassword}
            >
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          {lastPasswordUpdate && (
            <div className="orixus-modal__last-update">
              Last updated: {new Date(lastPasswordUpdate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function AboutModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="orixus-modal-overlay" onClick={onClose}>
      <div 
        className="orixus-modal orixus-modal--about" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="orixus-modal__header">
          <h2 className="orixus-modal__title">About Orixus</h2>
          <button className="orixus-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="orixus-modal__content">
          <p className="orixus-modal__description">
            Orixus helps ambitious people build discipline through consistent daily action.
          </p>

          <div className="orixus-modal__version">
            <span className="orixus-modal__version-label">Version</span>
            <span className="orixus-modal__version-value">v{ORIXUS_VERSION}</span>
          </div>

          <div className="orixus-modal__links">
            <a 
              href="https://orixus.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="orixus-modal__link"
            >
              <span>Website</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href="https://orixus.vercel.app/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="orixus-modal__link"
            >
              <span>Privacy Policy</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href="https://orixus.vercel.app/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="orixus-modal__link"
            >
              <span>Terms of Service</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="orixus-modal__footer">
          <span>© 2026 Orixus</span>
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
    <div className="orixus-modal-overlay" onClick={onClose}>
      <div className="orixus-modal" onClick={(e) => e.stopPropagation()}>
        <div className="orixus-modal__header">
          <h2 className="orixus-modal__title">{title}</h2>
          <button className="orixus-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {type === 'select' ? (
          <div className="orixus-modal__select-group">
            {options.map((option) => (
              <button
                key={option.value}
                className={`orixus-modal__select-btn ${value === option.value ? 'orixus-modal__select-btn--active' : ''}`}
                onClick={() => setValue(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : type === 'mood' ? (
          <div className="orixus-modal__mood-group">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`orixus-modal__mood-btn ${value === option.value ? 'orixus-modal__mood-btn--selected' : ''}`}
                style={{ '--mood-color': option.color }}
                onClick={() => setValue(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            className="orixus-modal__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        )}
        <div className="orixus-modal__actions">
          <button className="orixus-modal__btn orixus-modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="orixus-modal__btn orixus-modal__btn--primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileCardModal({ isOpen, onClose, profile, onUploadClick, onSaveUsername, uploadingAvatar }) {
  const [view, setView] = useState('menu');
  const [newUsername, setNewUsername] = useState(profile?.display_name || '');
  const [signedAvatarUrl, setSignedAvatarUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setView('menu');
      setNewUsername(profile?.display_name || '');
      if (profile?.avatar_url) {
        getAvatarSignedUrl(profile.avatar_url).then(setSignedAvatarUrl);
      } else {
        setSignedAvatarUrl(null);
      }
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const getInitials = () => {
    const name = profile?.display_name || '';
    if (name) {
      const parts = name.split(' ').filter(Boolean);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    return 'DO';
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (newUsername.trim()) {
      await onSaveUsername(newUsername.trim());
      onClose();
    }
  };

  return (
    <div className="orixus-modal-overlay" onClick={onClose}>
      <div className="orixus-modal orixus-modal--profile" onClick={(e) => e.stopPropagation()}>
        <div className="orixus-modal__header">
          <h2 className="orixus-modal__title">Profile</h2>
          <button className="orixus-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {view === 'menu' && (
          <>
            <div className="orixus-modal__profile-preview">
              <div className="orixus-modal__avatar">
                {signedAvatarUrl ? (
                  <img src={signedAvatarUrl} alt="Profile" className="orixus-modal__avatar-img" />
                ) : (
                  <span className="orixus-modal__avatar-fallback">{getInitials()}</span>
                )}
              </div>
              <div className="orixus-modal__user-info">
                <span className="orixus-modal__username">{profile?.display_name || 'Dev Operator'}</span>
                <span className="orixus-modal__rank">Initiate</span>
              </div>
            </div>

            <div className="orixus-modal__divider" />

            <div className="orixus-modal__actions">
              <button className="orixus-modal__action" onClick={() => setView('upload')}>
                <ImageIcon size={18} />
                <span>Upload Avatar</span>
              </button>
              <button className="orixus-modal__action" onClick={() => setView('username')}>
                <UserRound size={18} />
                <span>Edit Username</span>
              </button>
            </div>
          </>
        )}

        {view === 'upload' && (
          <>
            <div className="orixus-modal__upload-preview">
              {signedAvatarUrl ? (
                <img src={signedAvatarUrl} alt="Preview" className="orixus-modal__avatar-img" />
              ) : (
                <span className="orixus-modal__avatar-fallback">{getInitials()}</span>
              )}
            </div>

            <button
              className="orixus-modal__btn orixus-modal__btn--primary"
              onClick={() => {
                onUploadClick();
                onClose();
              }}
              disabled={uploadingAvatar}
            >
              <Upload size={18} />
              <span>{uploadingAvatar ? 'Uploading...' : 'Choose Image'}</span>
            </button>

            <div className="orixus-modal__upload-info">
              <span>PNG • JPG • WEBP</span>
              <span>Max 100 KB</span>
            </div>

            <button className="orixus-modal__btn orixus-modal__btn--secondary" onClick={() => setView('menu')}>
              Back
            </button>
          </>
        )}

        {view === 'username' && (
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              className="orixus-modal__input"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter display name"
              autoFocus
            />

            <div className="orixus-modal__actions">
              <button
                type="button"
                className="orixus-modal__btn orixus-modal__btn--secondary"
                onClick={() => setView('menu')}
              >
                Back
              </button>
              <button
                type="submit"
                className="orixus-modal__btn orixus-modal__btn--primary"
                disabled={!newUsername.trim()}
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage({ onLoggedOut, profile: profileProp, updateProfileSettings: updateProfileSettingsProp, refresh: refreshProp }) {
  const { signOut, user, reauthenticate, updatePassword } = useAuth();
  const { resetAllHabits, resetStreak, deleteAllJournalEntries } = useUserData();
  const profile = profileProp;
  const updateProfileSettings = updateProfileSettingsProp;
  const refresh = refreshProp;
  const [username, setUsername] = useState(profile?.display_name || '');
  const [journalMood, setJournalMood] = useState(profile?.default_discipline_state || 'NEUTRAL');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(profile?.first_day_of_week || 'monday');
  const [habitDisplayMode, setHabitDisplayMode] = useState(profile?.habit_display_mode || 'date');
  const [reminders, setReminders] = useState(profile?.reminders ?? true);
  const [notification, setNotification] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [profileCardModalOpen, setProfileCardModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState(null);

  const fileInputRef = useRef(null);
  
  // Feedback form state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Password change form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [lastPasswordUpdate, setLastPasswordUpdate] = useState(profile?.password_updated_at || null);

  // About modal state
  const [showAboutModal, setShowAboutModal] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync local state with profile prop changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.display_name || '');
      setJournalMood(profile.default_discipline_state || 'NEUTRAL');
      setFirstDayOfWeek(profile.first_day_of_week || 'monday');
      setHabitDisplayMode(profile.habit_display_mode || 'date');
      setLastPasswordUpdate(profile.password_updated_at || null);
      // Generate signed URL for avatar
      if (profile.avatar_url) {
        getAvatarSignedUrl(profile.avatar_url).then(setSignedAvatarUrl);
      } else {
        setSignedAvatarUrl(null);
      }
    }
  }, [profile]);

  // Initialize reminders from profile on mount only
  const remindersInitialized = useRef(false);
  useEffect(() => {
    if (!remindersInitialized.current && profile && profile.reminders !== undefined) {
      setReminders(profile.reminders);
      remindersInitialized.current = true;
    }
  }, [profile?.reminders]);

  // Check if user is using Google OAuth
  const isGoogleUser = user?.app_metadata?.provider === 'google' || 
                      user?.identities?.some(i => i.provider === 'google');

  // Password health validation
  const getPasswordHealth = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    let strength = 'Weak';
    if (score >= 4) strength = 'Moderate';
    if (score === 5) strength = 'Strong';

    return { checks, strength };
  };

  const passwordHealth = getPasswordHealth(newPassword);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("You're already using this password. Choose a new one.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordHealth.strength === 'Weak') {
      setPasswordError('Password does not meet security requirements');
      return;
    }

    setUpdatingPassword(true);
    try {
      // Re-authenticate with current password
      await reauthenticate(currentPassword);
      
      // Update password
      await updatePassword(newPassword);
      
      // Update password_updated_at in profile
      await updateProfileSettings({ password_updated_at: new Date().toISOString() });
      setLastPasswordUpdate(new Date().toISOString());
      
      setPasswordSuccess('Password updated successfully. Your account is now protected with your new credentials.');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      
      await refresh();
    } catch (error) {
      console.error('Password change error:', error);
      if (error.message?.includes('Invalid login credentials')) {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordError(error.message || 'Failed to update password');
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

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

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const updatedProfile = await uploadAvatar(user.id, file);
      if (updateProfileSettings) {
        await updateProfileSettings({ avatar_url: updatedProfile.avatar_url });
      }
      await refresh();
      showNotification('Avatar updated successfully');
    } catch (error) {
      showNotification(error.message || 'Failed to upload avatar', 'error');
    } finally {
      setUploadingAvatar(false);
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

  const handleSaveReminders = async (value) => {
    const previousValue = reminders;
    try {
      setReminders(value);
      await updateProfileSettings({ reminders: value });
    } catch (error) {
      setReminders(previousValue);
      showNotification("Couldn't update reminders.", 'error');
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
      });
      
      setFeedbackSubmitting(false);
      setFeedbackModalOpen(false);
      showNotification('✓ Feedback Submitted');
      setFeedbackRating(0);
      setFeedbackCategory('');
      setFeedbackMessage('');
    } catch (error) {
      console.error('Feedback submission error:', error);
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
    }
  };

  return (
    <div className="orixus-settings">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp"
        onChange={handleAvatarFileChange}
      />

      {notification && (
        <div className={`orixus-notification orixus-notification--${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Account Section */}
      <div className="orixus-settings__section">
        <div className="orixus-settings__section-title">Account</div>
        <div className="orixus-settings__card">
          <SettingsRow
            icon={<User size={18} />}
            label="Your Profile"
            right={<ChevronRight size={16} />}
            onClick={() => setProfileCardModalOpen(true)}
          />
        </div>
      </div>

      {/* Security Section */}
      <div className="orixus-settings__section">
        <div className="orixus-settings__section-title">Security</div>
        <div className="orixus-settings__card">
          <SettingsRow
            icon={<Shield size={18} />}
            label="Email Verification"
            right={<StatusPill status={user?.email_confirmed_at ? 'verified' : 'pending'} />}
            disabled
          />
          {isGoogleUser ? (
            <SettingsRow
              icon={<Lock size={18} />}
              label="Change Password"
              right={<span className="orixus-settings-row__hint">Managed by Google</span>}
              disabled
            />
          ) : (
            <SettingsRow
              icon={<Lock size={18} />}
              label="Change Password"
              right={<ChevronRight size={16} />}
              onClick={() => setShowPasswordForm(true)}
            />
          )}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="orixus-settings__section">
        <div className="orixus-settings__section-title">Preferences</div>
        <div className="orixus-settings__card">
          <SettingsRow
            icon={<Bell size={18} />}
            label="Reminders"
            right={<PremiumToggle enabled={reminders} onChange={handleSaveReminders} />}
          />
          <SettingsRow
            icon={<Book size={18} />}
            label="Default Journal Mood"
            right={
              <>
                <span className="orixus-settings-row__value">{JOURNAL_MOODS.find(m => m.value === journalMood)?.label || 'Neutral'}</span>
                <ChevronRight size={16} />
              </>
            }
            onClick={() => setEditModal({ type: 'mood', title: 'Default Journal Mood' })}
          />
          <SettingsRow
            icon={<Layout size={18} />}
            label="Habit Display Mode"
            right={
              <>
                <span className="orixus-settings-row__value">{habitDisplayMode === 'date' ? 'Date' : 'Number'}</span>
                <ChevronRight size={16} />
              </>
            }
            onClick={() => setEditModal({ type: 'displayMode', title: 'Habit Display Mode' })}
          />
        </div>
      </div>

      {/* Support Section */}
      <div className="orixus-settings__section">
        <div className="orixus-settings__section-title">Support</div>
        <div className="orixus-settings__card">
          <SettingsRow
            icon={<MessageSquare size={18} />}
            label="Feedback"
            right={<ChevronRight size={16} />}
            onClick={() => setFeedbackModalOpen(true)}
          />
          <SettingsRow
            icon={<Info size={18} />}
            label="About Orixus"
            right={<ChevronRight size={16} />}
            onClick={() => setShowAboutModal(true)}
          />
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="orixus-settings__section">
        <div className="orixus-settings__section-title orixus-settings__section-title--danger">Danger Zone</div>
        <div className="orixus-settings__card orixus-settings__card--danger">
          <SettingsRow
            icon={<RefreshCw size={18} />}
            label="Reset Habits"
            right={<ChevronRight size={16} />}
            onClick={() => setConfirmAction('resetAllHabits')}
          />
          <SettingsRow
            icon={<RefreshCw size={18} />}
            label="Reset Journal"
            right={<ChevronRight size={16} />}
            onClick={() => setConfirmAction('deleteJournal')}
          />
        </div>
      </div>

      {/* Logout Button */}
      <div className="orixus-settings__section">
        <div className="orixus-settings__card">
          <button className="orixus-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Card Modal */}
      <ProfileCardModal
        isOpen={profileCardModalOpen}
        onClose={() => setProfileCardModalOpen(false)}
        profile={profile}
        onUploadClick={() => fileInputRef.current?.click()}
        onSaveUsername={handleSaveUsername}
        uploadingAvatar={uploadingAvatar}
      />

      {/* Password Change Modal */}
      <PasswordModal
        isOpen={showPasswordForm}
        onClose={() => {
          setShowPasswordForm(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordError('');
          setPasswordSuccess('');
        }}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showCurrentPassword={showCurrentPassword}
        setShowCurrentPassword={setShowCurrentPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        passwordHealth={passwordHealth}
        passwordError={passwordError}
        passwordSuccess={passwordSuccess}
        updatingPassword={updatingPassword}
        handlePasswordChange={handlePasswordChange}
        lastPasswordUpdate={lastPasswordUpdate}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        onSave={(value) => {
          if (editModal?.type === 'username') handleSaveUsername(value);
          else if (editModal?.type === 'mood') handleSaveJournalMood(value);
          else if (editModal?.type === 'firstDay') handleSaveFirstDayOfWeek(value);
          else if (editModal?.type === 'displayMode') handleSaveHabitDisplayMode(value);
        }}
        title={editModal?.title || ''}
        currentValue={editModal?.type === 'username' ? username : 
                     editModal?.type === 'mood' ? journalMood :
                     editModal?.type === 'firstDay' ? firstDayOfWeek :
                     editModal?.type === 'displayMode' ? habitDisplayMode : ''}
        type={editModal?.type === 'username' ? 'text' :
              editModal?.type === 'mood' ? 'mood' : 'select'}
        options={editModal?.type === 'mood' ? JOURNAL_MOODS :
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

      {/* About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="orixus-modal-overlay" onClick={handleFeedbackModalClose}>
          <div className="orixus-modal orixus-modal--feedback" onClick={(e) => e.stopPropagation()}>
          <div className="orixus-modal__header">
            <h2 className="orixus-modal__title">Feedback</h2>
            <button className="orixus-modal__close" onClick={handleFeedbackModalClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleFeedbackSubmit}>
            <div className="orixus-modal__field">
              <label className="orixus-modal__label">Rating</label>
              <div className="orixus-modal__stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`orixus-modal__star ${star <= feedbackRating ? 'orixus-modal__star--active' : ''}`}
                    onClick={() => setFeedbackRating(star)}
                    aria-label={`Rate ${star} stars`}
                    disabled={feedbackSubmitting}
                  >
                    <Star size={18} fill={star <= feedbackRating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="orixus-modal__field">
              <label className="orixus-modal__label" htmlFor="feedback-category">Category</label>
              <select
                id="feedback-category"
                className="orixus-modal__select"
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

            <div className="orixus-modal__field">
              <label className="orixus-modal__label" htmlFor="feedback-message">Feedback</label>
              <textarea
                id="feedback-message"
                className="orixus-modal__textarea"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                maxLength={250}
                placeholder="Share your thoughts..."
                required
                disabled={feedbackSubmitting}
              />
              <div className="orixus-modal__char-count">
                {feedbackMessage.length}/250
              </div>
            </div>

            <div className="orixus-modal__actions">
              <button
                type="button"
                className="orixus-modal__btn orixus-modal__btn--secondary"
                onClick={handleFeedbackModalClose}
                disabled={feedbackSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="orixus-modal__btn orixus-modal__btn--primary"
                disabled={feedbackSubmitting}
              >
                {feedbackSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}

