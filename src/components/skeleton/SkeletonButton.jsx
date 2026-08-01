import React from 'react';
import Skeleton from './Skeleton';
import './skeleton.css';

export default function SkeletonButton({ className = '' }) {
  return (
    <Skeleton className={`skeleton-button ${className}`} />
  );
}
