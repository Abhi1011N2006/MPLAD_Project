import React from 'react';

export default function RiskBadge({ score, level, showScore = true, size = 'md' }) {
  // Determine risk level if only score is provided
  let calculatedLevel = level;
  if (!calculatedLevel && score !== undefined) {
    if (score <= 30) calculatedLevel = 'LOW';
    else if (score <= 60) calculatedLevel = 'MEDIUM';
    else if (score <= 80) calculatedLevel = 'HIGH';
    else calculatedLevel = 'CRITICAL';
  }

  const styles = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300',
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300',
  };

  const dots = {
    LOW: 'bg-emerald-500',
    MEDIUM: 'bg-amber-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-rose-600 animate-pulse',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const currentStyle = styles[calculatedLevel] || styles.LOW;
  const currentDot = dots[calculatedLevel] || dots.LOW;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${currentStyle} ${sizeClasses[size]}`}>
      <span className={`w-2 h-2 rounded-full ${currentDot}`} />
      <span>{calculatedLevel}</span>
      {showScore && score !== undefined && (
        <span className="opacity-75 text-[11px] font-mono">({score}/100)</span>
      )}
    </span>
  );
}
