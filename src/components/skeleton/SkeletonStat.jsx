import React from 'react';
import Skeleton from './Skeleton';
import './skeleton.css';

export default function SkeletonStat({ className = '' }) {
  return (
    <div className={`skeleton-stat ${className}`}>
      <Skeleton className="skeleton-stat__value" />
      <Skeleton className="skeleton-stat__label" />
    </div>
  );
}
