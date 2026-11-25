'use client';

import React from 'react';

export const HeaderAperture: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0c0e]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Rotating Aperture Ring Logo */}
        <div className="relative w-10 h-10 rounded-full border border-blue-500/40 bg-[#121317] flex items-center justify-center shadow-[0_0_15px_rgba(61,123,255,0.25)] group">
          <svg className="w-6 h-6 text-blue-500 animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" />
            <polygon points="50,15 65,35 45,45" fill="currentColor" opacity="0.8" />
            <polygon points="85,50 65,65 55,45" fill="currentColor" opacity="0.8" />
            <polygon points="50,85 35,65 55,55" fill="currentColor" opacity="0.8" />
            <polygon points="15,50 35,35 45,55" fill="currentColor" opacity="0.8" />
          </svg>
          <div className="absolute inset-0 rounded-full border border-blue-400/20 scale-110 group-hover:scale-125 transition"></div>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-[0.18em] text-[#eef0f3] uppercase font-mono">
            APERTURE <span className="text-blue-500">DRAFT</span>
          </h1>
          <p className="text-[10px] tracking-[0.24em] text-[#8d929b] font-mono">
            MLBB SYNERGY & COUNTER ENGINE
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400 border border-blue-500/30 bg-blue-950/40 px-3 py-1 rounded-full">
          VER 2.0 · PRO SYNERGY
        </span>
      </div>
    </header>
  );
};
