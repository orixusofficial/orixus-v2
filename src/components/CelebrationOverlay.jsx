import { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/celebration-overlay.css';

const MILESTONES = [7, 30, 90];

const HEADLINES = {
  7: 'Discipline Achieved',
  30: 'Momentum Unlocked',
  90: 'Consistency Forged',
};

const SUBTEXTS = {
  7: 'You kept your promise to yourself.',
  30: 'Small actions became identity.',
  90: 'You are who you said you would be.',
};

function Particle({ delay, reducedMotion }) {
  const [style] = useState(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
  }));

  if (reducedMotion) return null;

  return <div className="celebration-overlay__particle" style={style} />;
}

export default function CelebrationOverlay({ 
  isOpen, 
  streak, 
  customMilestone, 
  onClose, 
  onCelebrate 
}) {
  const overlayRef = useRef(null);
  const continueButtonRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleContinue = useCallback(() => {
    setIsClosing(true);
    onCelebrate?.();
    setTimeout(() => onClose?.(), 300);
  }, [onCelebrate, onClose]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    setShouldAnimate(true);
    setIsClosing(false);
    continueButtonRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setIsClosing(true);
        setTimeout(() => onClose?.(), 300);
      }
      if (event.key === 'Enter') {
        handleContinue();
      }
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose, handleContinue]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShouldAnimate(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const displayStreak = customMilestone || streak;
  const headline = HEADLINES[displayStreak] || 'Identity Reinforced';
  const subtext = SUBTEXTS[displayStreak] || 'You stayed true to your word.';

  const particles = reducedMotion ? [] : Array.from({ length: 30 }, (_, i) => (
    <Particle key={i} delay={i * 0.05} reducedMotion={false} />
  ));

  return (
    <div
      className={`celebration-overlay${isClosing ? ' celebration-overlay--closing' : ''}`}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Streak milestone: ${displayStreak} days`}
    >
      <div className="celebration-overlay__background" />
      
      <div className={`celebration-overlay__card${isClosing ? ' celebration-overlay__card--closing' : ''}`}>
        <div className="celebration-overlay__number-container">
          <span 
            className={`celebration-overlay__number${shouldAnimate ? ' celebration-overlay__number--animate' : ''}`}
          >
            {displayStreak}
          </span>
        </div>
        
        <div className="celebration-overlay__divider" />
        
        <h2 
          className={`celebration-overlay__headline${shouldAnimate ? ' celebration-overlay__headline--animate' : ''}`}
        >
          {headline}
        </h2>
        
        <p 
          className={`celebration-overlay__subtext${shouldAnimate ? ' celebration-overlay__subtext--animate' : ''}`}
        >
          {subtext}
        </p>

        <button
          ref={continueButtonRef}
          className={`celebration-overlay__continue${isClosing ? ' celebration-overlay__continue--closing' : ''}`}
          onClick={handleContinue}
          type="button"
        >
          Continue →
        </button>
      </div>

      {particles}
    </div>
  );
}
