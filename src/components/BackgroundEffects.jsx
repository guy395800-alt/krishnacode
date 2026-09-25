'use client';

import React from 'react';
import { Code2, Terminal, Cpu, Sparkles, Database, ShieldCheck, Zap, Flame, Binary, Orbit } from 'lucide-react';

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 1. Dynamic Radiant Nebulas & Volumetric Ambient Blooms */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1100px] h-[680px] bg-gradient-to-b from-blue-600/35 via-indigo-600/22 to-transparent blur-[160px] rounded-full animate-orb-1" />
      <div className="absolute top-[22%] right-[-12%] w-[850px] h-[850px] bg-gradient-to-br from-cyan-500/25 via-blue-600/18 to-transparent blur-[170px] rounded-full animate-orb-2" />
      <div className="absolute top-[55%] left-[-15%] w-[850px] h-[750px] bg-gradient-to-tr from-purple-600/25 via-indigo-500/18 to-transparent blur-[180px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-15%] right-[5%] w-[950px] h-[600px] bg-gradient-to-t from-emerald-500/20 via-blue-600/15 to-transparent blur-[170px] rounded-full animate-orb-1" />

      {/* 2. Precision Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-cyber-grid animate-grid-subtle opacity-90" />

      {/* 3. Glowing Radial Beam Center Stage */}
      <div className="absolute top-0 left-0 right-0 h-[720px] bg-radial-vibrant opacity-95" />

      {/* 4. Fine Horizon Accent Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      {/* 5. Floating Ambient Tech Icons with Physics Drift */}
      <div className="absolute top-[12%] left-[5%] opacity-20 hover:opacity-40 transition-opacity text-blue-400 animate-float-slow">
        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 shadow-xl shadow-blue-500/10 backdrop-blur-md">
          <Code2 className="h-9 w-9" />
        </div>
      </div>

      <div className="absolute top-[16%] right-[6%] opacity-20 hover:opacity-40 transition-opacity text-indigo-400 animate-float-reverse">
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
          <Terminal className="h-10 w-10" />
        </div>
      </div>

      <div className="absolute top-[48%] left-[3%] opacity-15 hover:opacity-30 transition-opacity text-purple-400 animate-float-slow">
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 shadow-xl shadow-purple-500/10 backdrop-blur-md">
          <Cpu className="h-10 w-10" />
        </div>
      </div>

      <div className="absolute top-[65%] right-[5%] opacity-20 hover:opacity-40 transition-opacity text-cyan-400 animate-float-reverse">
        <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles className="h-9 w-9" />
        </div>
      </div>

      <div className="absolute bottom-[20%] left-[6%] opacity-15 hover:opacity-35 transition-opacity text-emerald-400 animate-float-slow">
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 shadow-xl shadow-emerald-500/10 backdrop-blur-md">
          <ShieldCheck className="h-9 w-9" />
        </div>
      </div>

      <div className="absolute bottom-[30%] right-[15%] opacity-15 hover:opacity-35 transition-opacity text-amber-400 animate-float-reverse">
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 shadow-xl shadow-amber-500/10 backdrop-blur-md">
          <Flame className="h-9 w-9" />
        </div>
      </div>

      {/* 6. Glowing Ambient Starlight Particle Layer */}
      <div className="absolute inset-0 bg-particles-dust opacity-75" />
    </div>
  );
}
