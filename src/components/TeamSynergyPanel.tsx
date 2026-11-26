'use client';

import React from 'react';
import { useDraftStore } from '@/store/useDraftStore';
import type { Hero } from '@/utils/draftAnalysis';

export const TeamSynergyPanel: React.FC = () => {
  const allyPicks = useDraftStore((state) => state.allyPicks);
  const selected = allyPicks.filter((hero): hero is Hero => hero !== null);
  const pairs: Array<[Hero, Hero]> = [];

  for (let left = 0; left < selected.length; left += 1) {
    for (let right = left + 1; right < selected.length; right += 1) {
      const first = selected[left];
      const second = selected[right];
      if (first.synergyWith?.includes(second.id) || second.synergyWith?.includes(first.id)) {
        pairs.push([first, second]);
      }
    }
  }

  const metrics = [
    { key: 'durability', label: 'Durability' },
    { key: 'offense', label: 'Offense' },
    { key: 'abilityEffects', label: 'Ability Effects' },
    { key: 'difficulty', label: 'Difficulty' },
  ] as const;

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-[#121317] p-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Official hero relations and ratings</h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">MLBB data</span>
      </div>

      {selected.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-slate-500">
          Pick allied heroes to see their official in-game ratings and listed synergies.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">Listed synergies</h4>
            {pairs.length ? pairs.map(([first, second]) => (
              <p key={first.id + '-' + second.id} className="rounded-lg bg-[#0b0c0e] px-3 py-2 text-xs text-slate-300">
                {first.name} + {second.name}
              </p>
            )) : <p className="text-xs text-slate-500">The official catalog lists no synergy pair among the selected heroes.</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selected.map((hero) => (
              <div key={hero.id} className="space-y-2 rounded-xl border border-white/5 bg-[#0b0c0e] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">{hero.name}</span>
                  <span className="text-[10px] text-slate-500">{(hero.roles ?? [hero.role]).join(' / ')}</span>
                </div>
                {metrics.map((metric) => {
                  const value = hero.officialRatings?.[metric.key];
                  return (
                    <div key={metric.key} className="grid grid-cols-[92px_1fr_32px] items-center gap-2 text-[10px] text-slate-400">
                      <span>{metric.label}</span>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full bg-blue-500" style={{ width: Math.min(100, Math.max(0, value ?? 0)) + '%' }} />
                      </div>
                      <span className="text-right">{value ?? '—'}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};