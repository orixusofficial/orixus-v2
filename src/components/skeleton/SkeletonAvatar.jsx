import React from 'react';
import Skeleton from './Skeleton';
import './skeleton.css';

export default function SkeletonAvatar({ size = 'md', className = '' }) {
  return (
    <Skeleton 
      className={`skeleton-avatar skeleton-avatar--${size} ${className}`}
    />
  );
}
