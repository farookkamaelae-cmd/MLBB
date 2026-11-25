'use client';

import React, { useState, useEffect } from 'react';
import { Hero } from '@/utils/draftAnalysis';

export default function HeroesListPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  useEffect(() => {
    async function fetchHeroes() {
      setLoading(true);
      try {
        const res = await fetch(`/api/heroes?role=${role}&search=${search}`);
        const data = await res.json();
        if (data.success) {
          setHeroes(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHeroes();
  }, [role, search]);

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  return (
    <div className="p-4 sm:p-8 space-y-6 font-mono max-w-6xl mx-auto">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white uppercase flex items-center gap-2">
            👥 รายชื่อฮีโร่ทั้งหมด (HERO DATABASE)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ค้นหาฮีโร่ สถิติประจำแพตช์ และแนวทางการออกไอเทม
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ค้นหาชื่อฮีโร่..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#121317] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              role === r
                ? 'bg-blue-600 text-white border border-blue-400'
                : 'bg-[#121317] text-slate-400 hover:bg-slate-800'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Grid of Heroes */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">กำลังโหลดข้อมูลฮีโร่...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {heroes.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHero(h)}
              className="bg-[#121317] border border-white/10 hover:border-blue-500/60 rounded-2xl p-3 flex flex-col items-center transition group text-left"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 mb-2 border border-white/5 group-hover:scale-105 transition">
                <img src={h.avatarUrl} alt={h.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full text-center">
                <h3 className="font-bold text-xs text-white truncate">{h.name}</h3>
                <span className="text-[10px] text-blue-400 block">{h.role}</span>
                <span className="text-[9px] text-emerald-400 mt-1 block">WR: {h.winRate}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Hero Detail Drawer Modal */}
      {selectedHero && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121317] border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedHero.avatarUrl} alt={selectedHero.name} className="w-12 h-12 rounded-xl object-cover border border-blue-500" />
                <div>
                  <h2 className="font-bold text-lg text-white">{selectedHero.name}</h2>
                  <p className="text-xs text-blue-400">{selectedHero.role} · {selectedHero.lanes.join(', ')}</p>
                </div>
              </div>
              <button onClick={() => setSelectedHero(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#0b0c0e] p-3 rounded-xl text-center text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">WIN RATE</span>
                <span className="font-bold text-emerald-400">{selectedHero.winRate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PICK RATE</span>
                <span className="font-bold text-slate-200">{selectedHero.pickRate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">BAN RATE</span>
                <span className="font-bold text-red-400">{selectedHero.banRate}</span>
              </div>
            </div>

            {selectedHero.recommendedBuild && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase">RECOMMENDED BUILD</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHero.recommendedBuild.map((item) => (
                    <span key={item} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">
                      🛡️ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedHero(null)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl transition"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
