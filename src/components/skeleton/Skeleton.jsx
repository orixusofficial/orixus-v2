import React from 'react';
import './skeleton.css';

export default function Skeleton({ className = '', style = {} }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
