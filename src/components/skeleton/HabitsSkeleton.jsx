import React from 'react';
import SkeletonHabitRow from './SkeletonHabitRow';
import './skeleton.css';

export default function HabitsSkeleton() {
  return (
    <div className="skeleton-habits">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonHabitRow key={i} />
      ))}
    </div>
  );
}
