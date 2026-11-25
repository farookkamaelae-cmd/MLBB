'use client';

import React from 'react';
import Link from 'next/link';
import heroesData from '@/data/heroes.json';
import { Hero } from '@/utils/draftAnalysis';

export default function DashboardHome() {
  const heroes: Hero[] = heroesData as any[];
  const tierSPlus = heroes.filter((h) => h.tier === 'S+');

  return (
    <div className="p-4 sm:p-8 space-y-8 font-mono max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-950/60 via-[#121317] to-purple-950/40 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-blue-400 border border-blue-500/40 bg-blue-950/60 px-3 py-1 rounded-full">
            MLBB PATCH METRICS · PRO DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            วิเคราะห์ <span className="text-blue-500">DRAFT & COUNTER</span> ฮีโร่ระดับโปร
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            ระบบช่วยวิเคราะห์ตัวข่มสถิติจริง คำนวณ Synergy ทีม 5v5 พร้อมจัดอันดับ Tier Meta ล่าสุด
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/draft-master"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>🪄</span> เริ่มใช้งาน DRAFT MASTER (5v5)
            </Link>
            <Link
              href="/tier-list"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-5 py-3 rounded-xl transition"
            >
              🏆 ดู TIER LIST META
            </Link>
          </div>
        </div>
      </section>

      {/* Tier S+ Recommended Meta Heroes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]"></span>
            ฮีโร่แนะนำระดับ META (TIER S+)
          </h2>
          <Link href="/tier-list" className="text-xs text-blue-400 hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tierSPlus.map((hero) => (
            <div
              key={hero.id}
              className="bg-[#121317] border border-white/10 hover:border-yellow-500/50 rounded-2xl p-4 transition shadow-xl space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-yellow-500/50 bg-slate-950 shrink-0">
                  <img src={hero.avatarUrl} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-base">{hero.name}</h3>
                    <span className="bg-yellow-950 text-yellow-300 border border-yellow-500/50 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {hero.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{hero.role} · {hero.lanes.join(', ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-[#0b0c0e] border border-white/5 rounded-xl p-2 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 block">WIN RATE</span>
                  <span className="font-bold text-emerald-400">{hero.winRate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PICK RATE</span>
                  <span className="font-bold text-slate-200">{hero.pickRate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">BAN RATE</span>
                  <span className="font-bold text-red-400">{hero.banRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Navigation Grid */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">
          เมนูฟีเจอร์หลัก (CORE FEATURES)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'Draft Master 5v5', desc: 'วิเคราะห์ทีมเรียลไทม์', icon: '🪄', href: '/draft-master' },
            { title: 'Tier List', desc: 'จัดอันดับประจำแพตช์', icon: '🏆', href: '/tier-list' },
            { title: 'Counter Pick', desc: 'ค้นหาตัวแก้ทางเดี่ยว', icon: '⚔️', href: '/counter-pick' },
            { title: 'Item Builds', desc: 'ไอเทมและเซ็ตจัดเต็ม', icon: '🔨', href: '/item-build' },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="bg-[#121317] border border-white/10 hover:border-blue-500/50 p-4 rounded-2xl transition hover:-translate-y-1 block space-y-1"
            >
              <div className="text-2xl">{f.icon}</div>
              <div className="font-bold text-xs text-white">{f.title}</div>
              <div className="text-[10px] text-slate-500">{f.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
