'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'cyan' | 'slate';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'blue',
  className = ''
}) => {
  const iconVariants = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/80'
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-sm hover:border-slate-700 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${iconVariants[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
          {value}
        </div>
        {subtext && (
          <div className="text-xs text-slate-400 font-sans">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
