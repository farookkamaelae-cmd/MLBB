'use client';

import React, { useState } from 'react';
import { useDraftStore } from '@/store/useDraftStore';
import { getRecommendedCounters, Hero } from '@/utils/draftAnalysis';
import heroesData from '@/data/heroes.json';

export const CounterRecommendationPanel: React.FC = () => {
  const { enemyPicks, allyPicks, bannedHeroes } = useDraftStore();
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const allHeroes: Hero[] = heroesData as Hero[];

  const enemyIds = enemyPicks.filter((h): h is Hero => h !== null).map((h) => h.id);
  const allyIds = allyPicks.filter((h): h is Hero => h !== null).map((h) => h.id);
  const bannedIds = bannedHeroes.filter((h): h is Hero => h !== null).map((h) => h.id);

  const recommended = getRecommendedCounters(enemyIds, allyIds, bannedIds, allHeroes);
  const topRecommended = recommended.slice(0, 12);

  return (
    <div className="bg-[#121317] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold tracking-[0.18em] text-[#eef0f3] uppercase font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          แนะนำตัว Counter ที่คุ้มค่าที่สุด (OPTIMAL COUNTER PICKS)
        </h3>
        {recommended.length > 0 && (
          <span className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded">
            TOP {topRecommended.length} OF {recommended.length} HEROES
          </span>
        )}
      </div>

      {enemyIds.length === 0 ? (
        <div className="bg-[#0b0c0e]/80 border border-dashed border-white/10 rounded-xl p-10 text-center space-y-1">
          <p className="text-xs font-mono text-slate-400">ยังไม่ได้เลือกฝั่งตรงข้าม</p>
          <p className="text-[11px] text-slate-500">เลือกฮีโร่ฝั่งตรงข้ามในช่อง ENEMY TEAM เพื่อประมวลผลตัวข่ม</p>
        </div>
      ) : topRecommended.length === 0 ? (
        <div className="bg-[#0b0c0e]/80 border border-white/10 rounded-xl p-8 text-center text-xs font-mono text-slate-400">
          ไม่พบตัวแก้ทางเพิ่มเติมในฐานข้อมูล
        </div>
      ) : (
        <div className="space-y-3">
          {topRecommended.map((item, index) => {
            const imgFailed = !item.hero.avatarUrl || brokenImages.has(item.hero.id);

            return (
              <div
                key={item.hero.id}
                className="bg-[#0b0c0e] border border-white/10 hover:border-blue-500/60 rounded-xl p-4 transition shadow-lg flex flex-col sm:flex-row gap-4 group"
              >
                <div className="flex items-center gap-3 sm:w-56 shrink-0">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-blue-500/40 bg-slate-950">
                      {imgFailed ? (
                        <div className="w-full h-full flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
                          {item.hero.name.slice(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={item.hero.avatarUrl}
                          alt={item.hero.name}
                          onError={() =>
                            setBrokenImages((prev) => new Set(prev).add(item.hero.id))
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      )}
                    </div>
                    <span className="absolute -top-2 -left-2 bg-blue-600 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-slate-900 shadow">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight font-mono">{item.hero.name}</h4>
                    <p className="text-xs text-blue-400 font-mono">{item.hero.role}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.hero.lanes.map((lane) => (
                        <span key={lane} className="text-[9px] font-mono bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded">
                          {lane}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">TARGET REASONS</span>
                    <span className="text-xs font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800/60 px-2.5 py-0.5 rounded-full">
                      SCORE: {item.totalScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {item.reasons.map((r, i) => (
                      <div key={i} className="bg-[#121317] border border-white/5 rounded-lg p-2 text-xs flex items-start gap-2 font-mono">
                        <span className="bg-red-950/80 text-red-300 border border-red-800/50 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
                          vs {r.targetHeroName}
                        </span>
                        <p className="text-slate-300 flex-1 leading-relaxed">{r.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
