import React from 'react';
import Skeleton from './Skeleton';
import './skeleton.css';

export default function SkeletonHabitRow({ className = '' }) {
  return (
    <div className={`skeleton-habit-row ${className}`}>
      <Skeleton className="skeleton-habit-row__icon" />
      <div className="skeleton-habit-row__content">
        <Skeleton className="skeleton-habit-row__name" />
        <Skeleton className="skeleton-habit-row__streak" />
      </div>
      <Skeleton className="skeleton-habit-row__checkbox" />
    </div>
  );
}
