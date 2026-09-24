'use client';

import React from 'react';
import { Code2, Terminal, Cpu, Sparkles, Binary, Database, Layers, ShieldCheck, Zap } from 'lucide-react';

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 1. Rich Glowing Color Spotlights & Gradient Flares */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-blue-600/25 via-indigo-600/15 to-transparent blur-[140px] rounded-full animate-orb-1" />
      <div className="absolute top-[25%] right-[-10%] w-[650px] h-[650px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent blur-[150px] rounded-full animate-orb-2" />
      <div className="absolute top-[55%] left-[-10%] w-[700px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-500/15 to-transparent blur-[160px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[15%] w-[800px] h-[500px] bg-gradient-to-t from-emerald-500/15 via-blue-600/10 to-transparent blur-[150px] rounded-full" />

      {/* 2. Vibrant Tech Grid with Glowing Cyan/Blue Lines */}
      <div className="absolute inset-0 bg-cyber-grid animate-grid-subtle opacity-90" />

      {/* 3. Glowing Radial Beam Center Stage */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-radial-vibrant opacity-90" />

      {/* 4. Floating Tech Elements & Icons */}
      <div className="absolute top-[12%] left-[8%] opacity-20 text-blue-400 animate-float-slow">
        <Code2 className="h-16 w-16" />
      </div>
      <div className="absolute top-[22%] right-[10%] opacity-20 text-indigo-400 animate-float-reverse">
        <Terminal className="h-20 w-20" />
      </div>
      <div className="absolute top-[50%] left-[5%] opacity-15 text-purple-400 animate-float-slow">
        <Cpu className="h-24 w-24" />
      </div>
      <div className="absolute top-[68%] right-[7%] opacity-20 text-cyan-400 animate-float-reverse">
        <Sparkles className="h-16 w-16" />
      </div>
      <div className="absolute bottom-[15%] left-[12%] opacity-15 text-emerald-400 animate-float-slow">
        <Database className="h-16 w-16" />
      </div>
      <div className="absolute bottom-[25%] right-[20%] opacity-15 text-blue-400 animate-float-reverse">
        <Zap className="h-14 w-14" />
      </div>

      {/* 5. Glowing Ambient Particles / Dust Overlay */}
      <div className="absolute inset-0 bg-particles-dust opacity-60" />
    </div>
  );
}
