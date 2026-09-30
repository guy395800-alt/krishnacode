'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, ArrowRight, X } from 'lucide-react';

export default function StreakModal({ isOpen, onClose, streak = 1, streakIncreased = true, problemTitle = '' }) {
  const [animateCount, setAnimateCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setAnimateCount(0);
      const timer = setTimeout(() => {
        setAnimateCount(streak);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, streak]);

  if (!isOpen) return null;

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-orange-500/30 shadow-2xl shadow-orange-500/20 text-center overflow-hidden transform transition-all animate-scale-up"
      >
        {/* Glowing Flame Backdrop Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Main Animated Fire Icon */}
        <div className="relative mx-auto mb-6 flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full bg-orange-500/20 animate-ping opacity-60"></div>
          <div className="absolute h-36 w-36 rounded-full bg-amber-500/10 animate-pulse"></div>
          
          <div className="relative h-24 w-24 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-1 shadow-lg shadow-orange-500/50 flex items-center justify-center">
            <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
              <Flame className="h-14 w-14 text-orange-500 fill-orange-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            {streakIncreased ? 'Daily Streak Extended!' : 'Streak Maintained!'}
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              {animateCount} Day Streak!
            </span>
            🔥
          </h2>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            {streak === 1
              ? "Awesome start! You solved a problem today and ignited your coding streak!"
              : `Incredible dedication! You have consistently solved problems for ${streak} days in a row!`}
          </p>
        </div>

        {/* 7-Day Visual Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>This Week</span>
            <span className="text-orange-400 font-bold flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-orange-400" /> Active Today
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => {
              const isPastOrToday = idx <= todayIndex;
              const isToday = idx === todayIndex;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isToday
                        ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 shadow-md shadow-orange-500/40 ring-2 ring-orange-400 scale-105'
                        : isPastOrToday
                        ? 'bg-slate-700 text-orange-300 border border-orange-500/20'
                        : 'bg-slate-800/80 text-slate-500 border border-slate-700/40'
                    }`}
                  >
                    {isToday ? (
                      <Flame className="h-4 w-4 fill-slate-950 text-slate-950 animate-pulse" />
                    ) : (
                      day
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold ${isToday ? 'text-orange-400' : 'text-slate-500'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Keep Up The Momentum <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
