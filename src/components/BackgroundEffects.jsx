'use client';

import React from 'react';
import { Code2, Terminal, Cpu, Sparkles, Database, ShieldCheck, Zap, Flame, Binary } from 'lucide-react';

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 1. Dynamic Radiant Color Spotlights & Gradient Flares */}
      <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/30 via-indigo-600/20 to-transparent blur-[150px] rounded-full animate-orb-1" />
      <div className="absolute top-[20%] right-[-10%] w-[750px] h-[750px] bg-gradient-to-br from-cyan-500/25 via-blue-600/18 to-transparent blur-[160px] rounded-full animate-orb-2" />
      <div className="absolute top-[50%] left-[-12%] w-[800px] h-[700px] bg-gradient-to-tr from-purple-600/25 via-indigo-500/18 to-transparent blur-[170px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[10%] w-[900px] h-[550px] bg-gradient-to-t from-emerald-500/20 via-blue-600/15 to-transparent blur-[160px] rounded-full animate-orb-1" />

      {/* 2. High-Tech Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-cyber-grid animate-grid-subtle opacity-80" />

      {/* 3. Glowing Radial Beam Center Stage */}
      <div className="absolute top-0 left-0 right-0 h-[650px] bg-radial-vibrant opacity-95" />

      {/* 4. Floating Decorative Tech Badges with Keyframe Physics */}
      <div className="absolute top-[10%] left-[6%] opacity-25 text-blue-400 animate-float-slow">
        <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/20 shadow-lg shadow-blue-500/10 backdrop-blur-md">
          <Code2 className="h-10 w-10" />
        </div>
      </div>

      <div className="absolute top-[18%] right-[8%] opacity-25 text-indigo-400 animate-float-reverse">
        <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
          <Terminal className="h-12 w-12" />
        </div>
      </div>

      <div className="absolute top-[45%] left-[4%] opacity-20 text-purple-400 animate-float-slow">
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 shadow-lg shadow-purple-500/10 backdrop-blur-md">
          <Cpu className="h-12 w-12" />
        </div>
      </div>

      <div className="absolute top-[62%] right-[6%] opacity-25 text-cyan-400 animate-float-reverse">
        <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles className="h-10 w-10" />
        </div>
      </div>

      <div className="absolute bottom-[18%] left-[8%] opacity-20 text-emerald-400 animate-float-slow">
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
          <ShieldCheck className="h-10 w-10" />
        </div>
      </div>

      <div className="absolute bottom-[28%] right-[18%] opacity-20 text-amber-400 animate-float-reverse">
        <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/20 shadow-lg shadow-amber-500/10 backdrop-blur-md">
          <Flame className="h-10 w-10" />
        </div>
      </div>

      {/* 5. Glowing Ambient Particles / Dust Layer */}
      <div className="absolute inset-0 bg-particles-dust opacity-75" />
    </div>
  );
}
