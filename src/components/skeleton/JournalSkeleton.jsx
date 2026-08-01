import React from 'react';
import SkeletonJournalCard from './SkeletonJournalCard';
import './skeleton.css';

export default function JournalSkeleton() {
  return (
    <div className="skeleton-journal">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonJournalCard key={i} />
      ))}
    </div>
  );
}
