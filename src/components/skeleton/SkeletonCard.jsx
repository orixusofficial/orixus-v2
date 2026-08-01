import React from 'react';
import Skeleton from './Skeleton';
import './skeleton.css';

export default function SkeletonCard({ className = '', children }) {
  return (
    <div className={`skeleton-card ${className}`}>
      {children || <Skeleton className="skeleton-card__inner" />}
    </div>
  );
}
