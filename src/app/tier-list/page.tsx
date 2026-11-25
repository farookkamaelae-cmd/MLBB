'use client';

import React, { useState } from 'react';
import heroesData from '@/data/heroes.json';
import { Hero } from '@/utils/draftAnalysis';

export default function TierListPage() {
  const heroes: Hero[] = heroesData as any[];
  const [selectedLane, setSelectedLane] = useState<string>('All');

  const lanes = ['All', 'Jungler', 'Gold Lane', 'EXP Lane', 'Mid Lane', 'Roamer'];
  const tiers = ['S+', 'S', 'A', 'B'];

  const filteredHeroes = heroes.filter((h) => {
    if (selectedLane === 'All') return true;
    return h.lanes.includes(selectedLane);
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 font-mono max-w-6xl mx-auto">
      <div className="border-b border-white/10 pb-4 space-y-2">
        <h1 className="text-2xl font-extrabold text-white uppercase flex items-center gap-2">
          🏆 HERO TIER LIST (CURRENT PATCH META)
        </h1>
        <p className="text-xs text-slate-400">
          จัดอันดับตามความแข็งแกร่งและอัตราการชนะในระดับ Rank สูงสุด
        </p>
      </div>

      {/* Lane Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {lanes.map((lane) => (
          <button
            key={lane}
            onClick={() => setSelectedLane(lane)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedLane === lane
                ? 'bg-blue-600 text-white border border-blue-400 shadow-lg shadow-blue-600/30'
                : 'bg-[#121317] text-slate-400 hover:bg-slate-800'
            }`}
          >
            {lane}
          </button>
        ))}
      </div>

      {/* Tier Matrix Rows */}
      <div className="space-y-4">
        {tiers.map((tier) => {
          const heroesInTier = filteredHeroes.filter((h) => h.tier === tier);
          const badgeColors: Record<string, string> = {
            'S+': 'bg-red-950 text-red-300 border-red-500/60',
            'S': 'bg-amber-950 text-amber-300 border-amber-500/60',
            'A': 'bg-blue-950 text-blue-300 border-blue-500/60',
            'B': 'bg-slate-800 text-slate-300 border-slate-600',
          };

          return (
            <div key={tier} className="bg-[#121317] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className={`w-16 h-16 rounded-xl border flex items-center justify-center font-extrabold text-xl shrink-0 ${badgeColors[tier]}`}>
                {tier}
              </div>

              <div className="flex-1 flex flex-wrap gap-3">
                {heroesInTier.length === 0 ? (
                  <span className="text-xs text-slate-600 self-center">ไม่มีฮีโร่ในตำแหน่งนี้</span>
                ) : (
                  heroesInTier.map((hero) => (
                    <div key={hero.id} className="relative group flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-slate-950 group-hover:border-blue-400 transition">
                        <img src={hero.avatarUrl} alt={hero.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-slate-300 mt-1 truncate max-w-[60px] text-center">{hero.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
