import { FaApple, FaShareAlt, FaPlus } from 'react-icons/fa';

export default function InstallModal({ onClose }) {
  return (
    <div className="install-modal-overlay" onClick={onClose}>
      <div className="install-modal" onClick={(e) => e.stopPropagation()}>
        <div className="install-modal__header">
          <div className="install-modal__icon">
            <FaApple />
          </div>
          <h3 className="install-modal__title">Install on iPhone</h3>
          <button className="install-modal__close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="install-modal__steps">
          <div className="install-modal__step">
            <div className="install-modal__step-icon">
              <FaShareAlt />
            </div>
            <div className="install-modal__step-content">
              <span className="install-modal__step-number">1</span>
              <p>Tap the Share button at the bottom of the screen</p>
            </div>
          </div>

          <div className="install-modal__step">
            <div className="install-modal__step-icon">
              <span className="install-modal__step-icon-text">Add</span>
            </div>
            <div className="install-modal__step-content">
              <span className="install-modal__step-number">2</span>
              <p>Scroll down and tap "Add to Home Screen"</p>
            </div>
          </div>

          <div className="install-modal__step">
            <div className="install-modal__step-icon">
              <FaPlus />
            </div>
            <div className="install-modal__step-content">
              <span className="install-modal__step-number">3</span>
              <p>Tap "Add" in the top right corner</p>
            </div>
          </div>
        </div>

        <button className="install-modal__button" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
