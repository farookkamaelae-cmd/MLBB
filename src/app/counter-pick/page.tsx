'use client';

import React, { useState } from 'react';
import { useHeroes } from '@/hooks/useHeroes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export default function CounterPickPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 250);
  const { heroes: allHeroes, loading, error, reload, source, period, rankingWarning, updatedAt } = useHeroes();
  const filteredHeroes = allHeroes.filter((hero) => hero.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const selectedHero = allHeroes.find((hero) => hero.id === selectedHeroId) ?? null;

  return (
    <div className="p-4 sm:p-8 space-y-6 font-mono max-w-6xl mx-auto">
      <div className="border-b border-white/10 pb-4 space-y-1">
        <h1 className="text-2xl font-extrabold text-white uppercase flex items-center gap-2">
          ⚔️ COUNTER PICK FINDER (ค้นหาตัวข่มรายฮีโร่)
        </h1>
        <p className="text-xs text-slate-400">Select an enemy hero to see matchup relations listed by MLBB and official play rates.</p>
        <p className="text-[10px] text-slate-500">{source}{period ? " | " + period : ""}{updatedAt ? " | Updated " + new Date(updatedAt).toLocaleString() : ""}</p>
        {rankingWarning ? <p role="status" className="text-xs text-amber-300">{rankingWarning}</p> : null}
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search heroes…"
        aria-label="Search heroes"
        className="w-full sm:max-w-sm bg-[#121317] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
      />

      {/* Select Target Hero Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          1. เลือกฮีโร่ฝั่งตรงข้ามที่ต้องการแก้ทาง:
        </h2>
        {loading ? <p className="text-sm text-slate-400">Loading heroes…</p> : error ? (
          <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200">{error}<button onClick={reload} className="ml-3 underline">Retry</button></div>
        ) : <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {filteredHeroes.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHeroId(h.id)}
              className={`p-2 rounded-xl border flex flex-col items-center transition ${
                selectedHero?.id === h.id
                  ? 'bg-blue-600/30 border-blue-500'
                  : 'bg-[#121317] border-white/10 hover:border-white/30'
              }`}
            >
              <img src={h.avatarUrl} alt={h.name} className="w-10 h-10 rounded-lg object-cover mb-1" />
              <span className="text-[10px] text-white truncate w-full text-center">{h.name}</span>
            </button>
          ))}
        </div>}
      </div>

      {/* Counter Analysis Result */}
      {selectedHero ? (
        <div className="bg-[#121317] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <img src={selectedHero.avatarUrl} alt={selectedHero.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500" />
            <div>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/50 px-2 py-0.5 rounded uppercase font-bold">TARGET ENEMY</span>
              <h2 className="text-2xl font-extrabold text-white">{selectedHero.name}</h2>
              <p className="text-xs text-slate-400">{(selectedHero.roles ?? [selectedHero.role]).join(' / ')} · {selectedHero.lanes.join(', ')}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#0b0c0e] p-3 text-center text-[10px]">
            <div><span className="block text-slate-500">WIN RATE</span><span className="text-emerald-300">{selectedHero.winRate ?? '-'}</span></div>
            <div><span className="block text-slate-500">PICK RATE</span><span className="text-slate-200">{selectedHero.pickRate ?? '-'}</span></div>
            <div><span className="block text-slate-500">BAN RATE</span><span className="text-red-300">{selectedHero.banRate ?? '-'}</span></div>
          </div>

          {/* Counters list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              ฮีโร่ที่ชนะทาง {selectedHero.name} (RECOMMENDED COUNTERS)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedHero.counteredBy.map((cb) => {
                const counterHero = allHeroes.find((h) => h.id === cb.heroId);
                return (
                  <div key={cb.heroId} className="bg-[#0b0c0e] border border-white/10 rounded-xl p-4 flex gap-3">
                    {counterHero && (
                      <img src={counterHero.avatarUrl} alt={counterHero.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-500 shrink-0" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{counterHero?.name || cb.heroId}</h4>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">MLBB matchup</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{cb.reason || 'Official listing provided without a description.'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-[#121317] border border-dashed border-white/10 rounded-2xl p-12 text-center text-xs text-slate-500">
          กดเลือกฮีโร่ฝั่งตรงข้ามด้านบน เพื่อเริ่มวิเคราะห์ตัวแก้ทาง
        </div>
      )}
    </div>
  );
}
