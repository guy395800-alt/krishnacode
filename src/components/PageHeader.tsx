'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  backHref,
  badge,
  actions,
  className = ''
}) => {
  return (
    <div className={`space-y-2 mb-6 sm:mb-8 font-sans ${className}`}>
      {/* Breadcrumbs or Back Link */}
      {(breadcrumbs || backHref) && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
          )}

          {breadcrumbs && (
            <nav className="flex items-center gap-1.5 flex-wrap">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-slate-200 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? 'text-slate-200 font-medium' : ''}>
                        {crumb.label}
                      </span>
                    )}
                    {!isLast && <ChevronRight className="h-3.5 w-3.5 text-slate-600" />}
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>
      )}

      {/* Main Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
