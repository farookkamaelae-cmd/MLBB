'use client';

import React, { useState } from 'react';
import { useDraftStore, SlotType } from '@/store/useDraftStore';
import { Hero } from '@/utils/draftAnalysis';
import { ShareDraftButton } from '@/components/ShareDraftButton';

interface SlotGroupProps {
  title: string;
  subtitle: string;
  badgeColor: string;
  slots: (Hero | null)[];
  type: SlotType;
}

export const DraftStage: React.FC = () => {
  const { enemyPicks, allyPicks, bannedHeroes, openModal, removeHero, resetAll } = useDraftStore();
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const markBroken = (heroId: string) => {
    setBrokenImages((prev) => new Set(prev).add(heroId));
  };

  const renderSlotGroup = ({ title, subtitle, badgeColor, slots, type }: SlotGroupProps) => (
    <div className="bg-[#121317] border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
      {/* Knurled aperture accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold tracking-[0.14em] text-[#eef0f3] uppercase flex items-center gap-2 font-mono">
            <span className={`w-2.5 h-2.5 rounded-full ${badgeColor} shadow-[0_0_8px_currentColor]`}></span>
            {title}
          </h2>
          <p className="text-[11px] text-[#8d929b]">{subtitle}</p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
          {slots.filter(Boolean).length} / {slots.length}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {slots.map((hero, idx) => {
          const imgFailed = !hero?.avatarUrl || brokenImages.has(hero.id);

          return (
            <div key={idx} className="flex flex-col items-center">
              {hero ? (
                <div className="relative group w-full aspect-square rounded-xl overflow-hidden border border-white/20 bg-[#0b0c0e] shadow-lg">
                  <button
                    type="button"
                    onClick={() => openModal(type, idx)}
                    className="w-full h-full block"
                    title="คลิกเพื่อเปลี่ยนฮีโร่"
                  >
                    {imgFailed ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-blue-400 font-mono font-bold text-sm">
                        {hero.name.slice(0, 2).toUpperCase()}
                      </div>
                    ) : (
                      <img
                        src={hero.avatarUrl}
                        alt={hero.name}
                        onError={() => markBroken(hero.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHero(type, idx)}
                    aria-label={`ลบ ${hero.name}`}
                    className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/85 text-[10px] font-mono text-center py-0.5 text-white truncate px-1 pointer-events-none">
                    {hero.name}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openModal(type, idx)}
                  className="w-full aspect-square rounded-xl border border-dashed border-white/20 hover:border-blue-500 bg-[#0b0c0e]/60 hover:bg-[#121317] transition flex flex-col items-center justify-center group"
                >
                  <span className="text-xl text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition">+</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">P{idx + 1}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Ban Bar (responsive flex-wrap on mobile) */}
      <div className="bg-[#121317]/80 border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs font-mono font-bold tracking-[0.14em] text-red-400 uppercase">BAN PHASE:</span>
          {[
            { label: 'ENEMY', offset: 0 },
            { label: 'ALLY', offset: 5 },
          ].map(({ label, offset }) => (
          <div key={label} className="flex items-center gap-1.5 sm:gap-2">
            <span className={`text-[9px] font-mono tracking-wider ${label === 'ENEMY' ? 'text-red-300/70' : 'text-blue-300/70'}`}>{label}</span>
            {bannedHeroes.slice(offset, offset + 5).map((hero, slotIndex) => {
              const idx = offset + slotIndex;
              const imgFailed = !hero?.avatarUrl || brokenImages.has(hero.id);
              return (
                <div key={idx} className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border ${label === 'ENEMY' ? 'border-red-500/30' : 'border-blue-500/30'} bg-[#0b0c0e] overflow-hidden relative group`}>
                  {hero ? (
                    <>
                      {imgFailed ? (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-red-300 bg-slate-900">
                          {hero.name.slice(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={hero.avatarUrl}
                          alt={hero.name}
                          onError={() => markBroken(hero.id)}
                          className="w-full h-full object-cover grayscale opacity-70"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeHero('ban', idx)}
                        aria-label={`ยกเลิกแบน ${hero.name}`}
                        className="absolute inset-0 bg-red-950/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openModal('ban', idx)}
                      aria-label={`แบนฮีโร่ช่อง ${idx + 1}`}
                      className="w-full h-full flex items-center justify-center text-xs text-slate-600 hover:text-red-400 transition"
                    >
                      🚫
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <ShareDraftButton />
          <button
            type="button"
            onClick={resetAll}
            className="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 px-3 py-1.5 rounded-lg transition"
          >
            RESET DRAFT
          </button>
        </div>
      </div>

      {/* Enemy & Ally Draft Stage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSlotGroup({
          title: 'ฝั่งตรงข้าม (ENEMY TEAM)',
          subtitle: 'เลือก 1-5 ตัว เพื่อวิเคราะห์จุดอ่อน',
          badgeColor: 'bg-red-500',
          slots: enemyPicks,
          type: 'enemy',
        })}

        {renderSlotGroup({
          title: 'ฝั่งเรา (ALLY TEAM)',
          subtitle: 'เลือก 1-5 ตัว เพื่อวัด Synergy & Balance',
          badgeColor: 'bg-blue-500',
          slots: allyPicks,
          type: 'ally',
        })}
      </div>
    </div>
  );
};
