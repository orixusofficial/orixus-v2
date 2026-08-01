import React from 'react';
import SkeletonCard from './SkeletonCard';
import SkeletonStat from './SkeletonStat';
import SkeletonText from './SkeletonText';
import './skeleton.css';

export default function AnalyticsSkeleton() {
  return (
    <div className="skeleton-analytics">
      <div className="skeleton-analytics__overview">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>
      <div className="skeleton-analytics__charts">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
