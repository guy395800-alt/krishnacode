'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  href?: string | null;
  className?: string;
  isLive?: boolean;
}

export const LogoIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; isLive?: boolean; className?: string }> = ({
  size = 'md',
  isLive = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const iconDimensions = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 group ${sizeClasses[size]} ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600/30 via-sky-500/20 to-cyan-400/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* SVG Precision Monogram */}
      <svg
        width={iconDimensions[size]}
        height={iconDimensions[size]}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300"
      >
        <defs>
          <linearGradient id="nexgen-primary-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          <linearGradient id="nexgen-light-grad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="nexgen-tile-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          <linearGradient id="nexgen-tile-border" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Squircle Tile Container */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="url(#nexgen-tile-bg)"
          stroke="url(#nexgen-tile-border)"
          strokeWidth="1.5"
        />

        {/* Geometric Monogram 'N' (Next-Gen Code Chevron Construction) */}
        {/* Left Column / Bracket */}
        <path
          d="M 14 34 L 14 15 C 14 13.895 14.895 13 16 13 L 18 13 C 19.105 13 20 13.895 20 15 L 20 26.5 L 14 34 Z"
          fill="url(#nexgen-primary-grad)"
        />

        {/* Right Column / Terminal */}
        <path
          d="M 28 21.5 L 28 33 C 28 34.105 28.895 35 30 35 L 32 35 C 33.105 35 34 34.105 34 33 L 34 15 C 34 13.895 33.105 13 32 13 L 30 13 C 28.895 13 28 13.895 28 15 Z"
          fill="url(#nexgen-primary-grad)"
        />

        {/* Dynamic High-Velocity Center Slash */}
        <path
          d="M 16.5 13 L 31.5 35 L 34 35 L 19 13 Z"
          fill="url(#nexgen-light-grad)"
        />

        {/* Technical Sub-pixels: Outer Code Flank Accents (< and >) */}
        <path
          d="M 8.5 21 L 6.5 24 L 8.5 27"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        <path
          d="M 39.5 21 L 41.5 24 L 39.5 27"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>

      {/* Real-time System Pulse Beacon */}
      {isLive && (
        <>
          <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping pointer-events-none" />
          <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 pointer-events-none border border-slate-950" />
        </>
      )}
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  href = '/',
  className = '',
  isLive = true
}) => {
  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subtitleSizeClasses = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-xs'
  };

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <LogoIcon size={size} isLive={isLive} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-white font-sans flex items-center leading-none ${textSizeClasses[size]}`}>
            Nexgen<span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">Code</span>
          </span>
          {showSubtitle && (
            <span className={`font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1 leading-none ${subtitleSizeClasses[size]}`}>
              Assessment &amp; Placement Platform
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group transition-transform duration-200 hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
