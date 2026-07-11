import { useEffect, useRef, useState, useCallback } from 'react';
import { RANKS } from '../utils/ranks';
import '../styles/rank-ceremony.css';

function Particle({ delay, reducedMotion }) {
  const [style] = useState(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
  }));

  if (reducedMotion) return null;

  return <div className="rank-ceremony__particle" style={style} />;
}

export default function RankPromotionCeremony({ 
  isOpen, 
  oldRank, 
  newRank, 
  onClose, 
  onPromote 
}) {
  const overlayRef = useRef(null);
  const continueButtonRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleContinue = useCallback(() => {
    setIsClosing(true);
    onPromote?.();
    setTimeout(() => onClose?.(), 300);
  }, [onPromote, onClose]);

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

  const particles = reducedMotion ? [] : Array.from({ length: 20 }, (_, i) => (
    <Particle key={i} delay={i * 0.08} reducedMotion={false} />
  ));

  return (
    <div
      className={`rank-ceremony${isClosing ? ' rank-ceremony--closing' : ''}`}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Rank promotion: ${oldRank} to ${newRank}`}
    >
      <div className="rank-ceremony__background" />
      
      <div className={`rank-ceremony__card${isClosing ? ' rank-ceremony__card--closing' : ''}`}>
        <div className="rank-ceremony__header">
          ORIXUS
        </div>

        <h1 
          className={`rank-ceremony__title${shouldAnimate ? ' rank-ceremony__title--animate' : ''}`}
        >
          IDENTITY EVOLVED
        </h1>

        <div className="rank-ceremony__transition">
          <div 
            className={`rank-ceremony__rank rank-ceremony__rank--old${shouldAnimate ? ' rank-ceremony__rank--old-animate' : ''}`}
          >
            {oldRank}
          </div>
          
          <div 
            className={`rank-ceremony__arrow${shouldAnimate ? ' rank-ceremony__arrow--animate' : ''}`}
          >
            ↓
          </div>
          
          <div className="rank-ceremony__rank rank-ceremony__rank--new-container">
            <div 
              className={`rank-ceremony__rank rank-ceremony__rank--new${shouldAnimate ? ' rank-ceremony__rank--new-animate' : ''}`}
            >
              {newRank}
            </div>
            <div 
              className={`rank-ceremony__underline${shouldAnimate ? ' rank-ceremony__underline--animate' : ''}`}
            />
          </div>
        </div>

        <p 
          className={`rank-ceremony__supporting-text${shouldAnimate ? ' rank-ceremony__supporting-text--animate' : ''}`}
        >
          Unlocked because you stayed consistent.
          <br />
          Not because you got lucky.
        </p>

        <div 
          className={`rank-ceremony__ladder${shouldAnimate ? ' rank-ceremony__ladder--animate' : ''}`}
        >
          {RANKS.map((rank) => (
            <div
              key={rank.name}
              className={`rank-ceremony__ladder-item${
                rank.name === newRank ? ' rank-ceremony__ladder-item--current' : ''
              }`}
            >
              {rank.name === newRank && <span className="rank-ceremony__ladder-arrow">► </span>}
              {rank.name}
            </div>
          ))}
        </div>

        <button
          ref={continueButtonRef}
          className={`rank-ceremony__continue${isClosing ? ' rank-ceremony__continue--closing' : ''}`}
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
