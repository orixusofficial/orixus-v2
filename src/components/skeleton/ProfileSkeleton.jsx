import React from 'react';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonCard from './SkeletonCard';
import SkeletonStat from './SkeletonStat';
import SkeletonText from './SkeletonText';
import './skeleton.css';

export default function ProfileSkeleton() {
  return (
    <div className="skeleton-profile">
      <div className="skeleton-profile__hero">
        <SkeletonAvatar size="lg" />
        <SkeletonText lines={2} className="skeleton-profile__info" />
      </div>
      <div className="skeleton-profile__stats">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>
      <div className="skeleton-profile__cards">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
