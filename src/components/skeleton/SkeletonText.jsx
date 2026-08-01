import React from 'react';
import Skeleton from './Skeleton';
import './skeleton.css';

export default function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="skeleton-text__line"
          style={{ width: i === lines - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
}
