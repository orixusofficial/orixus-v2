import React from 'react';
import SkeletonCard from './SkeletonCard';
import SkeletonText from './SkeletonText';
import SkeletonAvatar from './SkeletonAvatar';
import './skeleton.css';

export default function SettingsSkeleton() {
  return (
    <div className="skeleton-settings">
      <div className="skeleton-settings__profile">
        <SkeletonAvatar size="lg" />
        <SkeletonText lines={2} className="skeleton-settings__info" />
      </div>
      <div className="skeleton-settings__sections">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
