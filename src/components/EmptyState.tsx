'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, Inbox, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 mb-4 shadow-inner">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1.5 font-sans">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed font-sans">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
