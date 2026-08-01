import React from 'react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import './skeleton.css';

export default function SkeletonJournalCard({ className = '' }) {
  return (
    <div className={`skeleton-journal-card ${className}`}>
      <div className="skeleton-journal-card__header">
        <Skeleton className="skeleton-journal-card__date" />
        <Skeleton className="skeleton-journal-card__mood" />
      </div>
      <SkeletonText lines={3} className="skeleton-journal-card__text" />
    </div>
  );
}
