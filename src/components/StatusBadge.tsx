'use client';

import React from 'react';

type BadgeVariant =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'passed'
  | 'failed'
  | 'running'
  | 'pending'
  | 'upcoming'
  | 'active'
  | 'completed'
  | 'admin'
  | 'student'
  | 'neutral';

interface StatusBadgeProps {
  status: string | BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  className = ''
}) => {
  const normalized = (status || '').toLowerCase().trim();

  let styles = 'bg-slate-800/80 text-slate-300 border-slate-700/80';
  let dotColor = 'bg-slate-400';
  let displayLabel = label || status;

  if (normalized === 'easy' || normalized === 'passed' || normalized === 'active' || normalized === 'success') {
    styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (normalized === 'medium' || normalized === 'pending' || normalized === 'upcoming' || normalized === 'tle' || normalized === 'admin') {
    styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (normalized === 'hard' || normalized === 'failed' || normalized === 'error' || normalized === 'wrong answer') {
    styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-400';
  } else if (normalized === 'running' || normalized === 'student' || normalized === 'evaluating' || normalized === 'in_progress') {
    styles = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    dotColor = 'bg-sky-400';
  } else if (normalized === 'completed' || normalized === 'closed') {
    styles = 'bg-slate-800 text-slate-400 border-slate-700';
    dotColor = 'bg-slate-500';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-semibold border ${sizeClasses} ${styles} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
