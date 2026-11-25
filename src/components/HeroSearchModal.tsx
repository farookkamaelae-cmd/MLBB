'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDraftStore } from '@/store/useDraftStore';
import { Hero } from '@/utils/draftAnalysis';

interface HeroSearchModalProps {
  allHeroes: Hero[];
}

export const HeroSearchModal: React.FC<HeroSearchModalProps> = ({ allHeroes }) => {
  const { activeSlot, enemyPicks, allyPicks, bannedHeroes, closeModal, selectHero } = useDraftStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeSlot) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [activeSlot]);

  useEffect(() => {
    if (!activeSlot) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSlot, closeModal]);

  const unavailableIds = useMemo(
    () =>
      new Set([
        ...enemyPicks.filter((h): h is Hero => h !== null).map((h) => h.id),
        ...allyPicks.filter((h): h is Hero => h !== null).map((h) => h.id),
        ...bannedHeroes.filter((h): h is Hero => h !== null).map((h) => h.id),
      ]),
    [enemyPicks, allyPicks, bannedHeroes]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allHeroes.filter((h) => {
      const matchRole = roleFilter === 'All' || h.role === roleFilter;
      if (!matchRole) return false;
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        h.role.toLowerCase().includes(q) ||
        h.lanes.some((l) => l.toLowerCase().includes(q))
      );
    });
  }, [allHeroes, search, roleFilter]);

  if (!activeSlot) return null;

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label="เลือกฮีโร่"
    >
      <div
        className="bg-[#121317] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[86vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-[0.18em] text-white uppercase font-mono">
            SELECT HERO FOR {activeSlot.type.toUpperCase()} SLOT {activeSlot.index + 1}
          </h3>
          <button
            type="button"
            onClick={closeModal}
            aria-label="ปิดหน้าต่าง"
            className="text-slate-400 hover:text-white text-lg px-2"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-white/10 space-y-3 bg-[#0b0c0e]">
          <input
            ref={inputRef}
            type="text"
            placeholder="ค้นหาชื่อฮีโร่ หรือเลน เช่น Fanny, Roamer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121317] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition ${
                  roleFilter === r ? 'bg-blue-600 text-white' : 'bg-[#121317] text-slate-400 hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              ไม่พบฮีโร่ที่ตรงกับเงื่อนไขการค้นหา
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3">
              {filtered.map((hero) => {
                const isSelected = unavailableIds.has(hero.id);
                const imgFailed = !hero.avatarUrl || brokenImages.has(hero.id);

                return (
                  <button
                    key={hero.id}
                    type="button"
                    disabled={isSelected}
                    onClick={() => selectHero(hero)}
                    className={`relative flex flex-col items-center p-2 rounded-xl border transition ${
                      isSelected
                        ? 'opacity-30 border-transparent bg-slate-950 cursor-not-allowed'
                        : 'border-white/10 hover:border-blue-500 bg-[#0b0c0e] hover:bg-slate-900'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 mb-1">
                      {imgFailed ? (
                        <div className="w-full h-full flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
                          {hero.name.slice(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={hero.avatarUrl}
                          alt={hero.name}
                          loading="lazy"
                          onError={() =>
                            setBrokenImages((prev) => new Set(prev).add(hero.id))
                          }
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-200 truncate w-full text-center">
                      {hero.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{hero.role}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 text-[8px] font-mono bg-red-950 text-red-300 border border-red-800/50 px-1 rounded">
                        USED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
