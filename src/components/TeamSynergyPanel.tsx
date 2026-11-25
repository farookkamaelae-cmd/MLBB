'use client';

import React from 'react';
import { useDraftStore } from '@/store/useDraftStore';
import { calculateTeamStats, calculateDamageTypeRatio, getDraftWarnings, Hero } from '@/utils/draftAnalysis';
import heroesData from '@/data/heroes.json';

export const TeamSynergyPanel: React.FC = () => {
  const { allyPicks } = useDraftStore();
  const allHeroes: Hero[] = heroesData as Hero[];

  const allyIds = allyPicks.filter((h): h is Hero => h !== null).map((h) => h.id);
  const stats = calculateTeamStats(allyIds, allHeroes);
  const damageRatio = calculateDamageTypeRatio(allyIds, allHeroes);
  const warnings = getDraftWarnings(allyIds, allHeroes);

  const metrics = [
    { label: 'CROWD CONTROL', val: stats.cc, color: 'bg-purple-500' },
    { label: 'BURST DAMAGE', val: stats.burst, color: 'bg-red-500' },
    { label: 'DURABILITY', val: stats.durability, color: 'bg-emerald-500' },
    { label: 'MOBILITY', val: stats.mobility, color: 'bg-blue-500' },
    { label: 'LATE GAME SCALING', val: stats.scaling, color: 'bg-[#3d7bff]' },
  ];

  return (
    <div className="bg-[#121317] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5">
      <div className="border-b border-white/10 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-[0.18em] text-[#eef0f3] uppercase font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3d7bff]"></span>
          วิเคราะห์สมดุลทีม (TEAM BALANCE & DAMAGE RATIO)
        </h3>
        <span className="text-[10px] font-mono text-[#8d929b] uppercase tracking-wider">
          LIVE METRICS
        </span>
      </div>

      {/* Warnings & Alerts */}
      {warnings.length > 0 && (
        <div className="space-y-1.5">
          {warnings.map((warn, i) => (
            <div key={i} className="text-xs bg-amber-950/40 border border-amber-500/40 text-amber-200 px-3 py-2 rounded-lg font-mono">
              {warn}
            </div>
          ))}
        </div>
      )}

      {/* Damage Ratio Arc Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-[#8d929b]">
          <span>PHYSICAL: <strong className="text-red-400">{damageRatio.physical}%</strong></span>
          <span>MAGIC: <strong className="text-cyan-400">{damageRatio.magic}%</strong></span>
          <span>TRUE: <strong className="text-amber-400">{damageRatio.trueDmg}%</strong></span>
        </div>
        <div className="h-3 w-full bg-[#0b0c0e] rounded-full overflow-hidden flex border border-white/10 p-0.5">
          <div style={{ width: `${damageRatio.physical}%` }} className="bg-red-500 h-full transition-all duration-500"></div>
          <div style={{ width: `${damageRatio.magic}%` }} className="bg-cyan-400 h-full transition-all duration-500"></div>
          <div style={{ width: `${damageRatio.trueDmg}%` }} className="bg-amber-400 h-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Stats Power Curve Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#0b0c0e] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#8d929b]">{m.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-bold font-mono text-white">{m.val}</span>
              <span className="text-[10px] text-slate-500">/100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div style={{ width: `${m.val}%` }} className={`h-full ${m.color} transition-all duration-500`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
