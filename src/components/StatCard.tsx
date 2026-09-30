'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

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
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/40',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/80 group-hover:border-slate-600'
  };

  // Check if value is numeric or numeric with suffix (e.g. 85, "85%", "100 pts", "+12")
  const renderValue = () => {
    if (typeof value === 'number') {
      return <AnimatedCounter value={value} />;
    }

    if (typeof value === 'string') {
      const match = value.match(/^([^0-9.-]*)([0-9]+(?:\.[0-9]+)?)([^0-9.]*)$/);
      if (match) {
        const prefix = match[1];
        const num = parseFloat(match[2]);
        const suffix = match[3];
        if (!isNaN(num)) {
          return <AnimatedCounter value={num} prefix={prefix} suffix={suffix} />;
        }
      }
    }

    return <span>{value}</span>;
  };

  return (
    <div
      className={`group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-sm interactive-card ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
          {label}
        </span>
        <div className={`p-2 rounded-xl border transition-colors ${iconVariants[variant]}`}>
          <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
          {renderValue()}
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
