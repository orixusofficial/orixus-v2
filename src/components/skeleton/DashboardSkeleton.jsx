import React from 'react';
import SkeletonCard from './SkeletonCard';
import SkeletonStat from './SkeletonStat';
import SkeletonText from './SkeletonText';
import './skeleton.css';

export default function DashboardSkeleton() {
  return (
    <div className="skeleton-dashboard">
      <div className="skeleton-dashboard__stats">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>
      <div className="skeleton-dashboard__main">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
